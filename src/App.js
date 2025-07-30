import Handlebars from "handlebars";
import loginTemplate from "./pages/loginPage.hbs";
import registerTemplate from "./pages/registerPage.hbs";
import notFoundTemplate from "./pages/404.hbs";
import errorTemplate from "./pages/500.hbs";
import chatTemplate from "./pages/chatPage.hbs";
import navigationTemplate from "./pages/navigationPage.hbs";

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
    } else if (path === "/500") {
      this.render("error");
    } else if (path === "/messenger") {
      this.render("chat");
    } else if (path === "/navigation") {
      this.render("navigation");
    } else {
      errorTemplate;
      this.render("notFound");
    }
  }

  render(page) {
    let template;
    if (page === "navigation") {
      template = Handlebars.compile(navigationTemplate);
      this.appElement.innerHTML = template();
    } else if (page === "login") {
      template = Handlebars.compile(loginTemplate);
      this.appElement.innerHTML = template();
      this.setLoginForm();
    } else if (page === "register") {
      template = Handlebars.compile(registerTemplate);
      this.appElement.innerHTML = template();
      this.setRegistrationForm();
    } else if (page === "notFound") {
      template = Handlebars.compile(notFoundTemplate);
      this.appElement.innerHTML = template();
    } else if (page === "error") {
      template = Handlebars.compile(errorTemplate);
      this.appElement.innerHTML = template();
    } else if (page === "chat") {
      template = Handlebars.compile(chatTemplate);
      this.appElement.innerHTML = template({
        conversations: conversations,
        messages: messages,
      });
    } else {
      template = Handlebars.compile(notFoundTemplate);
      this.appElement.innerHTML = template();
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
