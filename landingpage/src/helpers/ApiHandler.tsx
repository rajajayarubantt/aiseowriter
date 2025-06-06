import proxyConfig from "../config/reverseProxy";
import HeaderConfig from "../config/header";

type Method = "GET" | "POST" | "PUT" | "DELETE";
type HeaderType = "json" | "form";

interface RequestOptions {
  method: Method;
  endpoint: string;
  params?: Record<string, any> | URLSearchParams | FormData;
  header_type?: HeaderType;
  has_token?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiHandler {
  constructor() {
    this.request = this.request.bind(this);
  }

  async request<T = any>({
    method,
    endpoint,
    params,
    header_type = "json",
    has_token = true,
  }: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const headers = HeaderConfig.getHeader({ has_token, header_type });
      const options: RequestInit = {
        method,
        headers,
      };

      // Handle GET parameters
      if (method === "GET" && params) {
        // If params is already URLSearchParams, convert to string
        let queryString = "";
        if (params instanceof URLSearchParams) {
          queryString = params.toString();
        } else if (typeof params === "object") {
          queryString = new URLSearchParams(
            params as Record<string, string>
          ).toString();
        }
        if (queryString) {
          endpoint += `?${queryString}`;
        }
      } else if (method === "POST" || method === "PUT" || method === "DELETE") {
        if (params) {
          if (header_type === "json") {
            options.body = JSON.stringify(params);
          } else if (header_type === "form") {
            // We expect params to be FormData or URLSearchParams for form headers
            if (
              params instanceof FormData ||
              params instanceof URLSearchParams
            ) {
              options.body = params;
            } else {
              // fallback to convert object to URLSearchParams for form
              options.body = new URLSearchParams(
                params as Record<string, string>
              );
            }
          }
        }
      }

      const response = await fetch(
        proxyConfig["serverBaseUrl"] + endpoint,
        options
      );
      const json: ApiResponse<T> = await response.json();

      return json;
    } catch (err: unknown) {
      console.error(err, "API request error");
      let message = "Unknown error";

      if (err && typeof err === "object" && "message" in err) {
        message = (err as Error).message;
      }

      return { success: false, message };
    }
  }
}

export default ApiHandler;
