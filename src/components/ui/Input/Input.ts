import Block from "../../../../core/Block";
import template from "./Input.hbs";
import "./Input.scss";

export interface InputProps {
  id?: string;
  name: string;
  label?: string;
  type?: "text" | "password" | "email" | "number" | "file";
  value?: string;
  placeholder?: string;
  inputType?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  autocomplete?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  validator?: (value: string) => string | null;
  onInput?: (e: Event) => void;
  onBlur?: (e: Event) => void;
  events?: Record<string, (e: Event) => void>;
  error?: string | null;
  accept?: string;
}

export default class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    super("div", {
      disabled: false,
      ...props,
    });
    this.element?.addEventListener("input", (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      if (this.props.onInput) this.props.onInput(e);
      if (this.props.validator) {
        const error = this.props.validator(value);
        this.setProps({ error });
      }
    });

    this.element?.addEventListener("blur", (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      if (this.props.onBlur) this.props.onBlur(e);
      if (this.props.validator) {
        const error = this.props.validator(value);
        this.setProps({ error });
      }
    });
  }
  public getValue(): string {
    const input = this.element?.querySelector("input");
    return input ? (input as HTMLInputElement).value : "";
  }
  render() {
    return super.compile(template.toString(), this.props);
  }
}
