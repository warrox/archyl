import { Router } from 'express'
import { db } from '../../../db/db'
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv"
import bcrypt from "bcrypt"
dotenv.config({ path: '.env' });

interface tokenObj {
  token: string,
  maxAge: number,
  httpOnly: boolean
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: number
}
type Mytoken = tokenObj
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_ADRR,
    pass: process.env.MAIL_MDP
  }
})
export class UsersService {
  async findAll() {
    const result = await db('SELECT * FROM users');
    console.log(result)
  }
  // ** register part **
  async register(body: any): Promise<{ access: Mytoken; refresh: Mytoken }> {
    const user = body;
    // add to db
    try {
      const hasedPassword = await bcrypt.hash(user.password, 10)
      await db("INSERT INTO users (username,email, password) VALUES ($1, $2, $3);", [user.username, user.email, hasedPassword]);
    }
    catch (err) {
      console.log(err)
    }

    console.log(user.email)
    console.log(user.password)
    const acessToken = jwt.sign({ email: user.email }, 'your_secret', { expiresIn: '15m' });// change your secret
    const refreshToken = jwt.sign({ email: user.email }, 'your_secret', { expiresIn: '7d' })
    const access: Mytoken =
    {
      token: acessToken,
      maxAge: 3600,
      httpOnly: true
    }
    const refresh: Mytoken = {
      token: refreshToken,
      maxAge: 9000000,
      httpOnly: true
    }
    return { access, refresh };
  }

  async login(body: any) {
    const { email, password } = body;

    try {
      const result = await db<User>("SELECT * FROM users WHERE email = $1", [email]);
      console.log("XXX : ", result);
      const user = result[0];
      if (!user) throw new Error("User not found");
      console.log('YYYYY : ', user.password)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid password");

      const token = jwt.sign({ email: user.email }, 'your_secret', { expiresIn: '1h' });
      return {
        token,
        maxAge: 3600,
        httpOnly: true
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

