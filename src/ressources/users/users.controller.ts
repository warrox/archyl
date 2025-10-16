import { Router } from 'express'
import { UsersService } from './users.service'
import validator, { isLength } from 'validator'
import dns from 'dns/promises'
import { body, validationResult } from 'express-validator'
export const UsersController = Router()
const service = new UsersService()
UsersController.post('/login', (req, res) => {
  console.log(req.body.email)
  console.log(req.body.password)
  return res.status(200).json("Salut les pd")
})


UsersController.post(
  '/register',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email } = req.body

    if (!validator.isEmail(email)) {
      return res.status(400).send('Invalid email format')
    }

    const domain = email.split('@')[1]
    try {
      const records = await dns.resolveMx(domain)
      if (!records || records.length === 0) {
        return res.status(400).send('Mail provider not recognized')
      }
    } catch {
      return res.status(400).send('Mail provider not recognized')
    }

    // Register user
    const regResult = await service.register(req.body)
    res.cookie('authcookie', regResult)
    res.send('User registered successfully')
  }
)


UsersController.get('/', (req, res) => {
  service.findAll();
})

