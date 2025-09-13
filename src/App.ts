import LoginPage from "./pages/LoginPage/loginPage";
import RegisterPage from "./pages/RegisterPage/registerPage";
import NotFoundPage from "./pages/NotFoundPage/404";
import NavigationPage from "./pages/NavigationPage/navigationPage";
import ErrorPage from "./pages/ErrorPage/500";
import Router from "../core/Router";
import ChatPage from "./pages/ChatPage/chatPage";
import AuthStore from "./stores/AuthStore";
import { UseFetch } from "../utils/useFetch";
import ToastService from "../utils/toastService";
import SettingsPage from "./pages/SettingsPage/settingsPage";

async function initAuth() {
  try {
    const api = UseFetch.getInstance("https://ya-praktikum.tech/api/v2");
    const user = await api.get("/auth/user");
    AuthStore.getInstance().setUser(user);
  } catch (e: any) {
    ToastService.getInstance().show(e.message, "error");
    AuthStore.getInstance().clear();
  }
}
export default class App {
  private router: Router;

  constructor(rootSelector: string) {
    this.router = new Router(rootSelector);
  }

  public async start() {
    await initAuth();
    this.router
      .use("/", NavigationPage)
      .use("/404", NotFoundPage)
      .use("/500", ErrorPage)
      .use("/sign-in", LoginPage, () => {
        if (AuthStore.getInstance().getUser()) {
          return "/messenger";
        }
        return true;
      })
      .use("/sign-up", RegisterPage, () => {
        if (AuthStore.getInstance().getUser()) {
          return "/messenger";
        }
        return true;
      })
      .use("/messenger", ChatPage, () => {
        if (!AuthStore.getInstance().getUser()) {
          return "/sign-in";
        }
        return true;
      })
      .use("/settings", SettingsPage, () => {
        if (!AuthStore.getInstance().getUser()) {
          return "/sign-in";
        }
        return true;
      })

      .start();

    this.initToastRoot();
  }
  private initToastRoot() {
    const toastRootId = "toast-root";
    if (!document.getElementById(toastRootId)) {
      const root = document.createElement("div");
      root.id = toastRootId;
      root.style.position = "fixed";
      root.style.top = "20px";
      root.style.right = "20px";
      root.style.zIndex = "9999";
      document.body.appendChild(root);
    }
  }
}
