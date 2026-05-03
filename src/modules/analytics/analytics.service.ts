import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { LeadRepository } from 'src/DB/repositories/lead.repository';
import { DealRepository } from 'src/DB/repositories/deal.repository';
import { PropertyRepository } from 'src/DB/repositories/property.repository';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly dealRepository: DealRepository,
    private readonly propertyRepository: PropertyRepository,
  ) {}

  // ==========================================
  // 📊 1. ملخص لوحة التحكم الرئيسية (Dashboard)
  // ==========================================
  async getDashboardSummary(companyId: Types.ObjectId) {
    // نستخدم limit: 1 لأننا نحتاج فقط إلى الـ totalSize (العدد الإجمالي) لتقليل الحمل على الذاكرة

    // 1. إحصائيات العملاء
    const totalLeads = await this.leadRepository.findAll({
      filter: { isDeleted: false },
      paginate: { page: 1, limit: 1 },
      companyId,
    });

    const newLeads = await this.leadRepository.findAll({
      filter: { status: 'new', isDeleted: false },
      paginate: { page: 1, limit: 1 },
      companyId,
    });

    // 2. إحصائيات العقارات
    const activeProperties = await this.propertyRepository.findAll({
      filter: { status: 'available' as any, isDeleted: false },
      paginate: { page: 1, limit: 1 },
      companyId,
    });

    // 3. إحصائيات الصفقات والأرباح
    // هنا نجلب البيانات لحساب إجمالي الأرباح من الصفقات الناجحة (Won)
    const wonDeals = await this.dealRepository.findAll({
      filter: { stage: 'won' as any },
      paginate: { page: 1, limit: 5000 }, // نجلب الصفقات الناجحة لجمع مبالغها
      companyId,
    });

    // حساب إجمالي الإيرادات (Total Revenue)
    const totalRevenue = wonDeals.data.reduce(
      (sum, deal) => sum + (deal.amount || 0),
      0,
    );

    return {
      overview: {
        total_leads: totalLeads.totalSize,
        new_leads: newLeads.totalSize,
        active_properties: activeProperties.totalSize,
        won_deals_count: wonDeals.totalSize,
        total_revenue: totalRevenue,
      },
    };
  }

  // ==========================================
  // 📈 2. تقرير أداء المبيعات (Sales Performance)
  // ==========================================
  async getSalesPerformance(
    companyId: Types.ObjectId,
    startDate?: string,
    endDate?: string,
  ) {
    // بناء فلتر التاريخ إذا تم تمريره من الـ Front-end
    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // جلب كل الصفقات في هذه الفترة لهذه الشركة
    const allDeals = await this.dealRepository.findAll({
      filter: { ...dateFilter },
      paginate: { page: 1, limit: 10000 },
      populate: { path: 'assigned_to', select: 'name email' }, // لمعرفة الموظف المسؤول
      companyId,
    });

    const deals = allDeals.data;

    // حساب معدل التحويل (Conversion Rate)
    const totalDealsCount = deals.length;
    const wonDealsCount = deals.filter((deal) => deal.stage === 'won').length;
    const lostDealsCount = deals.filter((deal) => deal.stage === 'lost').length;

    const conversionRate =
      totalDealsCount > 0
        ? ((wonDealsCount / totalDealsCount) * 100).toFixed(2)
        : 0;

    // تجميع أداء الموظفين (Top Agents)
    const agentsPerformance = {};
    deals.forEach((deal) => {
      if (deal.assigned_to) {
        const agentId = deal.assigned_to._id.toString();
        const agentName = deal.assigned_to.name;

        if (!agentsPerformance[agentId]) {
          agentsPerformance[agentId] = {
            agent_name: agentName,
            deals_handled: 0,
            deals_won: 0,
            revenue_generated: 0,
          };
        }

        agentsPerformance[agentId].deals_handled += 1;

        if (deal.stage === 'won') {
          agentsPerformance[agentId].deals_won += 1;
          agentsPerformance[agentId].revenue_generated += deal.amount || 0;
        }
      }
    });

    // تحويل الكائن إلى مصفوفة وترتيبها حسب الإيرادات (الأعلى أولاً)
    const topAgents = Object.values(agentsPerformance).sort(
      (a: any, b: any) => b.revenue_generated - a.revenue_generated,
    );

    return {
      performance_metrics: {
        total_deals_created: totalDealsCount,
        won_deals: wonDealsCount,
        lost_deals: lostDealsCount,
        conversion_rate_percentage: Number(conversionRate),
      },
      top_performing_agents: topAgents,
    };
  }
}
