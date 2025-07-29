import Handlebars from "handlebars";
import * as Pages from "./pages";

export default class App {
  constructor() {
    this.state = {
      currentPage: "register",
    };
    this.appElement = document.querySelector("#app");
    this.render();
  }

  render() {
    let template;

    if (this.state.currentPage === "login") {
      template = Handlebars.compile(Pages.LoginPage);
      this.appElement.innerHTML = template();
      this.setLoginForm();
    } else if (this.state.currentPage === "register") {
      template = Handlebars.compile(Pages.RegistrationPage);
      this.appElement.innerHTML = template();
      this.setRegistrationForm();
    }
  }

  setLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const username = formData.get("username");
      const password = formData.get("password");

      this.handleLoginFormSubmit(username, password);
    });
  }

  handleLoginFormSubmit(username, password) {
    console.log("Login submitted:", { username, password });
  }

  setRegistrationForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const userData = {
        first_name: formData.get("first_name"),
        second_name: formData.get("second_name"),
        login: formData.get("login"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
      };

      this.handleRegisterFormSubmit(userData);
    });
  }

  handleRegisterFormSubmit(userData) {
    console.log("Registration submitted:", userData);
  }
}
