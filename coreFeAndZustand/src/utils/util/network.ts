import axios, {
  AxiosError,
  type AxiosInterceptorManager,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type Method,
} from "axios";
import { parseWithDate } from "./json-util";

export type PathParams<T extends string> = string extends T
  ? { [key: string]: string | number }
  : T extends `${infer Start}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof PathParams<Rest>]: string | number }
  : T extends `${infer Start}:${infer Param}`
  ? { [k in Param]: string | number }
  : {};

export interface APIErrorResponse {
  id?: string | null;
  errorCode?: string | null;
  message?: string | null;
}

const ajaxClient = axios.create({
  transformResponse: (data, headers) => {
    if (data) {
      // API response may be void, in such case, JSON.parse will throw error
      const contentType = headers?.["content-type"];
      if (contentType?.startsWith("application/json")) {
        return parseWithDate(data);
      }
    } else {
      return data;
    }
  },
});

export async function ajax<Request, Response, Path extends string>(
  method: Method,
  path: Path,
  pathParams: PathParams<Path>,
  request: Request,
  extraConfig: Partial<AxiosRequestConfig> = {}
): Promise<Response> {
  const fullURL = urlParams(path, pathParams);
  const config: AxiosRequestConfig = { ...extraConfig, method, url: fullURL };

  if (method === "GET" || method === "DELETE") {
    config.params = request;
  } else if (method === "POST" || method === "PUT" || method === "PATCH") {
    config.data = request;
  }

  config.headers = {
    ...extraConfig.headers,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const response = await ajaxClient.request<Response>(config);
  return response.data;
}

export function uri<Request>(path: string, request: Request): string {
  const config: AxiosRequestConfig = { method: "GET", url: path, params: request };
  return ajaxClient.getUri(config);
}

export function urlParams(pattern: string, params: object): string {
  if (!params) {
    return pattern;
  }
  let url = pattern;
  Object.entries(params).forEach(([name, value]) => {
    const encodedValue = encodeURIComponent(value.toString());
    url = url.replace(":" + name, encodedValue);
  });
  return url;
}

export const setAjaxRequestInterceptor: AxiosInterceptorManager<InternalAxiosRequestConfig>["use"] = (
  onFulfilled,
  onRejected?,
  options?
) => {
  return ajaxClient.interceptors.request.use(onFulfilled, onRejected, options);
};

export const setAjaxResponseInterceptor: AxiosInterceptorManager<AxiosResponse>["use"] = (
  onFulfilled?,
  onRejected?,
  options?
) => {
  return ajaxClient.interceptors.response.use(onFulfilled, onRejected, options);
};
