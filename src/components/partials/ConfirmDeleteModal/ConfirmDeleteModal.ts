import Block from "../../../../core/Block";
import ToastService from "../../../../utils/toastService";
import { UseFetch } from "../../../../utils/useFetch";
import Button from "../../ui/Button/Button";
import template from "./ConfirmDeleteModal.hbs";
import "./ConfirmDeleteModal.scss";

interface ConfirmDeleteModalProps {
  chatId?: number | null;
  onClose?: () => void;
  visible?: boolean;
  children?: { [key: string]: Block<any> };
  events?: Record<string, (e: Event) => void>;
}

export class ConfirmDeleteModal extends Block<ConfirmDeleteModalProps> {
  constructor(props: ConfirmDeleteModalProps) {
    const children = {
      confirmDeleteYes: new Button({
        label: "Да",
        type: "button",
        className: "confirm-delete-modal__yes",
        onClick: async () => {
          console.log("Deleting chat with ID:", this.props.chatId);
          if (this.props.chatId) {
            await this.deleteChat(this.props.chatId);
          }
        },
      }),
      confirmDeleteNo: new Button({
        label: "Нет",
        type: "button",
        className: "confirm-delete-modal__no",
        onClick: () => {
          this.hide();
          props.onClose?.();
        },
      }),
    };

    super("div", { ...props, children });
  }

  public show(chatId: number) {
    this.setProps({ chatId });
    this.getContent()?.classList.remove("hidden");
  }

  public hide() {
    this.getContent()?.classList.add("hidden");
  }

  private async deleteChat(chatId: number) {
    try {
      const api = UseFetch.getInstance("https://ya-praktikum.tech/api/v2");
      await api.delete("/chats", { data: { chatId } });
      ToastService.getInstance().show("Чат удален", "success");
      this.hide();
      window.location.reload();
    } catch {
      ToastService.getInstance().show("Ошибка при удалении чата", "error");
    }
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
