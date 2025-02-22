export const ERROR = {
  INTERNAL_SERVER_ERROR: {
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  },
  UNPROCESSOR_ENTITY_ERROR: {
    message: 'Unprocessor entity error',
    code: 'UNPROCESSOR_ENTITY_ERROR',
  },
  NO_PAYLOAD_FOUND: {
    message: 'No payload found. Please enter encrypted data.',
    code: 'NO_PAYLOAD_FOUND',
  },
  INVALIDATE_REQUEST: {
    message: 'Invalid request',
    code: 'INVALIDATE_REQUEST',
  },
  USER_ALREADY_EXISTS: {
    message: 'User already exists',
    code: 'USER_ALREADY_EXISTS',
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    code: 'USER_NOT_FOUND',
  },
  USER_NOT_FOUND_TRY_AGAIN: {
    message: 'User not found, please login again',
    code: 'USER_NOT_FOUND',
  },
  INVALID_OTP: {
    message: 'The OTP you entered is invalid. Please try again.',
    code: 'INVALID_OTP',
  },
  USER_IS_NOT_VERIFIED: {
    message: 'User is not verified. Please verify your account.',
    code: 'USER_IS_NOT_VERIFIED',
  },
  UNAUTHORIZED: {
    message: 'Unauthorized access',
    code: 'UNAUTHORIZED',
  },
  INVALID_PLATFORM: {
    message: 'invalid platform',
    code: 'INVALID_PLATFORM',
  },
  UNABLE_TO_FETCH_COMPANY_LIST: {
    message: 'Failed to fetch company list',
    code: 'UNABLE_TO_FETCH_COMPANY_LIST',
  },
  UNABLE_TO_FETCH_ALLOTMENT_STATUS: {
    message: 'Failed to fetch data of allotment',
    code: 'UNABLE_TO_FETCH_ALLOTMENT_STATUS',
  },
  INVALID_PAN_NUMBER: {
    message: 'Invalid pan number',
    code: 'INVALID_PAN_NUMBER',
  },
  IPO_ALLOTMENT_IS_NOT_AVAILABLE: {
    message: 'ipo allotment is not available',
    code: 'IPO_ALLOTMENT_IS_NOT_AVAILABLE',
  },
  WE_DID_NOT_HAVE_THIS_REGISTRAR: {
    message: 'We did not have this registrar',
    code: 'WE_DID_NOT_HAVE_THIS_REGISTRAR',
  },
  INVALID_PIN: {
    message: 'Invalid pin. please reset your pin.',
    code: 'INVALID_PIN',
  },
  CONTACT_IS_NOT_FOUND: {
    message: 'Contact is not found',
    code: 'CONTACT_IS_NOT_FOUND',
  },
};
export enum HttpStatusCode {
  Success = 200,
  Created = 201,
  Found = 302,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ConflictError = 409,
  Forbidden = 403,
  UnsupportedMedia = 415,
  InternalServerError = 500,
  // Error = 201,
  // UserNotFound = 204,
  // AccountUnderReview = 211,
  // ServiceUnavailable = 503,
  // Found = 302,
  // PasswordExpired = 206,
  // NeedOtpConfirmation = 205,
  // OTPExpired = 203,
  // AppointmentSlotBooked = 208,
  // ClinicianNotAvailable = 209,
  // DuplicateFormName = 229,
  // DuplicateFormGroupName = 230,
  // DuplicateQuestionName = 231,
  // DuplicateRSFormName = 232,
  // DuplicateRSQuestionName = 233,
  // NotDeleteAdminRole = 234,
  // DuplicateDiagnosisCode = 235,
  // DuplicateQualificationName = 236,
  // DuplicateAddressProofTypeName = 237,
  // DuplicateIdProofTypeName = 238,
  // DuplicateStateName = 239,
  // DuplicateRxFrequencyName = 240,
  // DuplicateRxIntakeMethod = 241,
  // DuplicateEmailTemplateName = 243,
  // DuplicateRsDoseName = 245,
  // DuplicateEmailName = 246,
  // AllNotificationRead = 248,
  // ActiveStatusExists = 249,
}
