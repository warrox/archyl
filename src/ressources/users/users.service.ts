import { db } from "./../../../db/db.ts";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config({ path: ".env" });

interface tokenObj {
  token: string;
  maxAge: number;
  httpOnly: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  refreshtoken: string;
  created_at: number;
}
type Mytoken = tokenObj;
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_ADRR,
    pass: process.env.MAIL_MDP,
  },
});
export class UsersService {
  async findAll() {
    const result = await db("SELECT * FROM users");
    console.log(result);
  }
  // ** register part **
  async register(body: any): Promise<{ access: Mytoken; refresh: Mytoken }> {
    const user = body;
    // add to db
    const acessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" },
    ); // change your secret
    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" },
    );
    const access: Mytoken = {
      token: acessToken,
      maxAge: 3600,
      httpOnly: true,
    };
    const refresh: Mytoken = {
      token: refreshToken,
      maxAge: 9000000,
      httpOnly: true,
    };

    try {
      const hasedPassword = await bcrypt.hash(user.password, 10);
      await db(
        "INSERT INTO users (username,email, password, refreshToken) VALUES ($1, $2, $3, $4);",
        [user.username, user.email, hasedPassword, refreshToken],
      );
    } catch (err) {
      console.log(err);
    }

    console.log(user.email);
    console.log(user.password);
    return { access, refresh };
  }

  async login(body: any): Promise<{ access: Mytoken }> {
    const { email, password } = body;

    const result = await db<User>("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const isValidPass = await bcrypt.compare(password, result[0].password);
    if (!isValidPass) throw new Error("Password incorrect");
    console.log("XXX : ", result);
    const user = result[0];
    if (!user) throw new Error("User not found");
    console.log("YYYYY : ", user.refreshtoken);
    let refreshTokenValid = true;
    try {
      jwt.verify(user.refreshtoken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: number;
        email: string;
      };
    } catch {
      refreshTokenValid = false;
    }
    const acessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" },
    );
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");
    const access: Mytoken = {
      token: acessToken,
      maxAge: 3600,
      httpOnly: true,
    };
    return { access };
  }
  // *********** Telegram function ***********
  async addInVault(body: any) { }
}
