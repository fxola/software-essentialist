import { Request, Response, NextFunction } from "express";
import { ApplicationErrors } from "@dddforum/errors/application";
import { API } from '@dddforum/api/comments';

export function commentsErrorHandler(
  error: Error,
  _: Request,
  res: Response,
  _next: NextFunction,
): Response<API.GetCommentsByPostIdAPIResponse> {
  switch ((error as ApplicationErrors.AnyApplicationError).name) {
    case "PermissionError":
      return res.status(403).json({
        success: false,
        data: undefined,
        error: {
          code: error.name,
          message: error.message,
        }
      });
    case "ValidationError":
      return res.status(400).json({
        success: false,
        data: undefined,
        error: {
          code: error.name,
          message: error.message,
        }
      });
    case 'ServerError':
    default:
      return res.status(500).json({
        success: false,
        data: undefined,
        error: {
          code: error.name,
          message: error.message,
        }
      });
  }
} 