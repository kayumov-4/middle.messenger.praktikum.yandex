import Block from "../../../core/Block";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import template from "./registerPage.hbs";
import Page from "../../../core/Page";
import Link from "../../components/ui/Link/Link";
import ToastService from "../../../utils/toastService";
import { inputValidator } from "../../../utils/validator";
import "./registerPage.scss";

export default class RegisterPage extends Page {
  private pageComponents: Record<string, Block> = {
    registerFirstName: new Input({
      id: "registerFirstName",
      label: "Имя",
      inputType: "text",
      type: "text",
      name: "first_name",
      className: "register-card__form-input",
      autocomplete: "first_name",
      events: {
        blur: (e) => {
          this.checkInputValue("first_name", e);
        },
      },
    }),
    registerSecondName: new Input({
      id: "registerSecondName",
      label: "Фамилия",
      inputType: "text",
      type: "text",
      name: "second_name",
      className: "register-card__form-input",
      autocomplete: "second_name",
      events: {
        blur: (e) => {
          this.checkInputValue("second_name", e);
        },
      },
    }),
    registerLogin: new Input({
      id: "registerLogin",
      label: "Логин",
      inputType: "text",
      type: "text",
      name: "login",
      className: "register-card__form-input",
      autocomplete: "login",
      events: {
        blur: (e) => {
          this.checkInputValue("login", e);
        },
      },
    }),
    registerEmail: new Input({
      id: "registerEmail",
      label: "Email",
      inputType: "email",
      type: "text",
      name: "email",
      className: "register-card__form-input",
      autocomplete: "email",
      events: {
        blur: (e) => {
          this.checkInputValue("email", e);
        },
      },
    }),

    registerPassword: new Input({
      id: "registerPassword",
      label: "Пароль",
      inputType: "password",
      type: "password",
      name: "password",
      className: "register-card__form-input",
      autocomplete: "password",
      events: {
        blur: (e) => {
          this.checkInputValue("password", e);
        },
      },
    }),
    registerPhone: new Input({
      id: "registerPhone",
      label: "Телефон",
      inputType: "text",
      type: "text",
      name: "phone",
      className: "register-card__form-input",
      autocomplete: "phone",
      events: {
        blur: (e) => {
          this.checkInputValue("phone", e);
        },
      },
    }),
    registerButton: new Button({
      label: "Зарегистрироваться",
      type: "button",
      className: "register-card__button",
      onClick: (e) => {
        e.preventDefault();
        this.checkFormValues("registerForm");
      },
    }),
    registerLink: new Link({
      href: "/login",
      label: "Уже есть аккаунт?",
      className: "register-card__login-link",
      onNavigate: () => {},
    }),
  };
  constructor() {
    super(template.toString(), { title: "Редактировать профиль" });
    super.initComponents(this.pageComponents);
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
  protected checkInputValue(inputName: string, InputEvent: Event) {
    const data = InputEvent.target as HTMLInputElement;
    const errorData = inputValidator(inputName, data.value);
    if (!errorData.isValid) {
      ToastService.getInstance().show(errorData.message, "error");
    }
  }
}
