import UserModel from '../graphql/users/user.model.js'
import { getUserId } from '../utils/common.js'

async function requireAuth(resolver, parent, args, ctx) {
  const Authorization = ctx.req.get('Authorization')
  if (!Authorization) {
    throw new Error('Authorization header is missing')
  }

  const token = Authorization.replace('Bearer ', '').replace(/"/g, '')
  const user_id = getUserId(token)

  const user = await UserModel.findOne({ _id: user_id }).select('_id').lean()
  if (!user) {
    throw new Error('UnAuthenticated')
  }
  ctx.user_id = user._id

  return resolver() //call the next resolver
}

const authMiddleware = {
  Query: {
    getAllUsers: requireAuth,
    getOneUser: requireAuth,
    getMe: requireAuth
  },
  Mutation: {
    updateUser: requireAuth,
    editMe: requireAuth
  }
}

export default authMiddleware
