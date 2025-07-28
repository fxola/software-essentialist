import axios from "axios";
import { createUserAPI } from "./users";

export type Error<U> = {
  message?: string;
  error?: U;
};

export type APIResponse<T, U> = {
  success: boolean;
  data: T;
  error: Error<U>;
};

export type ValidationError = "ValidationError";
export type ServerError = "ServerError";
export type UnknownError = "UnknownError";
export type GenericErrors = ValidationError | ServerError | UnknownError;

export function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

export function handleAPIError<T>(e: unknown): T {
  if (axios.isAxiosError(e) && e.response) {
    return e.response.data as T;
  }

  return {
    error: { error: "UnknownError", message: getErrorMessage(e) },
    success: false,
  } as T;
}

export const createAPIClient = (baseURL: string) => {
  return {
    users: createUserAPI(baseURL),
  };
};
