import { AxiosError, AxiosResponse } from "axios";

export interface AxiosCustomErrorType extends AxiosError {
  response: AxiosError["response"] & {
    data: CustomErrorDataType;
  };
}
interface CustomErrorDataType {
  message: string;
}

export interface AxiosCustomResponseType extends AxiosResponse {
  data: AxiosCustomResponseDataType;
}

interface AxiosCustomResponseDataType {
  message: string;
  data: any;
}
