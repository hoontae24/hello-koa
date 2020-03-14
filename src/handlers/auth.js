import Joi from "joi";
import { Account } from "../models";

export default {
  localRegister: async ctx => {
    // 계정 데이터 검증
    const schema = Joi.object().keys({
      username: Joi.string()
        .alphanum()
        .min(4)
        .max(15)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6),
    });

    const result = Joi.validate(ctx.request.body, schema);

    // 스키마 검증 실패
    if (result.error) {
      ctx.status = 400;
      return;
    }

    // 아이디 / 이메일 중복 체크
    let existing = null;
    try {
      existing = await Account.findByEmailOrUsername(ctx.request.body);
    } catch (e) {
      ctx.throw(500, e);
    }

    if (existing) {
      ctx.status = 409;
      ctx.body = {
        key: existing.email === ctx.request.body.email ? "email" : "username",
      };
      return;
    }

    // 계정 생성
    let account = null;
    try {
      account = await Account.localRegister(ctx.request.body);
    } catch (e) {
      ctx.throw(500, e);
    }

    ctx.body = account.profile;
  },

  localLogin: async ctx => {
    // 데이터 검증
    const schema = Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
      ctx.status = 400; // Bad Request
      return;
    }

    const { email, password } = ctx.request.body;

    let account = null;
    try {
      // 이메일로 계정 찾기
      account = await Account.findByEmail(email);
    } catch (e) {
      ctx.throw(500, e);
    }

    if (!account || !account.validatePassword(password)) {
      // 유저가 존재하지 않거나 || 비밀번호가 일치하지 않으면
      ctx.status = 403; // Forbidden
      return;
    }

    let token = null;
    try {
      token = await account.generateToken();
    } catch (e) {
      ctx.throw(500, e);
    }

    ctx.cookies.set("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    ctx.body = account.profile;
  },

  exists: async ctx => {
    const { key, value } = ctx.params;
    let account = null;

    try {
      // key 에 따라 findByEmail 혹은 findByUsername 을 실행합니다.
      account = await (key === "email"
        ? Account.findByEmail(value)
        : Account.findByUsername(value));
    } catch (e) {
      ctx.throw(500, e);
    }

    ctx.body = {
      exists: account !== null,
    };
  },

  logout: async ctx => {
    ctx.cookies.set("access_token", null, {
      httpOnly: true,
      maxAge: 0,
    });
    ctx.status = 204;
  },

  check: ctx => {
    const { user } = ctx.request;

    if (!user) {
      ctx.status = 403;
      return;
    }

    ctx.body = user.profile;
  },
};