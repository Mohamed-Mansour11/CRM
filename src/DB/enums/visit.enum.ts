export enum VisitStatus {
  scheduled = 'scheduled', // تمت جدولتها
  confirmed = 'confirmed', // تم التأكيد مع العميل
  completed = 'completed', // تمت الزيارة بنجاح
  cancelled = 'cancelled', // ألغيت
  no_show = 'no_show', // العميل لم يحضر
}

export enum VisitOutcome {
  interested = 'interested', // مهتم
  needs_more_options = 'needs_more_options', // يحتاج خيارات أخرى
  not_interested = 'not_interested', // غير مهتم
  ready_to_close = 'ready_to_close', // جاهز للتعاقد
}
