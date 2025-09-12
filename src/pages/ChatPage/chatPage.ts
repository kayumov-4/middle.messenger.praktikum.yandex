import { ProfileData } from "../../entities/interfaces/UserProfile";
import Page from "../../../core/Page";
import Router from "../../../core/Router";
import ToastService from "../../../utils/toastService";
import { inputValidator } from "../../../utils/validator";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import template from "./chatPage.hbs";
import { CreateChatModal } from "../../components/partials/CreateChatModal/CreateChatModal";
import { ChatsList } from "../../components/partials/ChatList/ChatList";
import { ChatHeader } from "../../components/partials/ChatHeader/ChatHeader";
import { UseFetch } from "../../../utils/useFetch";
import AuthStore from "../../stores/AuthStore";
import { ActiveChat } from "../../components/partials/ActiveChat/ActiveChat";
import formatMessageTime from "../../../utils/formatMessageTime";
import "./chatPage.scss";
import { ConfirmDeleteModal } from "../../components/partials/ConfirmDeleteModal/ConfirmDeleteModal";
import { ChatUsersModal } from "../../components/partials/ChatUsersModal/ChatUsersModal";
import { ChatAddUserModal } from "../../components/partials/ChatAddUserModal/ChatAddUserModal";

interface ChatPageProps {
  conversations: any[];
  messages: any[];
  activeChatId: number | null;
  activeChatTitle: string | null;
  currentUser: string;
  profileData: ProfileData;
}

export default class ChatPage extends Page<ChatPageProps> {
  private pageComponents: any;
  private socket: WebSocket | null = null;
  constructor(props: Partial<ChatPageProps> = {}) {
    const user = AuthStore.getInstance().getUser();
    if (!user) {
      Router.getInstance().go("/sign-in");
    }
    const profileData: ProfileData = {
      user: {
        id: user?.id || 0,
        name: user?.first_name ?? "",
        email: user?.email ?? "",
        login: user?.login ?? "",
        firstName: user?.first_name ?? "",
        lastName: user?.second_name ?? "",
        chatName: user?.display_name || user?.login || "",
        phone: user?.phone ?? "",
        profileType: "initial",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
    };
    super(template.toString(), {
      conversations: [],
      messages: [],
      activeChatId: null,
      activeChatTitle: null,
      currentUser: user?.first_name || "Me",
      profileData,
      ...props,
    });
    this.pageComponents = {
      chatsList: new ChatsList({
        conversations: [],
        activeChatId: null,
      }),
      confirmDeleteModal: new ConfirmDeleteModal({}),
      chatUsersModal: new ChatUsersModal({
        onClose: () => console.log("Users modal closed"),
      }),
      chatAddUserModal: new ChatAddUserModal({
        onClose: () => console.log("Add user modal closed"),
      }),
      chatHeader: new ChatHeader({
        activeChatTitle: this.props.activeChatTitle,
        onMenuSelect: (action) => {
          if (action === "users") {
            console.log("Manage users");
            if (this.props.activeChatId) {
              (this.pageComponents.chatUsersModal as ChatUsersModal).show(
                this.props.activeChatId
              );
            } else {
              ToastService.getInstance().show("Нет активного чата", "error");
            }
          } else if (action === "add") {
            console.log("Add user");
            //
            if (this.props.activeChatId) {
              (this.pageComponents.chatAddUserModal as ChatAddUserModal).show(
                this.props.activeChatId
              );
            }
            //
          } else if (action === "remove") {
            if (this.props.activeChatId) {
              (
                this.pageComponents.confirmDeleteModal as ConfirmDeleteModal
              ).show(this.props.activeChatId);
            }
          }
        },
      }),
      activeChat: new ActiveChat({
        messages: [],
      }),
      chatSearchInput: new Input({
        className: "chat__search-input",
        id: "chatSearchInput",
        type: "text",
        inputType: "text",
        name: "search",
        placeholder: "Поиск",
        autocomplete: "off",
      }),
      createChatModal: new CreateChatModal({
        onSave: async (title) => {
          try {
            const api = UseFetch.getInstance(
              "https://ya-praktikum.tech/api/v2"
            );
            await api.post("/chats", { data: { title } });
            const chats = (await api.get<any[]>("/chats")) || [];

            this.setProps({ conversations: chats });
            (this.pageComponents.chatsList as ChatsList).setProps({
              conversations: chats,
            });
            ToastService.getInstance().show("Чат создан", "success");
          } catch (err) {
            console.error("Create chat error:", err);
            ToastService.getInstance().show(
              "Ошибка при создании чата",
              "error"
            );
          }
        },
        onClose: () => {},
      }),
      createChatBtn: new Button({
        label: "Новый чат",
        type: "button",
        id: "createChatBtn",
        onClick: () => {
          (this.pageComponents.createChatModal as CreateChatModal).show();
        },
      }),
      messageInput: new Input({
        className: "chat__search-input",
        wrapperClassName: "chat__message-input-wrapper",
        id: "messageInput",
        type: "text",
        inputType: "text",
        autocomplete: "off",
        name: "message",
        placeholder: "Сообщение",
        events: {
          blur: (e) => this.checkInputValue("message", e),
        },
      }),
      sendMessageButton: new Button({
        label: "",
        type: "button",
        className: "chat__send-button",
        id: "sendButton",
        image: "/arrow-right.svg",
        onClick: (e) => {
          e.preventDefault();

          const input = document.getElementById(
            "messageInput"
          ) as HTMLInputElement;
          const text = input?.value.trim();

          if (!text) {
            ToastService.getInstance().show(
              "Сообщение не может быть пустым",
              "error"
            );
            return;
          }

          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(
              JSON.stringify({
                content: text,
                type: "message",
              })
            );
            input.value = "";
          } else {
            ToastService.getInstance().show(
              "Соединение с чатом не установлено",
              "error"
            );
          }
        },
      }),

      chatProfileBtn: new Button({
        label: "",
        type: "button",
        className: "chat__settings-button",
        id: "chatProfileBtn",
        image: "/profile.svg",
        onClick: () => Router.getInstance().go("/settings"),
      }),
      chatSettingsBtn: new Button({
        label: "",
        type: "button",
        className: "chat__settings-button",
        id: "chatSettingsBtn",
        image: "/settings.svg",
        onClick: () => {},
      }),
      chatLogoutBtn: new Button({
        label: "",
        type: "button",
        className: "chat__logout-button",
        id: "chatLogoutBtn",
        image: "/logout.svg",
        onClick: async () => {
          try {
            const api = UseFetch.getInstance(
              "https://ya-praktikum.tech/api/v2"
            );
            await api.post("/auth/logout");
            AuthStore.getInstance().clear();
            ToastService.getInstance().show("Вы вышли из системы", "success");
            Router.getInstance().go("/sign-in");
          } catch (err) {
            console.error("Logout error:", err);
            ToastService.getInstance().show("Ошибка при выходе", "error");
          }
        },
      }),
    };
    super.initComponents(this.pageComponents);
  }
  protected async onMount() {
    try {
      const api = UseFetch.getInstance("https://ya-praktikum.tech/api/v2");
      const chats = await api.get<any[]>("/chats");

      this.setProps({ conversations: chats });

      (this.pageComponents.chatsList as ChatsList).setProps({
        conversations: chats.map((chat) => ({
          ...chat,
          last_message: chat.last_message
            ? {
                ...chat.last_message,
                time: formatMessageTime(chat.last_message.time),
              }
            : null,
        })),
      });
    } catch (err) {
      console.error("Chats load error:", err);
      ToastService.getInstance().show("Чаты не загрузились", "error");
    }
    const chatList = document.querySelector(".chat__conversations");
    if (chatList) {
      chatList.addEventListener("click", (e) => {
        const li = (e.target as HTMLElement).closest(
          ".chat__conversation-item"
        );
        if (li) {
          const id = Number(li.getAttribute("data-id"));
          this.openChat(id);
        }
      });
    }
  }
  private async openChat(chatId: number) {
    try {
      const api = UseFetch.getInstance("https://ya-praktikum.tech/api/v2");
      const user = AuthStore.getInstance().getUser();
      console.log("user:", user);

      if (!user) {
        ToastService.getInstance().show("Вы не авторизованы", "error");
        return;
      }

      const tokenResponse = await api.post<{ token: string }>(
        `/chats/token/${chatId}`
      );
      const token = tokenResponse?.token;
      if (!token) {
        ToastService.getInstance().show("Токен не получен", "error");
        return;
      }

      const selectedChat = (this.props.conversations || []).find(
        (chat: any) => chat.id === chatId
      );
      console.log("Selected chat:", selectedChat);
      if (!selectedChat) {
        ToastService.getInstance().show("Чат не найден", "error");
        return;
      }

      const chatTitle = selectedChat.title || "Без названия";
      (this.pageComponents.chatHeader as ChatHeader).setProps({
        activeChatTitle: chatTitle,
      });

      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }

      const socketUrl = `wss://ya-praktikum.tech/ws/chats/${user.id}/${chatId}/${token}`;
      this.socket = new WebSocket(socketUrl);

      this.socket.addEventListener("open", () => {
        console.log("✅ WebSocket connected");
        this.socket?.send(
          JSON.stringify({
            content: "0",
            type: "get old",
          })
        );
      });

      this.socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          const oldMessages = data.reverse().map((msg: any) => ({
            user: { first_name: msg.user?.first_name || "System" },
            content: msg.content,
            time: new Date(msg.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMine: msg.user_id === user.id,
          }));

          this.setProps({ messages: oldMessages });
          (this.pageComponents.activeChat as ActiveChat).setProps({
            messages: oldMessages,
          });
        } else if (data.type === "message") {
          const newMessage = {
            user: { first_name: data.user?.first_name || "System" },
            content: data.content,
            time: new Date(data.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMine: data.user_id === user.id,
          };
          console.log("New message received:", newMessage);

          const oldMessages = this.props.messages || [];
          const updatedMessages = [...oldMessages, newMessage];

          this.setProps({ messages: updatedMessages });
          (this.pageComponents.activeChat as ActiveChat).setProps({
            messages: updatedMessages,
          });
        }
      });

      this.socket.addEventListener("close", () => {
        console.log("❌ WebSocket closed");
      });

      this.socket.addEventListener("error", (err) => {
        console.error("WebSocket error:", err);
        ToastService.getInstance().show("Ошибка WebSocket", "error");
      });

      this.setProps({
        activeChatId: chatId,
        activeChatTitle: chatTitle,
        messages: [],
      });
      (this.pageComponents.chatsList as ChatsList).setProps({
        activeChatId: chatId,
      });
      (this.pageComponents.activeChat as ActiveChat).setProps({
        messages: [],
      });
    } catch (err) {
      console.error("Open chat error:", err);
      ToastService.getInstance().show("Ошибка при открытии чата", "error");
    }
  }
  protected checkInputValue(inputName: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const errorData = inputValidator(inputName, input.value);
    if (!errorData.isValid) {
      ToastService.getInstance().show(errorData.message, "error");
    }
  }
  protected checkFormValues(formId: string) {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      const inputs: Record<string, string> = {};
      formData.forEach((value, key) => {
        inputs[key] = value.toString();
        const validation = inputValidator(key, value.toString());
        if (!validation.isValid) {
          ToastService.getInstance().show(validation.message, "error");
        } else {
          console.log(inputs);
        }
      });
    }
  }
  render() {
    return this.compile(template.toString(), this.props);
  }
}
