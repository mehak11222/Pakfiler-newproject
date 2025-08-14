import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import AuthService from "@/auth/auth.service";

const auth: AuthService = new AuthService();

const getBearerToken = (): string | undefined => {
  return auth.getToken();
};

const handleError = (error: any): Promise<never> => {
  if (
    error.message === "Request failed with status code 403" ||
    error.response?.data === "Invalid Token"
  ) {
    auth.clearToken();
    window.location.href = "/auth/login";
  }
  if (
    error.response &&
    (error.response.status === 401 || error.response.statusText === "Unauthorized")
  ) {
    auth.clearToken();
    // window.location.href = "/auth/login";
  }

  console.error("An error occurred:", error);
  return Promise.reject(error);
};

const axiosInstance: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getBearerToken();
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => handleError(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => handleError(error)
);

const updateBearerToken = () => {
  const token = getBearerToken();
  if (token) {
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.Authorization;
  }
};

export { axiosInstance, updateBearerToken, handleError };