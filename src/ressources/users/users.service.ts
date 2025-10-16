import { Router } from 'express'
import { db } from '../../../db/db'
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv"

dotenv.config({ path: '.env' });

interface tokenObj {
  token: string,

  maxAge: number,
  httpOnly: boolean
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
  async register(body: any): Promise<Mytoken> {
    const user = body;
    // add to db

    const token = jwt.sign({ email: user.email }, 'your_secret', { expiresIn: '1h' });// change your secret
    let tokenLst =
    {
      token,
      maxAge: 3600,
      httpOnly: true
    }
    return tokenLst;
  }
}
