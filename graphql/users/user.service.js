import crypto from 'crypto'

import UserModel from './user.model.js'

import { sendEmail } from '../../utils/emails/index.js'
import {
  SEND_EMAIL_RESET_PASSWORD,
  SEND_EMAIL_VERIFICATION
} from '../../utils/emails/templates/index.js'

async function sendEmailVerification(user_id) {
  const user = await UserModel.findById(user_id)
  if (!user) throw new Error('User Not Found!')

  const verification_time = new Date()
  verification_time.setMinutes(verification_time.getMinutes() + 5)
  const verification_token = crypto.randomUUID()

  await UserModel.updateOne(
    { _id: user.id },
    {
      $set: {
        verification_time,
        verification_token
      }
    }
  )

  const mailOptions = Object.assign({}, SEND_EMAIL_VERIFICATION)

  mailOptions.to = user.email
  mailOptions.toId = user._id
  mailOptions.requiredParams = {
    fullname: user.fullname,
    email_verification_url: `${process.env.FE_URL}/verify-email?token=${verification_token}`
  }

  sendEmail(mailOptions, async function (err) {
    if (err) {
      console.log(err)
      throw new Error(err)
    }
  })

  return 'Email verification successfully sent!'
}

async function sendEmailResetPassword(email) {
  const user = await UserModel.findOne({ email })
  if (!user) throw new Error('User Not Found!')

  const reset_password_time = new Date()
  reset_password_time.setMinutes(reset_password_time.getMinutes() + 5)
  const reset_password_token = crypto.randomUUID()

  await UserModel.updateOne(
    { _id: user.id },
    {
      $set: {
        reset_password_time,
        reset_password_token
      }
    }
  )

  const mailOptions = Object.assign({}, SEND_EMAIL_RESET_PASSWORD)

  mailOptions.to = user.email
  mailOptions.toId = user._id
  mailOptions.requiredParams = {
    fullname: user.fullname,
    email_reset_password_url: `${process.env.FE_URL}/reset-password?token=${reset_password_token}`
  }

  sendEmail(mailOptions, async function (err) {
    if (err) {
      console.log(err)
      throw new Error(err)
    }
  })

  return 'Email reset password successfully sent!'
}

const UserService = {
  sendEmailVerification,
  sendEmailResetPassword
}

export default UserService
