import Block from "../../../core/Block";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import template from "./loginPage.hbs";
import Page from "../../../core/Page";
import Link from "../../components/ui/Link/Link";
import ToastService from "../../../utils/toastService";
import { inputValidator } from "../../../utils/validator";
import "./loginPage.scss";
import { UseFetch } from "../../../utils/useFetch";
import Router from "../../../core/Router";
import AuthStore from "../../stores/AuthStore";

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
      href: "/sign-up",
      label: "Нет аккаунта?",
      className: "login-card__no-account-link",
      onNavigate: () => {},
    }),
  };
  constructor() {
    super(template.toString(), { title: "", template: template.toString() });
    super.initComponents(this.pageComponents);
  }

  protected async checkFormValues(formId: string) {
    const box = document.getElementById(formId) as HTMLFormElement;
    if (!box) return;

    const boxData = new FormData(box);
    const inputs: Record<string, string> = {};

    let hasError = false;

    boxData.forEach((value, key) => {
      inputs[key] = value.toString();
      const validation = inputValidator(key, value.toString());
      if (!validation.isValid) {
        ToastService.getInstance().show(validation.message, "error");
        hasError = true;
      }
    });

    if (hasError) return;

    try {
      const api = UseFetch.getInstance("https://ya-praktikum.tech/api/v2");
      await api.post("/auth/signin", {
        data: {
          login: inputs.login,
          password: inputs.password,
        },
      });
      ToastService.getInstance().show("Успешный вход", "success");

      const user = await api.get("/auth/user");
      AuthStore.getInstance().setUser(user);

      Router.getInstance().go("/messenger");
    } catch (err: any) {
      if (err?.response?.reason === "User already in system") {
        Router.getInstance().go("/messenger");
      }
      console.error("Login error:", err);
      ToastService.getInstance().show("Неверный логин или пароль", "error");
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
