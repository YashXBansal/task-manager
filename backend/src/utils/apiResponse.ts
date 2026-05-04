import type { Response } from "express";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Send a successful response
 */
export const ok = <T>(
  res: Response,
  data: T,
  message?: string,
  status = 200,
): Response =>
  res
    .status(status)
    .json({ success: true, data, message } satisfies ApiSuccess<T>);

/**
 * Send a created response (201)
 */
export const created = <T>(
  res: Response,
  data: T,
  message?: string,
): Response => ok(res, data, message, 201);

/**
 * Send an error response
 */
export const fail = (
  res: Response,
  error: string,
  status = 400,
  details?: Record<string, string[]>,
): Response =>
  res
    .status(status)
    .json({ success: false, error, details } satisfies ApiError);

export const unauthorized = (
  res: Response,
  message = "Unauthorized",
): Response => fail(res, message, 401);

export const forbidden = (res: Response, message = "Forbidden"): Response =>
  fail(res, message, 403);

export const notFound = (res: Response, message = "Not found"): Response =>
  fail(res, message, 404);

export const serverError = (
  res: Response,
  message = "Internal server error",
): Response => fail(res, message, 500);
