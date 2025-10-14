import { Router } from 'express'
import { db } from '../../../db/db'


export class UsersService {
  async findAll() {
    const result = await db('SELECT * FROM users');
    console.log(result)
  }
}
