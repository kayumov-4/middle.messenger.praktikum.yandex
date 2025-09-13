import Block from "../../../../core/Block";
import { ButtonProps } from "../../../entities/interfaces/ButtonProps";
import template from "./Button.hbs?raw";

export default class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super("button", {
      ...props,
      events: {
        click: props.onClick,
        blur: props.onBlur,
      },
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
