import axios from "axios";
import {
  APIResponse,
  formatAPIResponse,
  GenericErrors,
  handleAPIError,
} from ".";

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface User extends CreateUserInput {
  id: string;
}

export type EmailAlreadyInUseError = "EmailAlreadyInUse";
export type UsernameAlreadyTakenError = "UsernameAlreadyTaken";
export type CreateUserErrors =
  | EmailAlreadyInUseError
  | UsernameAlreadyTakenError
  | GenericErrors;
export type CreateUserAPIResponse = APIResponse<User, CreateUserErrors>;

export type UserNotFoundError = "UserNotFound";
export type GetUserByEmailErrors = UserNotFoundError | GenericErrors;
export type GetUserbyEmailAPIResponse = APIResponse<User, GetUserByEmailErrors>;

export const createUserAPI = (baseURL: string) => {
  return {
    register: async (
      input: CreateUserInput
    ): Promise<CreateUserAPIResponse> => {
      try {
        const response = await axios.post(`${baseURL}users/new`, input);
        return formatAPIResponse(response);
      } catch (e: unknown) {
        return handleAPIError<CreateUserAPIResponse>(e);
      }
    },
    getByEmail: async (email: string): Promise<GetUserbyEmailAPIResponse> => {
      try {
        const response = await axios.get(`${baseURL}users?email=${email}`);
        return formatAPIResponse(response);
      } catch (e: unknown) {
        return handleAPIError<GetUserbyEmailAPIResponse>(e);
      }
    },
  };
};
