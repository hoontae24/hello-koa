import Koa from 'koa'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 4000

const app = new Koa()

app.use(ctx => {
  ctx.body = 'Hello Koa.'
})

app.listen(PORT, () => console.log(`\nServer is listening on Port ${PORT}.\n`))
