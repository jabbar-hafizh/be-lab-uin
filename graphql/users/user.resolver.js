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

async function createUser(parent, { user_input }, ctx) {
  const user_logged_in = await UserModel.findOne({
    _id: ctx.user_id,
    roles: { $in: ['Super_Admin'] }
  }).lean()
  if (!user_logged_in) throw new Error('UnAuthorized')

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
    salt,
    is_email_verified: true
  })

  return user
}

async function updateUser(parent, { _id, user_input }) {
  const user = await UserModel.findById(_id).lean()

  if (user_input.password) {
    user_input.password = encrypt(user_input.password, user.salt)
  }

  return await UserModel.findByIdAndUpdate(
    _id,
    { $set: user_input },
    { new: true }
  ).lean()
}

async function login(parent, { email, password }) {
  const user = await UserModel.findOne({ email }).lean()
  if (!user) throw new Error('Credential Not Valid')

  const matched = compare(password, user.password, user.salt)
  if (!matched) throw new Error('Credential Not Valid')

  const token = getToken({ _id: user._id, email: user.email }, '7d')

  return {
    token,
    user
  }
}

async function editMe(parent, { user_input }, ctx) {
  const user = await UserModel.findById(ctx.user_id).lean()

  if (user_input.password) {
    user_input.password = encrypt(user_input.password, user.salt)
  }

  if (user_input.email && user_input.email.toLowerCase() !== user.email) {
    user_input.is_email_verified = false
  }

  return await UserModel.findByIdAndUpdate(
    ctx.user_id,
    { $set: user_input },
    { new: true }
  ).lean()
}

async function sendEmailVerification(parent, {}, ctx) {
  await UserService.sendEmailVerification(ctx.user_id)

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

async function sendEmailResetPassword(parent, { email }) {
  await UserService.sendEmailResetPassword(email)

  return 'Email reset password successfully sent!'
}

async function checkTokenResetPassword(parent, { token }) {
  const user = await UserModel.findOne({
    reset_password_token: token
  })

  if (!user) throw new Error('Link Invalid')

  if (new Date(user.reset_password_time) - new Date() < 0) {
    throw new Error('Link Expired')
  }

  return 'Token Valid!'
}

async function resetPassword(parent, { new_password, token }) {
  const user = await UserModel.findOne({
    reset_password_token: token
  })

  if (!user) throw new Error('Link Invalid')

  if (new Date(user.reset_password_time) - new Date() < 0) {
    throw new Error('Link Expired')
  }

  const salt = makeSalt()
  const encrypted_password = encrypt(new_password, salt)

  await UserModel.updateOne(
    {
      _id: user._id
    },
    {
      $set: {
        salt,
        password: encrypted_password
      }
    },
    { new: true }
  )

  return 'Password successfully updated!'
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
  verifyEmail,
  sendEmailResetPassword,
  checkTokenResetPassword,
  resetPassword,
  createUser
}

const resolvers = {
  Query,
  Mutation
}

export default resolvers
