import jwt from "jsonwebtoken";

function generateToken(payload) {
  const jwtSecret = process.env.JWT_SECRET || "development";
  return new Promise((res, rej) => {
    jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: "7d",
      },
      (err, token) => {
        if (err) rej(err);
        res(token);
      },
    );
  });
}

function decodeToken(token) {
  const jwtSecret = process.env.JWT_SECRET || "development";
  return new Promise((res, rej) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    });
  });
}

async function tokenizer(ctx, next) {
  const token = ctx.cookies.get("access_token");
  if (!token) return next();
  try {
    const decoded = await decodeToken(token);

    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      const { id, profile } = decoded;
      const freshToken = await generateToken({ id, profile });
      ctx.cookies.set("access_token", freshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    ctx.request.user = decoded;
  } catch (e) {
    ctx.request.user = null;
  }
  return next();
}

export { generateToken, decodeToken, tokenizer };
