import Page from "./Page";

type PageClass = new (props?: any) => Page;

export default class Router {
  private static __instance: Router;
  private routes: Record<string, PageClass> = {};
  private rootSelector: string = "";
  private currentPage: Page | null = null;

  constructor(rootSelector: string) {
    if (Router.__instance) {
      return Router.__instance;
    }
    this.rootSelector = rootSelector;
    Router.__instance = this;
  }
  public static getInstance(rootSelector: string = "#app"): Router {
    if (!Router.__instance) {
      Router.__instance = new Router(rootSelector);
    }
    return Router.__instance;
  }
  public go(path: string) {
    window.history.pushState({}, "", path);
    this.setPageFromPath(path);
  }
  public use(path: string, pageClass: PageClass): Router {
    this.routes[path] = pageClass;
    return this;
  }

  public start() {
    this.setPageFromPath(window.location.pathname);

    window.addEventListener("popstate", () => {
      this.setPageFromPath(window.location.pathname);
    });
  }

  private setPageFromPath(path: string) {
    const PageClass = this.routes[path];

    if (!PageClass) {
      console.warn("Unknown route:", path);
      return;
    }

    const page = new PageClass();
    this.setPage(page);
  }

  private setPage(page: Page) {
    this.currentPage = page;
    page.mount(this.rootSelector);
  }

  public getCurrentPage(): Page | null {
    return this.currentPage;
  }
}
