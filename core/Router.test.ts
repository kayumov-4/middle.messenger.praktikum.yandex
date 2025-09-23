/**
 * @jest-environment jsdom
 */

import Router from "./Router";
import Page from "./Page";
class TestingFakePage extends Page {
  constructor() {
    super("<div>TestingFakePage</div>", {});
  }

  render(): HTMLElement {
    const el = document.createElement("div");
    el.textContent = "TestingFakePage";
    return el;
  }
}

describe("Router", () => {
  let router: Router;

  beforeEach(() => {
    (Router as any).__instance = undefined;

    document.body.innerHTML = '<div id="app"></div>';

    router = new Router("#app");
  });

  test("use() регистрирует маршрут", () => {
    router.use("/fake", TestingFakePage);
    router.go("/fake");
    const app = document.querySelector("#app");
    expect(app?.textContent).toContain("TestingFakePage");
  });

  test("go() вызывает history.pushState и рендерит страницу", () => {
    const spy = jest.spyOn(window.history, "pushState");
    router.use("/fake", TestingFakePage);
    router.go("/fake");
    expect(spy).toHaveBeenCalled();
    expect(document.querySelector("#app")?.textContent).toContain(
      "TestingFakePage"
    );
    spy.mockRestore();
  });

  test("back() вызывает history.back", () => {
    const spy = jest.spyOn(window.history, "back").mockImplementation(() => {});
    router.back();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("forward() вызывает history.forward", () => {
    const spy = jest
      .spyOn(window.history, "forward")
      .mockImplementation(() => {});
    router.forward();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
