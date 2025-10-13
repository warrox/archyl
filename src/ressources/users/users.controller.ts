import { Router } from 'express'

export const UsersController = Router()

UsersController.post('/login', (req, res) => {
  console.log(req.body.email)
  console.log(req.body.password)
  return res.status(200).json("Salut les pd")
})


