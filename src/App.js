import Handlebars from "handlebars";
import profileSidebarPartial from "./components/partials/profilePartial.hbs";
import changeAvatarFormPartial from "./components/partials/changeAvatarModalPartial.hbs";
import { conversations, messages } from "./static/mockData";
import * as Pages from "./pages";

Handlebars.registerPartial("profileSidebarPartial", profileSidebarPartial);
Handlebars.registerPartial("changeAvatarFormPartial", changeAvatarFormPartial);
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
    oldPassword: "123456",
    newPassword: "",
    confirmNewPassword: "",
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
    } else if (path === "/navigation") {
      this.render("navigation");
    } else {
      this.render("navigation");
    }
  }

  render(page) {
    let template;
    if (page === "navigation") {
      template = Handlebars.compile(Pages.NavigationPage);
      this.appElement.innerHTML = template();
    } else if (page === "login") {
      template = Handlebars.compile(Pages.LoginPage);
      this.appElement.innerHTML = template();
      this.setLoginForm();
      this.setLoginFormListeners();
    } else if (page === "register") {
      template = Handlebars.compile(Pages.RegistrationPage);
      this.appElement.innerHTML = template();
      this.setRegistrationForm();
      this.setRegistrationFormListeners();
    } else if (page === "notFound") {
      template = Handlebars.compile(Pages.NotFoundPage);
      this.appElement.innerHTML = template();
    } else if (page === "error") {
      template = Handlebars.compile(Pages.ErrorPage);
      this.appElement.innerHTML = template();
    } else if (page === "chat") {
      template = Handlebars.compile(Pages.ChatPage);
      this.appElement.innerHTML = template({
        conversations: conversations,
        messages: messages,
        currentUser: "Мухаммад",
      });

      this.addEventListenersToChat();
    } else {
      template = Handlebars.compile(Pages.NotFoundPage);
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
        const sidebarTemplate = Handlebars.compile(
          "{{> profileSidebarPartial }}"
        );
        const html = sidebarTemplate(profileData);
        let container = document.querySelector(".profileSidebarContainer");
        if (!container) {
          const newContainer = document.createElement("div");
          newContainer.classList.add("profileSidebarContainer");
          document.body.appendChild(newContainer);
          container = newContainer;
        }
        container.innerHTML = html;
        document.body.appendChild(container);

        container
          .querySelector("#closeProfile")
          .addEventListener("click", () =>
            document
              .getElementById("profileSidebar")
              .classList.add("remove-profile-sidebar")
          );

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
    const changeAvatarBtn = document.getElementById("changeAvatar");
    if (logOutBtn) {
      logOutBtn.addEventListener("click", () => {
        this.render("login");
        document
          .getElementById("profileSidebar")
          .classList.add("remove-profile-sidebar");

        setTimeout(() => {
          const container = document.querySelector(".profileSidebarContainer");
          if (container) {
            container.remove();
          }
        }, 1000);
      });
    }
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

    if (changeProfilePasswordBtn) {
      changeProfilePasswordBtn.addEventListener("click", () => {
        profileData.user.profileType = "changePassword";
        const profileInfo = document.querySelector("#profileInfo");
        profileInfo.style.display = "none";
        const changePasswordFields = document.querySelector(
          "#profileChangePassword"
        );
        changePasswordFields.style.display = "block";
        changeProfileDataBtn.style.display = "none";
        changeProfilePasswordBtn.style.display = "none";
        logOutBtn.style.display = "none";
        saveProfileBtn.style.display = "block";
      });
    }

    if (changeAvatarBtn) {
      changeAvatarBtn.addEventListener("click", () => {
        const changeAvatarTemplate = Handlebars.compile(
          "{{> changeAvatarFormPartial }}"
        );
        const html = changeAvatarTemplate();
        let container = document.querySelector(".changeAvatarContainer");
        if (!container) {
          const newContainer = document.createElement("div");
          newContainer.classList.add("changeAvatarContainer");
          document.body.appendChild(newContainer);
          container = newContainer;
        }
        container.innerHTML = html;
        document.body.appendChild(container);

        container
          .querySelector("#closeChangeAvatarModal")
          .addEventListener("click", () =>
            document
              .querySelector(".change-avatar-modal")
              .classList.add("remove-change-avatar-modal")
          );
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
  setLoginFormListeners() {
    const loginPageNoAccountBtn = document.getElementById(
      "loginPageNoAccountBtn"
    );
    if (loginPageNoAccountBtn) {
      loginPageNoAccountBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.render("register");
      });
    }
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
  setRegistrationFormListeners() {
    const registrationHasAccountBtn = document.getElementById(
      "registrationHasAccountBtn"
    );
    if (registrationHasAccountBtn) {
      registrationHasAccountBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.render("login");
      });
    }
  }
}
