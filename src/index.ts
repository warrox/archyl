import cors from 'cors'
import express from 'express'
import { UsersController } from './ressources/users/users.controller'
import { UsersService } from './ressources/users/users.service'
import { db } from '../db/db'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
const app = express()
const service = new UsersService();
app.use(express.json())


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors())

app.use('/users', UsersController)

app.get('/', async (req: any, res: any) => {
  res.send('🏠');
  //res.send(service.findAll());
})

//app.all('*', UmknownRoutesHandler)
app.listen(3000, () => console.log('Server Listening.'))
