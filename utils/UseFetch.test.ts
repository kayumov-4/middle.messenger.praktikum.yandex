/**
 * @jest-environment jsdom
 */
import { UseFetch, METHOD } from "./useFetch";

describe("UseFetch", () => {
  jest.setTimeout(10000); // 10s timeout

  let fetchInstance: UseFetch;
  const originalXhr = window.XMLHttpRequest;

  beforeEach(() => {
    fetchInstance = UseFetch.getInstance("https://example.com");

    const mockXhr = {
      open: jest.fn(),
      send: jest.fn(function (body?: any) {
        // avtomatik onload simulyatsiyasi
        setTimeout(() => {
          if (body instanceof FormData) {
            // FormData bilan POST testlari
            if (this.onload) {
              this.status = 200;
              this.responseText = '{"success":true}';
              this.onload();
            }
          } else {
            if (this.onload) {
              this.status = 200;
              this.responseText = '{"success":true}';
              this.onload();
            }
          }
        }, 0);
      }),
      setRequestHeader: jest.fn(),
      getResponseHeader: jest.fn().mockReturnValue("application/json"),
      status: 200,
      responseText: "",
      withCredentials: false,
      timeout: 0,
      onload: null as any,
      onerror: null as any,
      onabort: null as any,
      ontimeout: null as any,
    };

    (window as any).XMLHttpRequest = jest.fn(() => mockXhr);
  });

  afterEach(() => {
    window.XMLHttpRequest = originalXhr;
    jest.clearAllMocks();
  });

  test("GET запрос возвращает объект", async () => {
    const result = await fetchInstance.get("/test");
    expect(result).toEqual({ success: true });
  });

  test("POST запрос отправляет JSON и возвращает объект", async () => {
    const result = await fetchInstance.post("/post", { data: { foo: "bar" } });
    expect(result).toEqual({ success: true });
  });

  test("GET запрос с query params формирует правильный URL", async () => {
    const xhrMockInstance = new (window.XMLHttpRequest as any)();
    await fetchInstance.get("/query", { data: { a: 1, b: 2 } });
    expect(xhrMockInstance.open).toHaveBeenCalledWith(
      METHOD.GET,
      "https://example.com/query?a=1&b=2"
    );
  });

  test("Обработка сетевой ошибки", async () => {
    const xhrMockInstance = new (window.XMLHttpRequest as any)();
    setTimeout(() => xhrMockInstance.onerror && xhrMockInstance.onerror(), 0);

    await expect(fetchInstance.get("/fail")).rejects.toEqual({
      error: "Network error",
    });
  });

  test("Обработка таймаута запроса", async () => {
    const xhrMockInstance = new (window.XMLHttpRequest as any)();
    setTimeout(
      () => xhrMockInstance.ontimeout && xhrMockInstance.ontimeout(),
      0
    );

    await expect(fetchInstance.get("/timeout")).rejects.toEqual({
      error: "Request timed out",
    });
  });

  test("POST с FormData отправляется без JSON", async () => {
    const formData = new FormData();
    formData.append("key", "value");

    const xhrMockInstance = new (window.XMLHttpRequest as any)();
    await fetchInstance.post("/form", { data: formData });
    expect(xhrMockInstance.send).toHaveBeenCalledWith(formData);
  });
});
