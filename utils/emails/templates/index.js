export const SEND_EMAIL_RESET_PASSWORD = {
  when: 'When user request about reset password',
  language: '',
  from: '',
  to: '',
  subject: 'Reset Password',
  html: 'utils/emails/templates/AUTH/SendEmailResetPassword/EN.html',
  requiredParams: {
    fullname: '',
    email_reset_password_url: ''
  },
  fromId: null,
  toId: null
}

export const SEND_EMAIL_VERIFICATION = {
  when: 'When user request to send email verification',
  language: '',
  from: '',
  to: '',
  subject: 'Email Verification',
  html: 'utils/emails/templates/AUTH/SendEmailVerification/EN.html',
  requiredParams: {
    fullname: '',
    email_verification_url: ''
  },
  fromId: null,
  toId: null
}
