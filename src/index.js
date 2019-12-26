// Import package
import Koa from 'koa'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'

// Import local modules
import router from 'routes'

dotenv.config()

// Connect Database
mongoose.Promise = global.Promise
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('Successfully connected to mongoDB'))
  .catch(e => console.error(e))

// Initialize configuration variables
const PORT = process.env.PORT || 4000

// Declare App variables
const app = new Koa()

// Apply App Middlewares
app.use(bodyParser())

// Routes Middlewares
app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, () => console.log(`\nServer is listening on Port ${PORT}.`))
