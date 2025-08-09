/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PostsController = () => import('#controllers/posts_controller')
const AttachmentsController = () => import('#controllers/attachments_controller')
/* Health check route */
router.get('/', async ({ response }) => {
  return response.ok({ status: 'ok' })
})
/* Public routes */
router.group(() => {
  router.resource('posts', PostsController).only(['index', 'show'])
})
/* User routes */
router
  .group(() => {
    router.resource('attachments', AttachmentsController).only(['index', 'store', 'destroy'])
  })
  .use([middleware.auth()])

/* Admin routes */
const AdminPostsController = () => import('#controllers/Admin/posts_controller')
const AdminCategoriesController = () => import('#controllers/Admin/categories_controller')
const AdminPostAttrsController = () => import('#controllers/Admin/post_attrs_controller')
const AdminAttachmentsController = () => import('#controllers/Admin/attachments_controller')
router
  .group(() => {
    router.resource('posts', AdminPostsController).apiOnly()
    router.resource('categories', AdminCategoriesController).apiOnly()
    router.resource('posts.attrs', AdminPostAttrsController).only(['store', 'destroy'])
    router.resource('attachments', AdminAttachmentsController).only(['index', 'destroy'])
  })
  .use([middleware.admin()])
  .prefix('admin')
  .as('admin')
