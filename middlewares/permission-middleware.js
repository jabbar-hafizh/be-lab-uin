import UserModel from '../graphql/users/user.model.js'

async function dissalowedUserUmum(resolver, parent, args, ctx) {
  const user = await UserModel.findById(ctx.user_id)
  if (!user) throw new Error('User Not Found!')

  if (user.roles.includes('Umum')) throw new Error('Forbidden')

  return resolver()
}

const permissionMiddleware = {
  Query: {
    getOneStockOpname: dissalowedUserUmum,
    getAllStockOpnames: dissalowedUserUmum,
    getOneStockOpnameHistory: dissalowedUserUmum,
    getAllStockOpnameHistories: dissalowedUserUmum
  },
  Mutation: {
    createStockOpname: dissalowedUserUmum,
    updateStockOpname: dissalowedUserUmum,
    deleteStockOpname: dissalowedUserUmum,
    createStockOpnameHistory: dissalowedUserUmum,
    updateStockOpnameHistory: dissalowedUserUmum,
    deleteStockOpnameHistory: dissalowedUserUmum
  }
}

export default permissionMiddleware
