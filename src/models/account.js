import mongoose, { Schema } from "mongoose";
import crypto from "crypto";
import { generateToken } from "../lib/token";

console.log(process.env.HASH_SECRET_KEY)
const hash = password => {
  const secret = process.env.HASH_SECRET_KEY || "development";
  return crypto
    .createHmac("sha256", secret)
    .update(password)
    .digest("hex");
};

const Account = new Schema(
  {
    profile: {
      username: String,
      thumbnail: {
        type: String,
        default: "/static/images/default_thumbnail.png",
      },
    },
    email: { type: String },
    social: {
      facebook: { id: String, accessToken: String },
      google: { id: String, accessToken: String },
    },
    password: String,
    thoughtCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

Account.statics.findByUsername = function(username) {
  return this.findOne({ "profile.username": username }).exec();
};

Account.statics.findByEmail = function(email) {
  return this.findOne({ email }).exec();
};

Account.statics.findByEmailOrUsername = function({ username, email }) {
  return this.findOne({
    // $or 연산자를 통해 둘중에 하나를 만족하는 데이터를 찾습니다
    $or: [{ "profile.username": username }, { email }],
  }).exec();
};

Account.statics.localRegister = function({ username, email, password }) {
  const account = new this({
    profile: { username },
    email,
    password: hash(password),
  });

  return account.save();
};

Account.methods.validatePassword = function(password) {
  const hashed = hash(password);
  return this.password === hashed;
};

Account.methods.generateToken = function() {
  const payload = {
    id: this.id,
    profile: this.profile,
  };

  return generateToken(payload, "account");
};

export default mongoose.model("Account", Account);
