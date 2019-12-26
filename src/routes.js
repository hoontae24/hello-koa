import Router from 'koa-router'
import controller from 'handlers'
import book from 'handlers/book'

const router = new Router()

router.get('/', controller.index)

router.get('/book', book.list)
router.get('/book/:id', book.retrieve)
router.post('/book', book.create)
router.put('/book/:id', book.replace)
router.patch('/book/:id', book.update)
router.delete('/book/:id', book.destroy)

export default router
