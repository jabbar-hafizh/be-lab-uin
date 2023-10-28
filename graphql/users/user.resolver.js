import {
  compare,
  encrypt,
  getToken,
  makeSalt,
  validateEmail
} from '../../utils/common.js'
import UserModel from './user.model.js'
import UserService from './user.service.js'

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

  UserService.sendEmailVerification(user.id)

  user.token = getToken({ _id: user._id, email: user.email }, '1d')

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

async function sendEmailVerification(parent, {}, ctx) {
  UserService.sendEmailVerification(ctx.user_id)

  return 'Email verification successfully sent!'
}

async function verifyEmail(parent, { token }) {
  const user = await UserModel.findOne({
    verification_token: token
  })

  if (!user) throw new Error('Link Invalid')

  if (new Date(user.verification_time) - new Date() < 0) {
    throw new Error('Link Expired')
  }

  await UserModel.findByIdAndUpdate(
    user._id,
    {
      $set: {
        verification_token: null,
        verification_time: null,
        is_email_verified: true
      }
    },
    { new: true }
  ).lean()

  return 'Email successfully verified!'
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
  editMe,
  sendEmailVerification,
  verifyEmail
}

const resolvers = {
  Query,
  Mutation
}

export default resolvers
