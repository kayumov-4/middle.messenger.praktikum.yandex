/// <reference types="vite/client" />

declare module "*.hbs" {
  const content: (context?: any) => string;
  export default content;
}
