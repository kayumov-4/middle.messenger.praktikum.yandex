class AuthStore {
  private static instance: AuthStore;
  private user: any = null;

  private constructor() {}

  static getInstance() {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  clear() {
    this.user = null;
  }
}

export default AuthStore;
