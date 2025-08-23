import Block from "../../../../core/Block";
import template from "./Toast.hbs";
import "./Toast.scss";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
}

export default class Toast extends Block<ToastProps> {
  private timeoutId?: number;

  constructor(props: ToastProps) {
    super("div", {
      type: "info",
      duration: 3000,
      ...props,
    });
  }

  show() {
    const content = this.getContent();
    if (!content) return;

    const toastRoot = document.getElementById("toast-root");
    if (toastRoot) {
      toastRoot.appendChild(content);
      this.dispatchComponentDidMount();
    }
  }

  componentDidMount() {
    this.timeoutId = window.setTimeout(() => {
      this.hide();
    }, this.props.duration);
  }

  hide() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    const el = this.getContent();
    if (el) {
      el.classList.add("toast--hide");
      setTimeout(() => {
        if (el && el.parentNode) {
          el.remove();
        }
      }, 300);
    }
  }

  render() {
    return this.compile(template.toString(), this.props);
  }
}
