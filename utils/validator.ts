export function validateLogin(value: string): string | null {
  const regex = /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/;
  if (!regex.test(value)) {
    return "Логин должен быть 3–20 символов, латиница, можно цифры, '-' и '_', но не только цифры.";
  }
  return null;
}

export function validatePassword(value: string): string | null {
  const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/;
  if (!regex.test(value)) {
    return "Пароль должен быть 8–40 символов, с заглавной буквой и цифрой.";
  }
  return null;
}

const validations: Record<string, RegExp> = {
  first_name: /^[A-ZА-Я][a-zа-я-]*$/,
  second_name: /^[A-ZА-Я][a-zа-я-]*$/,
  login: /^(?!\d+$)[A-Za-z0-9_-]{3,20}$/,
  email: /^[A-Za-z0-9._-]+@[A-Za-z]+\.[A-Za-z]+$/,
  password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
  phone: /^\+?\d{10,15}$/,
  message: /^(?!\s*$).+$/,
};

const messages: Record<string, string> = {
  first_name: "Имя написано неправильно",
  second_name: "Фамилия написано неправильно",
  login:
    "Логин должно содержать 3–20 символов, латиница, можно цифры, дефис, подчёркивание, но не только цифры.",
  email: "Неверный email",
  password:
    "Пароль должно содержать 8–40 символов, минимум одна заглавная буква и цифра.",
  phone: "Телефон написано неправильно",
  message: "Сообщение не может быть пустым!",
  display_name: "Имя в чате написано неправильно",
};

export function inputValidator(inputName: string, inputValue: string) {
  const validation = validations[inputName];
  if (!validation) {
    return { isValid: true, message: "" };
  }

  const isValid = validation.test(inputValue);
  return { isValid, message: messages[inputName] || "" };
}
