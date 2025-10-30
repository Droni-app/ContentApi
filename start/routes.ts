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
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

const PostsController = () => import('#controllers/posts_controller')
const AttachmentsController = () => import('#controllers/attachments_controller')
const UsersController = () => import('#controllers/users_controller')
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
    router.get('users/me', [UsersController, 'me'])
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
  .use([middleware.auth(), middleware.admin()])
  .prefix('admin')
  .as('admin')

/* Swagger */
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar("/swagger"); to use Scalar instead. If you want, you can pass proxy url as second argument here.
  // return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
})
