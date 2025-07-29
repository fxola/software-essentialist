import axios, { AxiosResponse } from "axios";
import { createUserAPI } from "./users";
import { createPostAPI } from "./posts";
import { createMarketingAPI } from "./marketing";

export type Error<U> = {
  message?: string;
  error?: U;
};

export type APIResponse<T, U> = {
  body: {
    success: boolean;
    data: T;
    error: Error<U>;
  };
  status: number;
};

export type ValidationError = "ValidationError";
export type ServerError = "ServerError";
export type UnknownError = "UnknownError";
export type GenericErrors = ValidationError | ServerError | UnknownError;

export const formatAPIResponse = (response: AxiosResponse<any, any>) => {
  return {
    body: { ...response.data },
    status: response.status,
  };
};

export function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

export function handleAPIError<T>(e: unknown): T {
  if (axios.isAxiosError(e) && e.response) {
    return formatAPIResponse(e.response) as T;
  }

  return {
    body: {
      error: "UnknownError",
      message: getErrorMessage(e),
      success: false,
    },
    status: 500,
  } as T;
}

export const createAPIClient = (baseURL: string) => {
  return {
    users: createUserAPI(baseURL),
    posts: createPostAPI(baseURL),
    marketing: createMarketingAPI(baseURL),
  };
};
