import Handlebars from "handlebars";
import * as Pages from "./pages";
export default class App {
  constructor() {
    this.state = {
      currentPage: "login",
    };
    this.appElement = document.querySelector("#app");
    this.render();
  }

  render() {
    let template;
    if (this.state.currentPage === "login") {
      template = Handlebars.compile(Pages.LoginPage);
      this.appElement.innerHTML = template();
    } else {
      template = Handlebars.compile(Pages.RegistrationPage);
      this.appElement.innerHTML = template();
    }
  }
}
