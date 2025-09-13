enum METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

type Options = {
  method: METHOD;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
};

type OptionsWithoutMethod = Omit<Options, "method">;

type HTTPMethod = <R = unknown>(
  endpoint: string,
  options?: OptionsWithoutMethod
) => Promise<R>;

function queryStringify(data: Record<string, any>): string {
  const keys = Object.keys(data);
  return keys.length
    ? "?" +
        keys
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
          )
          .join("&")
    : "";
}

export class UseFetch {
  private baseURL: string;
  private static instance: UseFetch;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  static getInstance(baseURL: string = "https://jsonplaceholder.typicode.com") {
    if (!UseFetch.instance) {
      UseFetch.instance = new UseFetch(baseURL);
    }
    return UseFetch.instance;
  }
  private buildURL(endpoint: string): string {
    if (endpoint.startsWith("http")) {
      return endpoint;
    }
    return (
      this.baseURL.replace(/\/+$/, "") + "/" + endpoint.replace(/^\/+/, "")
    );
  }

  get: HTTPMethod = (endpoint, options = {}) =>
    this.request(endpoint, { ...options, method: METHOD.GET });

  post: HTTPMethod = (endpoint, options = {}) =>
    this.request(endpoint, { ...options, method: METHOD.POST });

  put: HTTPMethod = (endpoint, options = {}) =>
    this.request(endpoint, { ...options, method: METHOD.PUT });

  delete: HTTPMethod = (endpoint, options = {}) =>
    this.request(endpoint, { ...options, method: METHOD.DELETE });

  private request<R = unknown>(endpoint: string, options: Options): Promise<R> {
    const { method, data, headers = {}, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      let finalURL = this.buildURL(endpoint);
      if (method === METHOD.GET && data && typeof data === "object") {
        finalURL += queryStringify(data);
      }

      xhr.open(method, finalURL);
      xhr.timeout = timeout;
      xhr.withCredentials = true;

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        try {
          const contentType = xhr.getResponseHeader("Content-Type") || "";
          const isJson = contentType.includes("application/json");
          const response = isJson
            ? JSON.parse(xhr.responseText)
            : xhr.responseText;

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(response as R);
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText,
              response,
            });
          }
        } catch (e) {
          reject(e);
        }
      };
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === METHOD.GET || !data) {
        xhr.send();
      } else {
        if (data instanceof FormData) {
          xhr.send(data);
        } else {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(JSON.stringify(data));
        }
      }
    });
  }
}
