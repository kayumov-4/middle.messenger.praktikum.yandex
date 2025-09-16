import Block from "../../../../core/Block";
import template from "./ChatList.hbs?raw";
import "./ChatList.scss";

interface ChatsListProps {
  conversations: any[];
  activeChatId?: number | null;
  template: string;
}

export class ChatsList extends Block<ChatsListProps> {
  constructor(props: Omit<ChatsListProps, "template">) {
    super("div", { ...props, template });
  }

  render() {
    return this.compile(this.props.template, this.props);
  }
}
