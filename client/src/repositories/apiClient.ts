import { USER_ACCESS_KEY } from "@/enums";
import { removeCookies } from "@/utils";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 60000,
});

const logOnDev = (
  message: string,
  log?: AxiosResponse | InternalAxiosRequestConfig | AxiosError,
) => {
  if (import.meta.env.NODE_ENV === "development") {
    console.log(message, log);
  }
};

apiClient.interceptors.request.use(
  (request) => {
    const accessToken = Cookies.get(USER_ACCESS_KEY.TOKEN);

    if (accessToken) {
      request.headers["auth_token"] = `Bearer ${accessToken}`;
    }

    // const { method, url } = request;
    // logOnDev(`🚀 [${method?.toUpperCase()}] ${url} | Request`, request);

    return request;
  },
  (error) => {
    return Promise.reject(new Error(error.response.data));
  },
);

apiClient.interceptors.response.use(
  (response) => {
    const { method, url } = response.config;
    const { status } = response;

    // logOnDev(
    //   `✨ [${method?.toUpperCase()}] ${url} | Response ${status}`,
    //   response,
    // );

    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.data.message === "Invalid or expired token" &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      removeCookies();
      window.location.reload();
    } else if (error.response.status === 500 || error.response.status === 503) {
      alert("Server under maintenance");
    }

    const { message } = error;
    const { status, data } = error.response;
    const { method, url } = error.config;

    // logOnDev(
    //   `🚨 [${method?.toUpperCase()}] ${url} | Error ${status} ${data?.message || ""} | ${message}`,
    //   error,
    // );

    return Promise.reject(error);
  },
);

export default apiClient;
