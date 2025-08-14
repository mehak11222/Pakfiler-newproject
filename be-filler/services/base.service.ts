import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { environment } from "../environment/environment"
import Cookies from "js-cookie";

export class BaseService {
  protected client: AxiosInstance;
  protected loading: boolean;
  protected baseURL: string; // Store baseURL separately for each service instance

  constructor(client: AxiosInstance, baseURL: string = "") {
    this.loading = false;
    this.client = client;
    this.baseURL = environment.apiUrl + baseURL; // Store the full baseURL for this service

    // Don't modify the shared axios instance's baseURL
    // this.client.defaults.baseURL = environment.apiUrl + baseURL; // REMOVE THIS LINE

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.loading = true;
        const token = Cookies.get("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        this.loading = false;
        return Promise.reject(error);
      }
    );

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.loading = true;
        return config;
      },
      (error) => {
        this.loading = false;
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        this.loading = false;
        return response;
      },
      (error) => {
        this.loading = false;
        return Promise.reject(error);
      }
    );
  }

  protected async get<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    const fullUrl = this.baseURL + url; // Construct full URL for each request
    console.log(fullUrl)
    const response = await this.client.get<T>(fullUrl, config);
    return response.data;
  }

  protected async post<T>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    const fullUrl = this.baseURL + url; // Construct full URL for each request
    console.log("BaseService POST - Full URL:", fullUrl); // Debug logging
    const response = await this.client.post<T>(fullUrl, data, config);
    return response.data;
  }

  protected async put<T>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    const fullUrl = this.baseURL + url; // Construct full URL for each request
    const response = await this.client.put<T>(fullUrl, data, config);
    return response.data;
  }

  protected async patch<T>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    const fullUrl = this.baseURL + url; // Construct full URL for each request
    const response = await this.client.patch<T>(fullUrl, data, config);
    return response.data;
  }

  protected async delete<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    const fullUrl = this.baseURL + url; // Construct full URL for each request
    const response = await this.client.delete<T>(fullUrl, config);
    return response.data;
  }
}