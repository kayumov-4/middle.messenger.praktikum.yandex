import Block from "../../../core/Block";
import template from "./404.hbs";
import Page from "../../../core/Page";
import Link from "../../components/ui/Link/Link";

export default class NotFoundPage extends Page {
  private pageComponents: Record<string, Block>;

  constructor() {
    super(template.toString(), { template: template.toString() });
    this.pageComponents = {
      backToHomeLink: new Link({
        label: "Вернуться на главную",
        href: "/",
        className: "404-link",
        onNavigate: () => {},
      }),
    };
    super.initComponents(this.pageComponents);
  }
}
