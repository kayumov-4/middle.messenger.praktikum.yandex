import Page from "../../../core/Page";
import Router from "../../../core/Router";
import AuthStore from "../../stores/AuthStore";
import ProfileSidebar from "../../components/partials/ProfileSidebar/profileSidebar";
import "./settingsPage.scss";

export default class SettingsPage extends Page {
  private profileSidebar: ProfileSidebar | null = null;

  constructor(props: any = {}) {
    const user = AuthStore.getInstance().getUser();
    if (!user) {
      Router.getInstance().go("/sign-in");
    }

    super(
      "<div class='settings-page' data-slot='profileSidebar'></div>",
      props
    );

    this.profileSidebar = new ProfileSidebar({
      user: {
        name: user?.first_name || "",
        email: user?.email || "",
        login: user?.login || "",
        firstName: user?.first_name || "",
        lastName: user?.second_name || "",
        chatName: user?.display_name || user?.login || "",
        phone: user?.phone || "",
        profileType: "initial",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      children: {},
    });

    this.initComponents({
      profileSidebar: this.profileSidebar,
    });
  }

  render() {
    return this.compile(
      "<div class='settings-page' data-slot='profileSidebar'></div>",
      this.props
    );
  }
}
