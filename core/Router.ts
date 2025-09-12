import Page from "./Page";

type PageClass = new (props?: any) => Page;
type GuardFn = (params?: Record<string, string>) => boolean | string;

interface RouteConfig {
  path: string;
  page: PageClass | (() => Promise<{ default: PageClass }>);
  guard?: GuardFn;
  redirect?: string;
  lazy?: boolean;
}

export default class Router {
  private static __instance: Router;
  private routes: RouteConfig[] = [];
  private rootSelector: string = "";
  private currentPage: Page | null = null;
  private notFoundPage: PageClass | null = null;
  private onChangeCallbacks: ((path: string) => void)[] = [];

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

  public use(
    path: string,
    page: PageClass | (() => Promise<{ default: PageClass }>),
    guard?: GuardFn
  ): Router {
    this.routes.push({ path, page, guard });
    return this;
  }

  public redirect(from: string, to: string): Router {
    this.routes.push({ path: from, page: class extends Page {}, redirect: to });
    return this;
  }

  public setNotFound(pageClass: PageClass): Router {
    this.notFoundPage = pageClass;
    return this;
  }

  public start() {
    this.setPageFromPath(window.location.pathname + window.location.search);
    window.addEventListener("popstate", () => {
      this.setPageFromPath(window.location.pathname + window.location.search);
    });
  }

  public go(path: string) {
    window.history.pushState({}, "", path);
    this.setPageFromPath(path);
  }

  public replace(path: string) {
    window.history.replaceState({}, "", path);
    this.setPageFromPath(path);
  }

  public back() {
    window.history.back();
  }

  public forward() {
    window.history.forward();
  }

  public getCurrentPage(): Page | null {
    return this.currentPage;
  }

  public onChange(callback: (path: string) => void) {
    this.onChangeCallbacks.push(callback);
  }

  private async setPageFromPath(path: string) {
    const { pathname, searchParams } = this.parseUrl(path);

    let route = this.routes.find((r) => this.matchPath(pathname, r.path));
    if (!route && this.notFoundPage) {
      this.setPage(new this.notFoundPage());
      return;
    }
    if (!route) {
      console.warn("Unknown route:", path);
      return;
    }

    if (route.redirect) {
      this.replace(route.redirect);
      return;
    }

    const params = this.extractParams(pathname, route.path);

    if (route.guard) {
      const result = route.guard(params);
      if (result === false) return;
      if (typeof result === "string") {
        this.replace(result);
        return;
      }
    }

    let PageClass: PageClass;

    if (
      typeof route.page === "function" &&
      (route.page as any).prototype === undefined
    ) {
      const mod = await (route.page as () => Promise<{ default: PageClass }>)();
      PageClass = mod.default;
    } else {
      PageClass = route.page as PageClass;
    }

    const page = new PageClass({
      params,
      query: Object.fromEntries(searchParams),
    });

    this.setPage(page);
  }

  private setPage(page: Page) {
    if (this.currentPage) {
      this.currentPage.unmount();
    }
    this.currentPage = page;
    page.mount(this.rootSelector);

    this.onChangeCallbacks.forEach((cb) => cb(window.location.pathname));
  }

  private parseUrl(path: string) {
    const url = new URL(path, window.location.origin);
    return { pathname: url.pathname, searchParams: url.searchParams };
  }

  private matchPath(pathname: string, routePath: string): boolean {
    const routeParts = routePath.split("/");
    const pathParts = pathname.split("/");
    if (routeParts.length !== pathParts.length) return false;

    return routeParts.every(
      (part, i) => part.startsWith(":") || part === pathParts[i]
    );
  }

  private extractParams(
    pathname: string,
    routePath: string
  ): Record<string, string> {
    const routeParts = routePath.split("/");
    const pathParts = pathname.split("/");
    const params: Record<string, string> = {};

    routeParts.forEach((part, i) => {
      if (part.startsWith(":")) {
        params[part.slice(1)] = pathParts[i];
      }
    });

    return params;
  }
}
