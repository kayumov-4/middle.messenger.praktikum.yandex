import Toast from "../src/components/ui/Toast/Toast";

class ToastService {
  private static instance: ToastService;

  private constructor() {}

  public static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  public show(
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    duration = 3000
  ) {
    const toast = new Toast({ message, type, duration });
    toast.show();
  }
}

export default ToastService;
