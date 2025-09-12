import Handlebars from "handlebars";
import Block from "./Block";

export default class Page<
  P extends Record<string, any> = Record<string, any>
> extends Block<P> {
  private template: string;
  public props: P;
  private components: Record<string, Block<any>> = {};
  protected root: HTMLElement | null = null;

  constructor(template: string, props: P) {
    super("main", props);
    this.template = template;
    this.props = props;
  }

  protected initComponents(components: Record<string, Block<any>> = {}) {
    this.components = components;
    Object.entries(components).forEach(([key, value]) => {
      this.register(key, value);
    });
  }

  public register(slotName: string, component: Block<any>) {
    if (slotName) {
      this.components[slotName] = component;
    }
  }

  public mount(rootSelector: string) {
    const root = document.querySelector<HTMLElement>(rootSelector);
    if (!root) throw new Error(`Root "${rootSelector}" not found`);

    const html = Handlebars.compile(this.template)(this.props);
    root.innerHTML = html;

    this.root = root;

    Object.entries(this.components).forEach(([slot, comp]) => {
      const target = root.querySelector<HTMLElement>(
        `[data-slot="${slot}"], #${slot}`
      );

      if (!target) {
        console.warn(`Slot "${slot}" not found on page`);
        return;
      }

      const content = comp.getContent();
      if (content) {
        target.replaceWith(content);
      }

      (comp as any).dispatchComponentDidMount?.();
    });

    this.onMount();
  }

  public unmount() {
    if (this.root) {
      this.onUnmount();

      Object.values(this.components).forEach((comp) => {
        (comp as any).unmount?.();
      });

      this.root.innerHTML = "";
      this.root = null;
    }
  }

  public destroy() {
    this.unmount();
    this.onDestroy();
  }

  protected onMount() {}
  protected onUnmount() {}
  protected onDestroy() {}
}
