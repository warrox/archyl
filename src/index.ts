import cors from 'cors'
import express from 'express'
import { UsersController } from 'src/ressources/users/users.controller'

import { db } from '../db/db'
const app = express()

app.use(express.json())


app.use(cors())

app.use('/users', UsersController)

app.get('/db',)
app.get('/', async (req: any, res: any) => {
  // res.send('🏠');
  try {
    const result = await db('SELECT * FROM users');
    res.json(result.rows)
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error')
  }

})


//app.all('*', UmknownRoutesHandler)
app.listen(3000, () => console.log('Server Listening.'))
