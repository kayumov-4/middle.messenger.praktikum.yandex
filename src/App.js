import Handlebars from "handlebars";
import loginTemplate from "./pages/loginPage.hbs";
import registerTemplate from "./pages/registerPage.hbs";
import notFoundTemplate from "./pages/404.hbs";
import errorTemplate from "./pages/500.hbs";
import chatTemplate from "./pages/chatPage.hbs";
import navigationTemplate from "./pages/navigationPage.hbs";
import profileSidebarPartial from "./components/partials/profilePartial.hbs";
import { conversations, messages } from "./static/mockData";

Handlebars.registerPartial("profileSidebar", profileSidebarPartial);

const profileData = {
  user: {
    name: "Muhammad",
    email: "kayumov4040@gmail.com",
    login: "kayumov4040",
    firstName: "Muhammad",
    lastName: "Kayumov",
    chatName: "Muhammad",
    phone: "+998959774040",
    profileType: "initial",
  },
};

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
    } else if (path === "/404") {
      this.render("notFound");
    } else {
      this.render("navigation");
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

      this.addEventListenersToChat();
    } else {
      template = Handlebars.compile(notFoundTemplate);
      this.appElement.innerHTML = template();
    }
  }
  addEventListenersToChat() {
    setTimeout(() => {
      const btn = document.getElementById("profileSidebarBtn");
      const chatLogoutBtn = document.getElementById("chatLogoutBtn");

      chatLogoutBtn.addEventListener("click", () => {
        this.render("login");
      });

      btn.addEventListener("click", () => {
        const sidebarTemplate = Handlebars.compile("{{> profileSidebar }}");
        const html = sidebarTemplate(profileData);

        const container = document.createElement("div");
        container.innerHTML = html;
        document.body.appendChild(container);

        container
          .querySelector("#closeProfile")
          .addEventListener("click", () => container.remove());

        this.addEventListenersToProfile();
      });
    }, 0);
  }

  addEventListenersToProfile() {
    const changeProfileDataBtn = document.getElementById("changeProfileData");
    const logOutBtn = document.getElementById("logOut");
    const saveProfileBtn = document.getElementById("saveProfile");
    const changeProfilePasswordBtn = document.getElementById(
      "changeProfilePassword"
    );
    if (changeProfileDataBtn) {
      changeProfileDataBtn.addEventListener("click", () => {
        profileData.user.profileType = "edit";
        const inputs = document.querySelectorAll("#profileInfo input");
        inputs.forEach((input) => (input.disabled = false));

        changeProfileDataBtn.style.display = "none";
        changeProfilePasswordBtn.style.display = "none";
        logOutBtn.style.display = "none";
        saveProfileBtn.style.display = "block";
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
