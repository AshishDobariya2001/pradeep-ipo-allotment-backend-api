export enum ROLES {
  CUSTOMER = 'customer',

  ADMIN = 'admin',
}
// Define your roles here

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
  ALLOTMENT = 'allotment',
  SCREENER = 'screener',
  SCREENER_WEB = 'screener-web',
} // {{ edit_1 }}
