export enum DealStage {
  offer = 'offer', // تقديم عرض سعر
  negotiation = 'negotiation', // تفاوض
  contract_signed = 'contract_signed', // توقيع العقد
  closed_won = 'closed_won', // صفقة رابحة (مغلقة)
  closed_lost = 'closed_lost', // صفقة خاسرة
}
