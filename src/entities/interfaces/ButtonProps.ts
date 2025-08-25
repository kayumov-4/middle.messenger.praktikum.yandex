export interface ButtonProps {
  label: string;
  type?: "button" | "submit" | "reset" | "default";
  className?: string;
  onClick?: (e: MouseEvent) => void;
  html?: string;
  [key: string]: unknown;
}
