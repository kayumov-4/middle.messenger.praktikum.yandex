export interface UserProfile {
  name: string;
  email: string;
  login: string;
  firstName: string;
  lastName: string;
  chatName: string;
  phone: string;
  profileType: "initial" | "edit" | "changePassword";
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ProfileData {
  user: UserProfile;
}
