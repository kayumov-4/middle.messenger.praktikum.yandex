import Block from "../../../../core/Block";
import { UseFetch } from "../../../../utils/useFetch";
import ToastService from "../../../../utils/toastService";
import template from "./ChatUsersModal.hbs";
import "./ChatUsersModal.scss";

interface ChatUsersModalProps {
  chatId?: number | null;
  onClose?: () => void;
  events?: Record<string, (e: Event) => void>;
}

export class ChatUsersModal extends Block<ChatUsersModalProps> {
  constructor(props: ChatUsersModalProps) {
    super("div", {
      ...props,
      events: {
        click: async (e: Event) => {
          const target = e.target as HTMLElement;

          if (target.id === "closeChatUsersModal") {
            this.hide();
            this.props.onClose?.();
          }

          if (target.classList.contains("remove-user-btn")) {
            const userId = Number(target.getAttribute("data-user-id"));
            if (this.props.chatId && userId) {
              await this.removeUser(this.props.chatId, userId);
              await this.loadUsers(this.props.chatId);
            }
          }
        },
      },
    });
  }

  public async show(chatId: number) {
    this.setProps({ chatId });
    this.getContent()?.classList.remove("hidden");
    await this.loadUsers(chatId);
  }

  public hide() {
    this.getContent()?.classList.add("hidden");
  }

  private async loadUsers(chatId: number) {
    try {
      const api = UseFetch.getInstance("https://ya-praktikum.tech/api/v2");
      const users = await api.get<any[]>(`/chats/${chatId}/users`);
      const listEl = this.getContent()?.querySelector("#chatUsersList");
      if (listEl) {
        listEl.innerHTML = users
          .map(
            (u) => `
              <div class="chat-users-modal__user">
                <span>${u.first_name} ${u.second_name} (${u.login})</span>
                <button 
                  class="remove-user-btn" 
                  data-user-id="${u.id}"
                >Удалить</button>
              </div>
            `
          )
          .join("");
      }
    } catch (err) {
      console.error("Ошибка загрузки пользователей:", err);
      ToastService.getInstance().show(
        "Не удалось загрузить пользователей",
        "error"
      );
    }
  }

  private async removeUser(chatId: number, userId: number) {
    try {
      const api = UseFetch.getInstance("https://ya-praktikum.tech/api/v2");
      await api.delete("/chats/users", {
        data: { users: [userId], chatId },
      });
      ToastService.getInstance().show("Пользователь удален", "success");
    } catch (err) {
      console.error("Ошибка удаления пользователя:", err);
      ToastService.getInstance().show(
        "Не удалось удалить пользователя",
        "error"
      );
    }
  }

  render() {
    return this.compile(template.toString(), this.props);
  }
}
