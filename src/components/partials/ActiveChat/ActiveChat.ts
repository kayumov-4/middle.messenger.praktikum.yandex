import Block from "../../../../core/Block";
import template from "./ActiveChat.hbs?raw";
import "./ActiveChat.scss";

interface ActiveChatProps {
  messages: { user: { first_name: string }; content: string; time: string }[];
}

export class ActiveChat extends Block<ActiveChatProps> {
  constructor(props: ActiveChatProps) {
    super("div", props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
