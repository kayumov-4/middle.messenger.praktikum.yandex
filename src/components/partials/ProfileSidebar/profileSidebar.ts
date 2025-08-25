import Block from "../../../../core/Block";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import template from "./profileSidebar.hbs";
import "./profileSidebar.scss";
import { ChangeAvatarModal } from "../ChangeAvatarModal/changeAvatarModal";
import Avatar from "../../ui/Avatar/Avatar";
import { inputValidator } from "../../../../utils/validator";
import ToastService from "../../../../utils/toastService";

export interface ProfileSidebarProps {
  children: any;
  user: {
    name: string;
    email: string;
    login: string;
    firstName: string;
    lastName: string;
    chatName: string;
    phone: string;
    profileType: string;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
  events?: {};
}

export default class ProfileSidebar extends Block<ProfileSidebarProps> {
  constructor(props: ProfileSidebarProps) {
    const children = {
      changeAvatarModal: new ChangeAvatarModal({
        onSave: (file: File) => {
          console.log("Yuklangan fayl:", file);
        },
        onClose: () => {
          console.log("Modal yopildi");
        },
      }),
      changeAvatar: new Avatar({
        src: "/no-photo.png",
        onClick: () => {
          (children.changeAvatarModal as ChangeAvatarModal).show();
        },
      }),
      closeProfile: new Button({
        label: "",
        type: "button",
        className: "profile__back-btn",
        id: "closeProfile",
        image: "/arrow-right.svg",
        onClick: () => {
          const profileSidebar = document.getElementById("profileSidebar");
          if (profileSidebar) {
            profileSidebar.classList.add("remove-profile-sidebar");
            setTimeout(() => {
              document.querySelector(".profileSidebarContainer")?.remove();
            }, 300);
          }
        },
      }),
      emailInput: new Input({
        name: "email",
        type: "email",
        className: "profile__info-item-input",
        wrapperClassName: "profile__info-item",
        value: props.user.email,
        disabled: true,
        label: "Почта",
        id: "emailInput",
        autocomplete: "email",
        events: {
          blur: (e) => this.checkInputValue("email", e),
        },
      }),
      loginInput: new Input({
        name: "login",
        type: "text",
        className: "profile__info-item-input",
        wrapperClassName: "profile__info-item",
        value: props.user.login,
        disabled: true,
        label: "Логин",
        id: "loginInput",
        autocomplete: "login",
        events: {
          blur: (e) => this.checkInputValue("login", e),
        },
      }),
      firstNameInput: new Input({
        name: "first_name",
        type: "text",
        className: "profile__info-item-input",
        wrapperClassName: "profile__info-item",
        value: props.user.firstName,
        disabled: true,
        label: "Имя",
        id: "firstNameInput",
        autocomplete: "first_name",
        events: {
          blur: (e) => this.checkInputValue("first_name", e),
        },
      }),
      secondNameInput: new Input({
        name: "second_name",
        type: "text",
        className: "profile__info-item-input",
        wrapperClassName: "profile__info-item",
        value: props.user.lastName,
        disabled: true,
        label: "Фамилия",
        id: "secondNameInput",
        autocomplete: "second_name",
        events: {
          blur: (e) => this.checkInputValue("second_name", e),
        },
      }),
      displayNameInput: new Input({
        name: "display_name",
        type: "text",
        className: "profile__info-item-input",
        wrapperClassName: "profile__info-item",
        value: props.user.chatName,
        disabled: true,
        label: "Имя в чате",
        id: "displayNameInput",
        autocomplete: "display_name",
        events: {
          blur: (e) => this.checkInputValue("display_name", e),
        },
      }),
      phoneInput: new Input({
        name: "phone",
        className: "profile__info-item-input",
        wrapperClassName: "profile__info-item",
        type: "text",
        value: props.user.phone,
        disabled: true,
        label: "Телефон",
        id: "phoneInput",
        autocomplete: "phone",
        events: {
          blur: (e) => this.checkInputValue("phone", e),
        },
      }),
      //   Second form
      oldPasswordInput: new Input({
        name: "oldPassword",
        className: "profile__info-item-input",
        wrapperClassName: "profile__info-item hidden",
        type: "password",
        value: props.user.oldPassword,
        disabled: false,
        label: "Старый пароль",
        id: "oldPasswordInput",
        autocomplete: "old-password",
        events: {
          blur: (e) => this.checkInputValue("password", e),
        },
      }),
      newPasswordInput: new Input({
        name: "newPassword",
        className: "profile__info-item-input",
        wrapperClassName: "profile__info-item hidden",
        type: "password",
        value: props.user.newPassword,
        disabled: false,
        label: "Новый пароль",
        autocomplete: "new-password",
        id: "newPasswordInput",
        events: {
          blur: (e) => this.checkInputValue("password", e),
        },
      }),
      confirmNewPasswordInput: new Input({
        name: "confirmNewPassword",
        className: "profile__info-item-input",
        wrapperClassName: "profile__info-item hidden",
        type: "password",
        value: props.user.confirmNewPassword,
        disabled: false,
        label: "Повторите новый пароль",
        id: "confirmNewPasswordInput",
        autocomplete: "current-password",
        events: {
          blur: (e) => this.checkInputValue("password", e),
        },
      }),
      backBtn: new Button({
        label: "",
        type: "button",
        className: "profile__back-btn",
        id: "closeProfile",
        image: "/arrow-right.svg",
      }),
      changeProfileData: new Button({
        label: "Изменить данные",
        className: "profile__action profile__action--blue",
        id: "changeProfileData",
        onClick: () => {
          [
            "emailInput",
            "loginInput",
            "firstNameInput",
            "secondNameInput",
            "displayNameInput",
            "phoneInput",
          ].forEach((key) => {
            const input = this.props.children[key];
            if (input) {
              input.setProps({ disabled: false });
            }
          });
          this.props.children.changeProfileData.setProps({
            className: "profile__action profile__action--blue hidden",
          });
          this.props.children.changeProfilePassword.setProps({
            className: "profile__action profile__action--blue hidden",
          });
          this.props.children.logOut.setProps({
            className: "profile__action profile__action--red hidden",
          });

          this.props.children.saveProfile.setProps({
            className: "profile__save-btn",
          });
        },
      }),
      changeProfilePassword: new Button({
        label: "Изменить пароль",
        className: "profile__action profile__action--blue",
        id: "changeProfilePassword",
        onClick: () => {
          // eski inputlarni yashirish
          [
            "emailInput",
            "loginInput",
            "firstNameInput",
            "secondNameInput",
            "displayNameInput",
            "phoneInput",
          ].forEach((key) => {
            const input = this.props.children[key];
            if (input) {
              input.setProps({
                wrapperClassName: "profile__info-item hidden",
              });
            }
          });

          // parol inputlarini ko‘rsatish
          [
            "oldPasswordInput",
            "newPasswordInput",
            "confirmNewPasswordInput",
          ].forEach((key) => {
            const input = this.props.children[key];
            if (input) {
              input.setProps({
                wrapperClassName: "profile__info-item",
              });
            }
          });
          const form = document.querySelector(
            "#profileChangePassword"
          ) as HTMLElement;
          form.style.display = "block";
          this.props.children.changeProfileData.setProps({
            className: "profile__action profile__action--blue hidden",
          });
          this.props.children.changeProfilePassword.setProps({
            className: "profile__action profile__action--blue hidden",
          });
          this.props.children.logOut.setProps({
            className: "profile__action profile__action--red hidden",
          });

          this.props.children.saveProfile.setProps({
            className: "profile__save-btn hidden",
          });
          this.props.children.saveProfilePassword.setProps({
            className: "profile__save-btn",
          });
        },
      }),
      logOut: new Button({
        label: "Выйти",
        className: "profile__action profile__action--red",
        id: "logOut",
      }),
      saveProfile: new Button({
        label: "Сохранить",
        className: "profile__save-btn hidden",
        id: "saveProfile",
        onClick: () => {
          this.checkFormValues("profileInfo");
        },
      }),
      saveProfilePassword: new Button({
        label: "Сохранить",
        className: "profile__save-btn hidden",
        id: "saveProfilePassword",
        onClick: () => {
          this.checkPasswordFormValues("profileChangePassword");
        },
      }),
    };
    super("div", {
      ...props,
      children,
    });
  }
  protected checkFormValues(formId: string) {
    const box = document.getElementById(formId) as HTMLFormElement;
    if (box) {
      const boxData = new FormData(box);
      const inputs: Record<string, string> = {};

      boxData.forEach((value, key) => {
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
  protected checkPasswordFormValues(formId: string) {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    const inputs: Record<string, string> = {};
    let isFormValid = true;

    formData.forEach((value, key) => {
      inputs[key] = value.toString().trim();

      const validation = inputValidator(key, inputs[key]);
      if (!validation.isValid) {
        isFormValid = false;
        ToastService.getInstance().show(validation.message, "error");
      }
    });

    if (!inputs.oldPassword) {
      isFormValid = false;
      ToastService.getInstance().show("Введите старый пароль", "error");
    }
    if (!inputs.newPassword) {
      isFormValid = false;
      ToastService.getInstance().show("Введите новый пароль", "error");
    }
    if (!inputs.confirmNewPassword) {
      isFormValid = false;
      ToastService.getInstance().show("Повторите новый пароль", "error");
    }
    if (
      inputs.newPassword &&
      inputs.confirmNewPassword &&
      inputs.newPassword !== inputs.confirmNewPassword
    ) {
      isFormValid = false;
      ToastService.getInstance().show("Пароли не совпадают", "error");
    }
    if (isFormValid) {
      ToastService.getInstance().show("Форма успешно отправлена", "success");
    }
  }

  protected checkInputValue(inputName: string, InputEvent: Event) {
    const data = InputEvent.target as HTMLInputElement;
    const errorData = inputValidator(inputName, data.value);
    if (!errorData.isValid) {
      ToastService.getInstance().show(errorData.message, "error");
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
