module.exports = {
  REQUEST_FORGOT_PASSWORD_N1: {
    when: 'When user request about forgot password',
    language: '',
    from: '',
    to: '',
    subject: 'Forgot Password Requested: ${first_name} ${last_name}',
    html: 'utils/emails/templates/AUTH/RequestForgotPassword/EN.html',
    requiredParams: {
      first_name: '',
      last_name: '',
      new_password: '',
    },
    notificationReference: 'REQUEST_FORGOT_PASSWORD_N1',
    fromId: null,
    toId: null,
    sendToPersonalEmail: true,
    sendToPlatformMailBox: true,
  },
};
