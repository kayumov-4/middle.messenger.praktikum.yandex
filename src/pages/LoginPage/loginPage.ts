import Block from "../../../core/Block";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import template from "./loginPage.hbs";
import Page from "../../../core/Page";
import Link from "../../components/ui/Link/Link";
import ToastService from "../../../utils/toastService";
import { inputValidator } from "../../../utils/validator";
import "./loginPage.scss";

export default class LoginPage extends Page {
  private pageComponents: Record<string, Block> = {
    loginInput: new Input({
      id: "loginInput",
      label: "Логин",
      inputType: "text",
      type: "text",
      name: "login",
      className: "login-card__form-input",
      autocomplete: "login",
      events: {
        blur: (e) => {
          this.checkInputValue("login", e);
        },
      },
    }),

    passwordInput: new Input({
      id: "passwordInput",
      label: "Пароль",
      inputType: "password",
      type: "password",
      name: "password",
      className: "login-card__form-input",
      autocomplete: "password",
      events: {
        blur: (e) => {
          this.checkInputValue("password", e);
        },
      },
    }),

    loginButton: new Button({
      label: "Авторизоваться",
      type: "button",
      className: "login-card__button",
      onClick: (e) => {
        e.preventDefault();
        this.checkFormValues("loginForm");
      },
    }),
    loginLink: new Link({
      href: "/register",
      label: "Нет аккаунта?",
      className: "login-card__no-account-link",
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
