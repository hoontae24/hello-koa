import Book from 'models/book'

const list = async ctx => {
  try {
    const books = await Book.find().exec()

    ctx.body = { books }
  } catch (e) {
    ctx.throw(e.status, e.message)
  }
}

const retrieve = async ctx => {
  const { id } = ctx.params

  const book = await Book.findById(id).exec()
  if (!book) {
    ctx.status = 404
    ctx.body = { message: 'book not found' }
    return
  }

  ctx.body = { book }
}

const create = async ctx => {
  const { title, authors, publishedDate, price, tags } = ctx.request.body

  const book = new Book({ title, authors, publishedDate, price, tags })

  try {
    await book.save()
  } catch (e) {
    return ctx.throw(500, e)
  }

  ctx.body = { book }
}

const replace = async ctx => {
  // PUT
}

const update = async ctx => {
  // PATCH
}

const destroy = async ctx => {
  // DELETE
  const { id } = ctx.params

  try {
    await Book.findByIdAndRemove(id).exec()
  } catch (e) {
    if (e.name === 'CaseError') {
      ctx.status = 400
      return
    }
	}
	
  ctx.status = 204
}

export default {
  list,
  retrieve,
  create,
  replace,
  update,
  destroy,
}
