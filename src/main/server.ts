import { logger } from '../shared/logger'
import { app } from './config'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(`Service up and running on port ${PORT}`)
})
