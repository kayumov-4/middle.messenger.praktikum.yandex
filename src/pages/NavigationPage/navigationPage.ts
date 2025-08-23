import Block from "../../../core/Block";
import template from "./navigationPage.hbs";
import Page from "../../../core/Page";
import Link from "../../components/ui/Link/Link";

export default class NavigationPage extends Page {
  private pageComponents: Record<string, Block> = {
    loginLink: new Link({
      label: "Вернуться к входу в систему",
      href: "/login",
      className: "navigation-link",
      onNavigate: () => {},
    }),
    registerLink: new Link({
      label: "Вернуться к регистрации",
      href: "/register",
      className: "navigation-link",
      onNavigate: () => {},
    }),
    messengerLink: new Link({
      label: "Вернуться в мессенджер",
      href: "/messenger",
      className: "navigation-link",
      onNavigate: () => {},
    }),
    notFoundLink: new Link({
      label: "Открыть страницу 404",
      href: "/404",
      className: "navigation-link",
      onNavigate: () => {},
    }),
    errorLink: new Link({
      label: "Открыть страницу 500",
      href: "/500",
      className: "navigation-link",
      onNavigate: () => {},
    }),
  };

  constructor() {
    super(template.toString(), { title: "" });
    super.initComponents(this.pageComponents);
  }
}
