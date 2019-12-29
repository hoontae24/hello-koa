import Router from "koa-router";
import api, { auth } from "handlers";

const router = new Router();

router.get("/", api.index);

router.post("/auth/register/local", auth.localRegister);
router.post("/auth/login/local", auth.localLogin);
router.get("/auth/exists/:key(email|username)/:value", auth.exists);
router.post("/auth/logout", auth.logout);
router.get("/auth/check", auth.check);

export default new Router().use("/api", router.routes());
