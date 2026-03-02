export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type ContentType =
  | "application/json"
  | "multipart/form-data"
  | "text/plain"
  | "application/x-www-form-urlencoded";

interface BaseOptions {
  headers?: Record<string, string>;
  token?: string;
}

interface JsonOptions<TBody extends JsonValue> extends BaseOptions {
  body: TBody;
  contentType: "application/json";
}

interface FormDataOptions extends BaseOptions {
  body: FormData;
  contentType: "multipart/form-data";
}

interface TextOptions extends BaseOptions {
  body: string;
  contentType: "text/plain";
}

interface UrlEncodedOptions extends BaseOptions {
  body: Record<string, string>;
  contentType: "application/x-www-form-urlencoded";
}

type RequestOptions<TBody extends JsonValue = JsonValue> =
  | JsonOptions<TBody>
  | FormDataOptions
  | TextOptions
  | UrlEncodedOptions
  | BaseOptions;

export class Api {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL
  }

  private async request<TResponse>(
    endpoint: string,
    method: string,
    options?: RequestOptions,
  ): Promise<TResponse> {
    const headers: Record<string, string> = {
      ...options?.headers,
    };

    if (options?.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    let body: BodyInit | undefined;

    if (options && "body" in options) {
      switch (options.contentType) {
        case "application/json":
          headers["Content-Type"] = "application/json";
          body = JSON.stringify(options.body);
          break;

        case "application/x-www-form-urlencoded":
          headers["Content-Type"] = "application/x-www-form-urlencoded";
          body = new URLSearchParams(options.body).toString();
          break;

        case "text/plain":
          headers["Content-Type"] = "text/plain";
          body = options.body;
          break;

        case "multipart/form-data":
          body = options.body;
          break;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return (await response.json()) as TResponse;
    }

    return (await response.text()) as unknown as TResponse;
  }

  public get<TResponse>(endpoint: string, options?: BaseOptions) {
    return this.request<TResponse>(endpoint, "GET", options);
  }

  public post<TResponse>(endpoint: string, options: RequestOptions) {
    return this.request<TResponse>(endpoint, "POST", options);
  }

  public put<TResponse>(endpoint: string, options: RequestOptions) {
    return this.request<TResponse>(endpoint, "PUT", options);
  }

  public delete<TResponse>(endpoint: string, options?: BaseOptions) {
    return this.request<TResponse>(endpoint, "DELETE", options);
  }
}
