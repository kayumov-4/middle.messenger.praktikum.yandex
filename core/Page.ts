import Handlebars from "handlebars";
import Block from "./Block";

export default class Page extends Block {
  private template: string;
  private context: Record<string, unknown>;
  private components: Record<string, Block> = {};

  constructor(template: string, context: Record<string, unknown> = {}) {
    super("main");
    this.template = template;
    this.context = context;
  }

  protected initComponents(components: Record<string, Block> = {}) {
    this.components = components;
    if (components) {
      Object.entries(components).forEach(([key, value]) => {
        this.register(key, value);
      });
    }
  }

  register(slotName: string, component: Block) {
    if (slotName) {
      this.components[slotName] = component;
    }
  }

  mount(rootSelector: string) {
    const root = document.querySelector(rootSelector);
    if (!root) throw new Error(`Root "${rootSelector}" not found`);

    const html = Handlebars.compile(this.template)(this.context);
    root.innerHTML = html;

    Object.entries(this.components).forEach(([slot, comp]) => {
      const target =
        root.querySelector<HTMLElement>(`[data-slot="${slot}"]`) ||
        root.querySelector<HTMLElement>(`#${slot}`);

      if (!target) {
        console.warn(`Slot "${slot}" not found on page`);
        return;
      }

      const content = comp.getContent();
      if (content) {
        target.replaceWith(content);
      }
      comp.dispatchComponentDidMount?.();
    });
  }
}
