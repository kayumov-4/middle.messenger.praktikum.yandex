import Block from "../../../../core/Block";
import template from "./ChatHeader.hbs?raw";
import "./ChatHeader.scss";

interface ChatHeaderProps {
  activeChatTitle: string | null;
  onMenuSelect?: (action: string) => void;
  events?: Record<string, EventListener>;
}

export class ChatHeader extends Block<ChatHeaderProps> {
  private outsideClickHandler: ((e: Event) => void) | null = null;
  constructor(props: Omit<ChatHeaderProps, "events">) {
    const handleClick = (e: Event) => {
      const root = e.currentTarget as HTMLElement;
      const target = e.target as HTMLElement;
      const btn = root.querySelector("#chatMenuBtn") as HTMLElement | null;
      const dropdown = root.querySelector(
        "#chatMenuDropdown"
      ) as HTMLElement | null;
      if (!btn || !dropdown) return;
      if (btn.contains(target)) {
        dropdown.classList.toggle("hidden");
        return;
      }
      const actionEl = target.closest("[data-action]") as HTMLElement | null;
      if (actionEl && dropdown.contains(actionEl)) {
        const action = actionEl.dataset.action;
        if (action && props.onMenuSelect) {
          props.onMenuSelect(action);
        }
        dropdown.classList.add("hidden");
        return;
      }
    };
    super("div", { ...props, events: { click: handleClick } });
  }
  public componentDidMount(): void {
    this.outsideClickHandler = (e: Event) => {
      const root = this.getContent();
      if (!root) return;
      const dropdown = root.querySelector(
        "#chatMenuDropdown"
      ) as HTMLElement | null;
      if (!dropdown) return;
      if (dropdown.classList.contains("hidden")) return;

      const target = e.target as Node;
      if (!root.contains(target)) {
        dropdown.classList.add("hidden");
      }
    };
    document.addEventListener("click", this.outsideClickHandler);
  }
  public componentWillUnmount(): void {
    if (this.outsideClickHandler) {
      document.removeEventListener("click", this.outsideClickHandler);
      this.outsideClickHandler = null;
    }
  }
  render() {
    return this.compile(template, this.props);
  }
}
