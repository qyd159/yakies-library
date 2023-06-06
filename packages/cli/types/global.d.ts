declare module "*.tpl" {
  const content: string;
  export default content;
}

declare module NodeJS {
  interface Global {
    wwwFileMap: any;
  }
}
