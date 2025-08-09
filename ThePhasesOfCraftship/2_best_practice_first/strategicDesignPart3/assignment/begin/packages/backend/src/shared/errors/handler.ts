import { NextFunction, Request, Response } from "express";
import { Errors } from "./constants";
import {
  EmailInUseException,
  UsernameTakenException,
  UserNotFoundException,
} from "../../modules/users/user-exception";
import { InvalidPostFilterException } from "../../modules/posts/post-exception";
import { InvalidBodyException, InvalidEmailException } from "./exceptions";

export type errorHandlerType = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof EmailInUseException) {
    return res.status(409).json({
      error: Errors.EmailAlreadyInUse,
      data: undefined,
      success: false,
      message: error.message,
    });
  }

  if (error instanceof InvalidBodyException) {
    return res.status(400).json({
      error: Errors.ValidationError,
      data: undefined,
      success: false,
      message: error.message,
    });
  }

  if (error instanceof InvalidEmailException) {
    return res.status(400).json({
      error: Errors.ValidationError,
      data: undefined,
      success: false,
      message: error.message,
    });
  }

  if (error instanceof UsernameTakenException) {
    return res.status(409).json({
      error: Errors.UsernameAlreadyTaken,
      data: undefined,
      success: false,
      message: error.message,
    });
  }

  if (error instanceof UserNotFoundException) {
    return res.status(404).json({
      error: Errors.UserNotFound,
      data: undefined,
      success: false,
      message: error.message,
    });
  }

  if (error instanceof InvalidPostFilterException) {
    return res.status(400).json({
      error: Errors.ValidationError,
      data: undefined,
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    error: Errors.ServerError,
    data: undefined,
    success: false,
    message: error.message || "Something went wrong",
  });
}
