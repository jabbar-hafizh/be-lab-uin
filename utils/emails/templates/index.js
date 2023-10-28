export const REQUEST_FORGOT_PASSWORD_N1 = {
  when: 'When user request about forgot password',
  language: '',
  from: '',
  to: '',
  subject: 'Forgot Password Requested: ${first_name} ${last_name}',
  html: 'utils/emails/templates/AUTH/RequestForgotPassword/EN.html',
  requiredParams: {
    first_name: '',
    last_name: '',
    new_password: ''
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
