import Block from "../../../../core/Block";
import { UseFetch } from "../../../../utils/useFetch";
import ToastService from "../../../../utils/toastService";
import template from "./ChatAddUserModal.hbs";
import "./ChatAddUserModal.scss";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { UserProfile } from "../../../entities/interfaces/UserProfile";

interface ChatAddUserModalProps {
  chatId?: number | null;
  onClose?: () => void;
  visible?: boolean;
  children?: { [key: string]: Block<any> };
  events?: Record<string, (e: Event) => void>;
  addUserBtn?: Button;
  addUserInput?: Input;
}

export class ChatAddUserModal extends Block<ChatAddUserModalProps> {
  private addUserInput!: Input;
  private addUserBtn!: Button;

  constructor(props: ChatAddUserModalProps) {
    const addUserInput = new Input({
      id: "addUserInput",
      name: "login",
      type: "text",
      inputType: "text",
      label: "Введите логин пользователя",
      className: "chat-add-user-modal__input",
    });

    const addUserBtn = new Button({
      label: "Добавить",
      type: "button",
      className: "chat-add-user-modal__submit",
      id: "addUserBtn",
      onClick: () => {
        this.addUser();
      },
    });

    super("div", {
      ...props,
      children: {
        addUserInput,
        addUserBtn,
      },
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.id === "closeAddUser") {
            this.hide();
            props.onClose?.();
          }
        },
      },
    });
    this.addUserInput = addUserInput;
    this.addUserBtn = addUserBtn;
  }

  public show(chatId: number) {
    this.setProps({ chatId });
    this.getContent()?.classList.remove("hidden");
  }

  public hide() {
    this.getContent()?.classList.add("hidden");
  }

  private async addUser() {
    const inputEl = this.addUserInput
      .getContent()
      ?.querySelector("input") as HTMLInputElement;

    if (!inputEl || !inputEl.value.trim()) {
      ToastService.getInstance().show("Введите логин", "error");
      return;
    }

    try {
      const api = UseFetch.getInstance("https://ya-praktikum.tech/api/v2");

      const users = (await api.post("/user/search", {
        data: { login: inputEl.value.trim() },
      })) as UserProfile[];

      if (!users || users.length === 0) {
        ToastService.getInstance().show("Пользователь не найден", "error");
        return;
      }

      const userId = users[0].id;

      await api.put("/chats/users", {
        data: { users: [userId], chatId: this.props.chatId },
      });

      ToastService.getInstance().show("Пользователь добавлен", "success");
      this.hide();
      inputEl.value = "";
    } catch {
      ToastService.getInstance().show("Ошибка при добавлении", "error");
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
