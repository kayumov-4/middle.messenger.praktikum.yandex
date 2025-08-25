import Block from "../../../../core/Block";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import template from "./changeAvatarModal.hbs";
import "./changeAvatarModal.scss";

interface ChangeAvatarModalProps {
  onSave: (file: File) => void;
  onClose: () => void;
  visible?: boolean;
  children?: { [key: string]: Block<any> };
  events?: Record<string, (e: Event) => void>;
}

export class ChangeAvatarModal extends Block<ChangeAvatarModalProps> {
  constructor(props: ChangeAvatarModalProps) {
    const children = {
      avatarFileInput: new Input({
        className: "change-avatar-modal__body-input",
        id: "avatarInput",
        type: "file",
        name: "avatar",
        accept: "image/*",
      }),
      changeAvatarModalSubmit: new Button({
        label: "Сохранить",
        type: "button",
        className: "change-avatar-modal__body-submit",
        id: "saveChangeAvatarModal",
        onClick: () => {
          const input =
            this.element?.querySelector<HTMLInputElement>("#avatarInput");
          const file = input?.files?.[0];
          if (file) {
            props.onSave?.(file);
          }
          this.hide();
        },
      }),
    };

    super("div", {
      ...props,
      children,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;

          if (target.id === "closeChangeAvatarModal") {
            this.hide();
            props.onClose?.();
          }

          if (target.id === "saveChangeAvatarModal") {
            e.preventDefault();
            const input =
              this.element?.querySelector<HTMLInputElement>("#avatarInput");
            const file = input?.files?.[0];
            if (file) {
              props.onSave?.(file);
            }
            this.hide();
          }
        },
      },
    });
  }

  public show() {
    this.getContent()?.classList.remove("hidden");
  }

  public hide() {
    this.getContent()?.classList.add("hidden");
  }

  render() {
    const el = this.compile(template.toString(), this.props);

    Object.entries(this.props.children || {}).forEach(([id, component]) => {
      const placeholder = el.querySelector(`#${id}`);
      if (placeholder && component instanceof Block) {
        placeholder.replaceWith(component.getContent()!);
      }
    });

    return el;
  }
}
