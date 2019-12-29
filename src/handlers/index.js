const index = ctx => {
  ctx.body = "Hello Koa's Home.";
};

export default { index };
export { default as auth } from "./auth";
