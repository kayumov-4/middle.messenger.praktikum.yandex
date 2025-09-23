import Block from "./Block";

class TestingBlock extends Block {
  render(): HTMLElement {
    const el = document.createElement("div");
    el.textContent = "Hello";
    return el;
  }
}

test("Функция render возвращает элемент", () => {
  const block = new TestingBlock("div", {});
  const content = block.getContent();
  expect(content).toBeInstanceOf(HTMLElement);
  expect(content?.textContent).toBe("Hello");
});
