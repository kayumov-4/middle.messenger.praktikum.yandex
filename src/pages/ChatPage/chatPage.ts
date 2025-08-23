import Page from "../../../core/Page";
import Router from "../../../core/Router";
import ToastService from "../../../utils/toastService";
import { inputValidator } from "../../../utils/validator";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import { ProfileData } from "../../entities/interfaces/UserProfile";
import { conversations, messages } from "../../static/mockData";
import template from "./chatPage.hbs";
import "./chatPage.scss";

import ProfileSidebar from "../../components/partials/ProfileSidebar/profileSidebar";

const profileData: ProfileData = {
  user: {
    name: "Muhammad",
    email: "kayumov4040@gmail.com",
    login: "kayumov4040",
    firstName: "Muhammad",
    lastName: "Kayumov",
    chatName: "Muhammad",
    phone: "+998959774040",
    profileType: "initial",
    oldPassword: "123456",
    newPassword: "",
    confirmNewPassword: "",
  },
};

export default class ChatPage extends Page {
  private router = Router.getInstance();
  private profileSidebar: ProfileSidebar | null = null;

  private pageComponents = {
    chatSearchInput: new Input({
      className: "chat__search-input",
      id: "chatSearchInput",
      type: "text",
      inputType: "text",
      name: "search",
      placeholder: "Поиск",
      autocomplete: "off",
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
    chatProfileBtn: new Button({
      label: "",
      type: "button",
      className: "chat__settings-button",
      id: "chatProfileBtn",
      image: "/profile.svg",
      onClick: () => this.openProfileSidebar(),
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
      onClick: () => this.router.go("/login"),
    }),
  };

  constructor(props: any = {}) {
    super(template.toString(), {
      ...props,
      conversations,
      currentUser: "Muhammad",
      messages,
      profileData,
    });
    super.initComponents(this.pageComponents);
  }

  protected checkInputValue(inputName: string, InputEvent: Event) {
    const data = InputEvent.target as HTMLInputElement;
    const errorData = inputValidator(inputName, data.value);
    if (!errorData.isValid) {
      ToastService.getInstance().show(errorData.message, "error");
    }
  }

  private openProfileSidebar() {
    let container = document.querySelector(".profileSidebarContainer");
    if (!container) {
      container = document.createElement("div");
      container.classList.add("profileSidebarContainer");
      document.body.appendChild(container);
    }

    this.profileSidebar = new ProfileSidebar({
      user: profileData.user,
      children: {},
    });
    container.innerHTML = "";
    container.appendChild(this.profileSidebar.getContent()!);

    // const closeProfileBtn = container.querySelector("#closeProfile");
    // closeProfileBtn?.addEventListener("click", () =>
    //   this.closeProfileSidebar()
    // );

    // this.addEventListenersToProfile();
  }

  //   private closeProfileSidebar() {
  //     const profileSidebar = document.getElementById("profileSidebar");
  //     if (profileSidebar) {
  //       profileSidebar.classList.add("remove-profile-sidebar");
  //       setTimeout(() => {
  //         document.querySelector(".profileSidebarContainer")?.remove();
  //         this.profileSidebar = null;
  //       }, 300);
  //     }
  //   }

  //   private addEventListenersToProfile() {
  //     const changeProfileDataBtn = document.getElementById("changeProfileData");
  //     const logOutBtn = document.getElementById("logOut");
  //     const saveProfileBtn = document.getElementById("saveProfile");
  //     const changeProfilePasswordBtn = document.getElementById(
  //       "changeProfilePassword"
  //     );
  //     const changeAvatarBtn = document.getElementById("changeAvatar");

  //     logOutBtn?.addEventListener("click", () => {
  //       this.router.go("/login");
  //       this.closeProfileSidebar();
  //     });

  //     changeProfileDataBtn?.addEventListener("click", () => {
  //       profileData.user.profileType = "edit";
  //       document
  //         .querySelectorAll("#profileInfo input")
  //         .forEach((input) => ((input as HTMLInputElement).disabled = false));

  //       changeProfileDataBtn.style.display = "none";
  //       changeProfilePasswordBtn!.style.display = "none";
  //       logOutBtn!.style.display = "none";
  //       saveProfileBtn!.style.display = "block";
  //     });

  //     changeProfilePasswordBtn?.addEventListener("click", () => {
  //       profileData.user.profileType = "changePassword";
  //       (document.querySelector("#profileInfo") as HTMLElement).style.display =
  //         "none";
  //       (
  //         document.querySelector("#profileChangePassword") as HTMLElement
  //       ).style.display = "block";

  //       changeProfileDataBtn!.style.display = "none";
  //       changeProfilePasswordBtn.style.display = "none";
  //       logOutBtn!.style.display = "none";
  //       saveProfileBtn!.style.display = "block";
  //     });

  //     changeAvatarBtn?.addEventListener("click", () =>
  //       this.openChangeAvatarModal()
  //     );
  //   }

  // private openChangeAvatarModal() {
  //   let container = document.querySelector(".changeAvatarContainer");
  //   if (!container) {
  //     container = document.createElement("div");
  //     container.classList.add("changeAvatarContainer");
  //     document.body.appendChild(container);
  //   }

  //   container.innerHTML = `
  //     <div class="change-avatar-modal" id="changeAvatarModal">
  //       <div class="change-avatar-modal__content">
  //         <h3>Change Avatar</h3>
  //         <input type="file" id="avatarInput"/>
  //         <button id="closeChangeAvatarModal">Закрыть</button>
  //       </div>
  //     </div>
  //   `;

  //   const closeBtn = container.querySelector("#closeChangeAvatarModal");
  //   closeBtn?.addEventListener("click", () => {
  //     document
  //       .querySelector(".change-avatar-modal")
  //       ?.classList.add("remove-change-avatar-modal");
  //   });
  // }

  render() {
    return this.compile(template.toString(), this.props);
  }
}
