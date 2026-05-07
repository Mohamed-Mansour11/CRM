export enum LeadSource {
  website = 'website',
  whatsapp = 'whatsapp',
  referral = 'referral',
  walk_in = 'walk_in',
  portal = 'portal',
  social = 'social',
}

export enum LeadStatus {
  new = 'new',
  contacted = 'contacted',
  qualified = 'qualified',
  negotiating = 'negotiating',
  won = 'won',
  lost = 'lost',
}

export enum Purpose {
  buy = 'buy',
  rent = 'rent',
  invest = 'invest',
}

export enum PropertyType {
  apartment = 'apartment',
  villa = 'villa',
  duplex = 'duplex',
  penthouse = 'penthouse',
  commercial = 'commercial',
  land = 'land',
}

// الـ Enums الجديدة التي تم إضافتها لحل الخطأ
export enum MoveInTimeframe {
  immediately = 'immediately',
  one_to_three_months = '1-3 months',
  three_to_six_months = '3-6 months',
  six_to_twelve_months = '6-12 months',
  one_plus_year = '1+ year',
}

export enum UrgencyLevel {
  low = 'low',
  medium = 'medium',
  high = 'high',
}
