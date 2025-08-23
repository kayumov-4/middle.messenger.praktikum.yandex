import Block from "../../../../core/Block";
import template from "./Link.hbs?raw";

interface LinkProps {
  href: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
}

export default class Link extends Block {
  constructor(props: LinkProps) {
    super("a", {
      ...props,
      events: {
        click: (e: Event) => {
          e.preventDefault();
          window.history.pushState({}, "", props.href);
          window.dispatchEvent(new Event("popstate"));
          props.onNavigate?.();
        },
      },
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
