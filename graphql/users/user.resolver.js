import UserModel from './user.model.js'

// QUERY
async function getAllUsers(parent) {
  return await UserModel.find().lean()
}

async function getOneUser(parent, { _id }) {
  return await UserModel.findById(_id).lean()
}

// MUTATION
async function register(parent, { user_input }) {
  return await UserModel.create(user_input)
}

async function updateUser(parent, { _id, user_input }) {
  return await UserModel.findByIdAndUpdate(_id, { $set: user_input }, { new: true }).lean()
}

async function login(parent, { email, password }) {
  const user = await UserModel.findOne({ email })
  return {
    token: '',
    user
  }
}

const Query = {
  getAllUsers,
  getOneUser
}
const Mutation = {
  register,
  updateUser,
  login
}

const resolvers = {
  Query,
  Mutation
}

export default resolvers
