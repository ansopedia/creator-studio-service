import { z } from "zod";

import { STATUS_CODES } from "./status-code.constant";

const errorType = [
  "VALIDATION_ERROR",
  "DUPLICATE_KEY_VALUE",
  "INTERNAL_SERVER_ERROR",
  "RESOURCE_NOT_FOUND",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NO_AUTH_HEADER",
  "INVALID_ACCESS",
  "TOKEN_EXPIRED",
  "INVALID_TOKEN",
  "INVALID_TOKEN_TYPE",
  "ORIGIN_IS_UNDEFINED",
  "ORIGIN_NOT_ALLOWED",
  "INITIAL_SETUP_FAILED",
  "NOT_ENOUGH_PERMISSION",
  "TOO_MANY_REQUESTS",
  "TOKEN_NOT_ACTIVE",
  "INVALID_TOKEN_AUDIENCE",
] as const;

export const ErrorTypeEnum = z.enum(errorType);

export const errorMap = {
  [ErrorTypeEnum.enum.VALIDATION_ERROR]: {
    httpStatusCode: STATUS_CODES.BAD_REQUEST,
    body: { code: "validation_error", message: "Validation failed" },
  },
  [ErrorTypeEnum.enum.DUPLICATE_KEY_VALUE]: {
    httpStatusCode: STATUS_CODES.CONFLICT,
    body: { code: "duplicate_key_value", message: "Duplicate key value" },
  },
  [ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR]: {
    httpStatusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    body: { code: "internal_server_error", message: "Internal server error" },
  },
  [ErrorTypeEnum.enum.RESOURCE_NOT_FOUND]: {
    httpStatusCode: STATUS_CODES.NOT_FOUND,
    body: { code: "resource_not_found", message: "Resource not found" },
  },
  [ErrorTypeEnum.enum.UNAUTHORIZED]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: "unauthorized", message: "Unauthorized" },
  },
  [ErrorTypeEnum.enum.FORBIDDEN]: {
    httpStatusCode: STATUS_CODES.FORBIDDEN,
    body: { code: "forbidden", message: "Forbidden" },
  },
  [ErrorTypeEnum.enum.NO_AUTH_HEADER]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: "no_auth_header", message: "No authorization header" },
  },
  [ErrorTypeEnum.enum.INVALID_ACCESS]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: "invalid_access", message: "Invalid access" },
  },
  [ErrorTypeEnum.enum.TOKEN_EXPIRED]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: "token_expired", message: "Token expired" },
  },
  [ErrorTypeEnum.enum.INVALID_TOKEN]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: "invalid_token", message: "Invalid token" },
  },
  [ErrorTypeEnum.enum.INVALID_TOKEN_TYPE]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: "invalid_token_type", message: "Invalid token type" },
  },
  [ErrorTypeEnum.enum.ORIGIN_IS_UNDEFINED]: {
    httpStatusCode: STATUS_CODES.BAD_REQUEST,
    body: { code: "origin_is_undefined", message: "Origin is undefined" },
  },
  [ErrorTypeEnum.enum.ORIGIN_NOT_ALLOWED]: {
    httpStatusCode: STATUS_CODES.FORBIDDEN,
    body: {
      code: "origin_not_allowed",
      message: "CORS error: Origin not allowed",
    },
  },
  [ErrorTypeEnum.enum.INITIAL_SETUP_FAILED]: {
    httpStatusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    body: { code: "initial_setup_failed", message: "Initial setup failed" },
  },
  [ErrorTypeEnum.enum.NOT_ENOUGH_PERMISSION]: {
    httpStatusCode: STATUS_CODES.FORBIDDEN,
    body: {
      code: "not_enough_permission",
      message: "User does not have enough permission to perform this action",
    },
  },
  [ErrorTypeEnum.enum.TOO_MANY_REQUESTS]: {
    httpStatusCode: STATUS_CODES.TOO_MANY_REQUESTS,
    body: { code: "too_many_requests", message: "Too many requests" },
  },
  [ErrorTypeEnum.enum.TOKEN_NOT_ACTIVE]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: "token_not_active", message: "Token not active" },
  },
  [ErrorTypeEnum.enum.INVALID_TOKEN_AUDIENCE]: {
    httpStatusCode: STATUS_CODES.UNAUTHORIZED,
    body: { code: "invalid_token_audience", message: "Invalid token audience" },
  },
};

export type ErrorTypeEnum = z.infer<typeof ErrorTypeEnum>;

export const getErrorObject = (type: ErrorTypeEnum) => {
  const validateErrorType = ErrorTypeEnum.safeParse(type);
  return validateErrorType.success ? errorMap[type] : errorMap[ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR];
};
