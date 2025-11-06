import cors from 'cors'
import express from 'express'
import { UsersController } from './ressources/users/users.controller.ts'
import { UsersService } from './ressources/users/users.service.ts'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import loggerRouter from './middlewares/middleware.routesHandler.ts'
import { toNodeHandler } from "better-auth/node"
import { auth } from "./ressources/auth/auth.ts"


const app = express()
const service = new UsersService();
app.use(express.json())

app.use(loggerRouter);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors())

app.use('/users', UsersController)
app.use("/api", toNodeHandler(auth));
app.get('/', async (req: any, res: any) => {
  //res.send('🏠');
  res.send(service.findAll());
})

//app.all('*', UmknownRoutesHandler)
app.listen(3000, () => console.log('Server Listening.'))
