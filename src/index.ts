import cors from 'cors'
import express from 'express'
import { UsersController } from 'src/ressources/users/users.controller'
const app = express()

app.use(express.json())


app.use(cors())

app.use('/users', UsersController)


app.get('/', (req, res) => res.send('🏠'))


//app.all('*', UmknownRoutesHandler)
app.listen(3000, () => console.log('Server Listening.'))
