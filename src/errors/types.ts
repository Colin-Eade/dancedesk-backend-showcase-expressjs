export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export enum StatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export const ERROR_STATUS_MAP: Record<ErrorCode, StatusCode> = {
  [ErrorCode.BAD_REQUEST]: StatusCode.BAD_REQUEST,
  [ErrorCode.UNAUTHORIZED]: StatusCode.UNAUTHORIZED,
  [ErrorCode.FORBIDDEN]: StatusCode.FORBIDDEN,
  [ErrorCode.NOT_FOUND]: StatusCode.NOT_FOUND,
  [ErrorCode.CONFLICT]: StatusCode.CONFLICT,
  [ErrorCode.INTERNAL_SERVER_ERROR]: StatusCode.INTERNAL_SERVER_ERROR,
  [ErrorCode.SERVICE_UNAVAILABLE]: StatusCode.SERVICE_UNAVAILABLE,
};

export interface ValidationDetail {
  field: string;
  message: string;
}

export interface ConflictResource {
  id: string;
  name: string;
  conflicts: string[];
}

export interface ConflictGroup {
  resourceType: string;
  resources: ConflictResource[];
}
