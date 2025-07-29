import Handlebars from "handlebars";
import loginTemplate from "./pages/loginPage.hbs";
import registerTemplate from "./pages/registerPage.hbs";
import notFoundTemplate from "./pages/404.hbs";
import chatTemplate from "./pages/chatPage.hbs";
import { conversations, messages } from "./static/mockData";

export default class App {
  constructor() {
    this.appElement = document.querySelector("#app");
    this.setPageFromPath(window.location.pathname);
  }

  setPageFromPath(path) {
    if (path === "/login") {
      this.render("login");
    } else if (path === "/register") {
      this.render("register");
    } else if (path === "/404") {
      this.render("notFoundPage");
    } else {
      this.render("chat");
    }
  }

  render(page) {
    let template;
    if (page === "login") {
      template = Handlebars.compile(loginTemplate);
      this.appElement.innerHTML = template();
      this.setLoginForm();
    } else if (page === "register") {
      template = Handlebars.compile(registerTemplate);
      this.appElement.innerHTML = template();
      this.setRegistrationForm();
    } else if (page === "notFoundPage") {
      template = Handlebars.compile(notFoundTemplate);
      this.appElement.innerHTML = template();
    } else {
      template = Handlebars.compile(chatTemplate);
      this.appElement.innerHTML = template({
        conversations: conversations,
        messages: messages,
      });
    }
  }

  setLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      console.log("Login data:", {
        username: formData.get("username"),
        password: formData.get("password"),
      });
    });
  }

  setRegistrationForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      console.log("Registration data:", Object.fromEntries(formData));
    });
  }
}
