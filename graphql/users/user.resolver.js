import UserModel from './user.model.js'

import {
  compare,
  encrypt,
  getToken,
  makeSalt,
  validateEmail
} from '../../utils/common.js'

// QUERY
async function getAllUsers(parent, {}, ctx) {
  return await UserModel.find().lean()
}

async function getOneUser(parent, { _id }) {
  return await UserModel.findById(_id).lean()
}

async function getMe(parent, {}, ctx) {
  return await UserModel.findById(ctx.user_id).lean()
}

// MUTATION
async function register(parent, { user_input }) {
  user_input.email = user_input.email.toLowerCase()

  const is_valid_email = validateEmail(user_input.email)
  if (!is_valid_email) throw new Error('Email Invalid')

  const existing_user = await UserModel.findOne({ email: user_input.email })
  if (existing_user) throw new Error('Email Exists')

  const salt = makeSalt()
  const encrypted_password = encrypt(user_input.password, salt)

  const user = await UserModel.create({
    ...user_input,
    password: encrypted_password,
    salt
  })

  return user
}

async function updateUser(parent, { _id, user_input }) {
  return await UserModel.findByIdAndUpdate(
    _id,
    { $set: user_input },
    { new: true }
  ).lean()
}

async function login(parent, { email, password }) {
  const user = await UserModel.findOne({ email }).select('_id email password salt')
  if (!user) throw new Error('User Not Found')

  const matched = compare(password, user.password, user.salt)
  if (!matched) throw new Error('Password Not Match')

  const token = getToken({ _id: user._id, email: user.email }, '1d')

  return {
    token,
    user
  }
}

async function editMe(parent, { user_input }, ctx) {
  return await UserModel.findByIdAndUpdate(
    ctx.user_id,
    { $set: user_input },
    { new: true }
  ).lean()
}

const Query = {
  getAllUsers,
  getOneUser,
  getMe
}

const Mutation = {
  register,
  updateUser,
  login,
  editMe
}

const resolvers = {
  Query,
  Mutation
}

export default resolvers
