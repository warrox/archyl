import { Router, Request, Response } from 'express'
import { UsersService } from './users.service'
import validator from 'validator'
import dns from 'dns/promises'
import { body, validationResult } from 'express-validator'
export const UsersController = Router()
const service = new UsersService()

// ******** Register *******
// ********          *******
UsersController.post(
  '/register',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request, res: Response) => {
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
    const { access, refresh } = await service.register(req.body)
    console.log("XXXXXXX")
    res.cookie('access-token', access.token, {
      maxAge: access.maxAge,
      httpOnly: access.httpOnly
    })
    res.cookie('refresh-token', refresh.token, {
      maxAge: refresh.maxAge,
      httpOnly: refresh.httpOnly
    })

    return res.status(200).send('Salut')
  }
)
// ******** Login *******
// ********       *******
UsersController.post(
  '/login', async (req: any, res: any) => {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).send('Mail or password empty')
    service.login(req.body)
    return res.status(400).send("Login")
  })

UsersController.get('/', (req, res) => {
  service.findAll();
})

