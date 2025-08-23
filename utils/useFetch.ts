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

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private buildURL(endpoint: string): string {
    if (endpoint.startsWith("http")) {
      return endpoint;
    }
    return (
      this.baseURL.replace(/\/+$/, "") + "/" + endpoint.replace(/^\/+/, "")
    );
  }

  get(
    endpoint: string,
    options: OptionsWithoutMethod = {}
  ): Promise<XMLHttpRequest> {
    return this.request(endpoint, { ...options, method: METHOD.GET });
  }

  post(
    endpoint: string,
    options: OptionsWithoutMethod = {}
  ): Promise<XMLHttpRequest> {
    return this.request(endpoint, { ...options, method: METHOD.POST });
  }

  put(
    endpoint: string,
    options: OptionsWithoutMethod = {}
  ): Promise<XMLHttpRequest> {
    return this.request(endpoint, { ...options, method: METHOD.PUT });
  }

  delete(
    endpoint: string,
    options: OptionsWithoutMethod = {}
  ): Promise<XMLHttpRequest> {
    return this.request(endpoint, { ...options, method: METHOD.DELETE });
  }

  request(
    endpoint: string,
    options: Options = { method: METHOD.GET }
  ): Promise<XMLHttpRequest> {
    const { method, data, headers = {}, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      let finalURL = this.buildURL(endpoint);
      if (method === METHOD.GET && data && typeof data === "object") {
        finalURL += queryStringify(data);
      }

      xhr.open(method, finalURL);
      xhr.timeout = timeout;

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => resolve(xhr);
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
