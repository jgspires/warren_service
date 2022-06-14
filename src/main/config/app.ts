import express from 'express'
import crypto from 'crypto'
import { getWarrenRoutes } from '../routes'

export const TOKEN_SECRET = process.env.TOKEN_SECRET || crypto.randomBytes(64).toString('hex')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(getWarrenRoutes())

export { app }
