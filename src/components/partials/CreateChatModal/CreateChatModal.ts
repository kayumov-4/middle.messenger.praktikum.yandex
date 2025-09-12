import Block from "../../../../core/Block";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import template from "./CreateChatModal.hbs";
import "./CreateChatModal.scss";

interface CreateChatModalProps {
  onSave: (title: string) => void;
  onClose: () => void;
  visible?: boolean;
  children?: { [key: string]: Block<any> };
  events?: Record<string, (e: Event) => void>;
}

export class CreateChatModal extends Block<CreateChatModalProps> {
  constructor(props: CreateChatModalProps) {
    const children = {
      chatTitleInput: new Input({
        wrapperClassName: "create-chat-modal__body-input",
        className: "",
        label: "Название чата",
        id: "chatTitle",
        type: "text",
        name: "title",
        placeholder: "",
      }),
      createChatModalSubmit: new Button({
        label: "Создать",
        type: "button",
        className: "create-chat-modal__body-submit",
        id: "saveCreateChatModal",
        onClick: () => {
          const input =
            this.element?.querySelector<HTMLInputElement>("#chatTitle");
          const title = input?.value.trim();
          if (title) {
            props.onSave?.(title);
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

          if (target.id === "closeCreateChatModal") {
            this.hide();
            props.onClose?.();
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
