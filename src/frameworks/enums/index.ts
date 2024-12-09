export enum ROLES {
  CUSTOMER = 'customer',

  ADMIN = 'admin',
  ANONYMOUS = 'anonymous',
}

export enum IpoCalendarStatus {
  Open = 'open',
  Live = 'live',
  Allotment = 'allotment',
  Close = 'close',
  Refunds = 'refunds',
  CreditOfSharesToDemat = 'credit_of_shares_to_demat',
  Listing = 'listing',
}

export enum IpoCalendarSubStatus {
  IpoOpen = 'ipo_open',
  IpoClose = 'ipo_close',
  Allotment = 'allotment',
  Refunds = 'refunds',
  CreditOfSharesToDemat = 'credit_of_shares_to_demat',
  Listing = 'listing',
}

export enum UserPlatformType {
  ALLOTMENT_MOBILE_APPLICATION = 'ipo_allotment_mobile_application',
  ALLOTMENT = 'allotment',
  SCREENER = 'screener',
  SCREENER_WEB = 'screener-web',
}

export enum DefaultStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  INVITED = 'invited',
}
