import LoginPage from "./pages/LoginPage/loginPage";
import RegisterPage from "./pages/RegisterPage/registerPage";
import NotFoundPage from "./pages/NotFoundPage/404";
import NavigationPage from "./pages/NavigationPage/navigationPage";
import ErrorPage from "./pages/ErrorPage/500";
import Router from "../core/Router";
import ChatPage from "./pages/ChatPage/chatPage";

export default class App {
  private router: Router;

  constructor(rootSelector: string) {
    this.router = new Router(rootSelector);
  }

  public start() {
    this.router
      .use("/", NavigationPage)
      .use("/404", NotFoundPage)
      .use("/500", ErrorPage)
      .use("/login", LoginPage)
      .use("/register", RegisterPage)
      .use("/messenger", ChatPage)
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
