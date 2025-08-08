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

router.group(() => {
  router.resource('posts', PostsController).only(['index', 'show'])
})

/* Admin routes */
const AdminPostsController = () => import('#controllers/Admin/posts_controller')
const AdminCategoriesController = () => import('#controllers/Admin/categories_controller')
router
  .group(() => {
    router.resource('posts', AdminPostsController).apiOnly()
    router.resource('categories', AdminCategoriesController).apiOnly()
  })
  .use([middleware.admin()])
  .prefix('admin')
  .as('admin')
