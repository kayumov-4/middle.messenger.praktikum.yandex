import EventBus from "./EventBus";
import Handlebars from "handlebars";
export type Props = Record<string, any>;

export default class Block<P extends Props = {}> {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  };

  protected _element: HTMLElement | null = null;
  protected children: Record<string, Block> = {};
  protected _meta: { tagName: string; props: P } | null = null;
  public props: P;
  private _eventBus: EventBus;

  constructor(tagName: string = "div", props: P = {} as P) {
    const eventBus = new EventBus();

    this._meta = { tagName, props };
    this.props = this._makePropsProxy(props);
    this._eventBus = eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  protected _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  protected init(): void {
    this._createResources();
    this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  protected _createResources(): void {
    if (this._meta) {
      const { tagName } = this._meta;
      this._element = document.createElement(tagName);
    }
  }

  protected addEvents() {
    const { events = {} } = this.props as {
      events?: Record<string, EventListener>;
    };
    if (events.blur) {
      const inputEl = this._element?.querySelector("input");
      Object.keys(events).forEach((eventName) => {
        inputEl?.addEventListener(eventName, events[eventName]);
      });
    } else {
      Object.keys(events).forEach((eventName) => {
        this._element?.addEventListener(eventName, events[eventName]);
      });
    }
  }

  private removeEvents() {
    const { events = {} } = this.props as {
      events?: Record<string, EventListener>;
    };

    Object.keys(events).forEach((eventName) => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }

  _componentDidMount() {
    this.componentDidMount();
  }

  dispatchComponentDidMount() {
    this._eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  componentDidMount() {}

  protected _componentDidUpdate(...args: unknown[]): void {
    const [oldProps, newProps] = args as [P, P];
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);
    if (shouldUpdate) {
      this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate(_oldProps: P, _newProps: P) {
    return true;
  }

  public setProps = (nextProps: Partial<P>) => {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  _render() {
    this.removeEvents();

    const element = this.render();

    if (this._element && element) {
      this._element.replaceWith(element);
      this._element = element;
    }

    this.addEvents();
  }

  render(): HTMLElement {
    const temp = document.createElement("template");
    temp.innerHTML = "";
    return temp.content.firstElementChild as HTMLElement;
  }

  protected compile(template: string, context: P) {
    const html = Handlebars.compile(template)(context);

    const temp = document.createElement("template");
    temp.innerHTML = html.trim();

    return temp.content.firstElementChild as HTMLElement;
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: P) {
    const self = this;

    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop as keyof P];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop, value) {
        const oldProps = { ...target };
        target[prop as keyof P] = value;
        self._eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);
        return true;
      },
      deleteProperty(target, prop) {
        if (typeof prop === "string" && prop.startsWith("_")) {
          throw new Error("нет доступа");
        }
        delete target[prop as keyof P];
        self._eventBus.emit(Block.EVENTS.FLOW_CDU, target, target);
        return true;
      },
    });
  }
}
