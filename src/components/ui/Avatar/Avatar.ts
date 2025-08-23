import Block from "../../../../core/Block";
import template from "./Avatar.hbs";
import "./Avatar.scss";

interface AvatarProps {
  src: string;
  onClick?: () => void;
}

export default class Avatar extends Block {
  constructor(props: AvatarProps) {
    super("div", {
      ...props,
      events: {
        click: props.onClick,
      },
    });
  }

  render() {
    return this.compile(template.toString(), this.props);
  }
}
