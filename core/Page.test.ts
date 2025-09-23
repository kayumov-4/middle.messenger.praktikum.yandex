import Page from "./Page";
import Block from "./Block";

class ChildBlock extends Block {
  render() {
    const el = document.createElement("span");
    el.textContent = "Child";
    return el;
  }
}

class MockPage extends Page {
  constructor() {
    super('<div><div data-slot="child"></div></div>', { template: "" });
  }
  public initChild(components: Record<string, Block<any>>) {
    this.initComponents(components);
  }
}

describe("Page", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="app"></div>`;
  });

  test("компонент вставляется в слот при mount", () => {
    const page = new MockPage();
    const child = new ChildBlock("div", {});
    page.initChild({ child });
    page.mount("#app");

    expect(document.querySelector("#app")?.innerHTML).toContain("Child");
  });
});
