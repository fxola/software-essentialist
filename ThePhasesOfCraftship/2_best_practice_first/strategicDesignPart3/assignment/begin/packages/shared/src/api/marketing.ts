import axios from "axios";
import {
  APIResponse,
  formatAPIResponse,
  GenericErrors,
  handleAPIError,
} from ".";

type AddEmailMarketingError = GenericErrors;

interface MarketingInput {
  email: string;
}

interface MarketingResponse {
  email: string;
  message: string;
}

type AddEmailMarketingAPIResponse = APIResponse<
  MarketingResponse,
  AddEmailMarketingError
>;

export const createMarketingAPI = (baseURL: string) => {
  return {
    addEmail: async (
      input: MarketingInput
    ): Promise<AddEmailMarketingAPIResponse> => {
      try {
        const response = await axios.post(`${baseURL}marketing/new`, input);
        return formatAPIResponse(response);
      } catch (e) {
        return handleAPIError<AddEmailMarketingAPIResponse>(e);
      }
    },
  };
};
