import express from 'express'

const router = express.Router()

router.use((req, res, next) => {
  console.log('Time', Date.now())
  if (req.originalUrl === '/users/login' || req.originalUrl === '/users/register') {
    next();
  }
  // do acess token 

  next();
})

export default router;


