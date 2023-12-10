const typeDefs = `#graphql
  extend type Query {
    getOneUser(_id: ID): User
    getAllUsers(filter: UserFilterInput): [User]
    getMe: User
  }

  extend type Mutation {
    register(user_input: UserInput): User
    createUser(user_input: UserInput): User
    updateUser(_id: ID, user_input: UserInput): User
    login(email: String!, password: String!): Login
    editMe(user_input: UserInput): User
    sendEmailVerification: String
    verifyEmail(token: String!): String
    sendEmailResetPassword(email: String!): String
    checkTokenResetPassword(token: String!): String
    resetPassword(new_password: String!, token: String!): String
  }

  input UserInput {
    fullname: String
    address: String
    institute: String
    job_title: String
    phone: String
    birth_date: String
    reset_token: String
    is_data_completed: Boolean
    is_email_verified: Boolean
    roles: [EnumUserRole]
    NIP: String
    signature_image_path: String
    email: String
    password: String
  }

  type User {
    _id: ID
    fullname: String
    address: String
    institute: String
    job_title: String
    phone: String
    birth_date: String
    reset_token: String
    is_data_completed: Boolean
    is_email_verified: Boolean
    roles: [EnumUserRole]
    NIP: String
    signature_image_path: String
    email: String
    token: String
    createdAt: String
    updatedAt: String
    is_active: Boolean
  }

  type Login {
    token: String
    user: User
  }

  input UserFilterInput {
    roles: [EnumUserRole]
    is_active: Boolean
  }

  enum EnumUserRole {
    Umum
    Super_Admin
    Super_Admin_Layanan_Pengujian
    Admin_Pemesanan
    Analis
    Penyelia
    Korbid_Pengujian
    Kepala_PLT
    Super_Admin_Stock_Opname
    Admin_Stock_Opname_Agripa
    Admin_Stock_Opname_Tisimat
    Admin_Stock_Opname_Tambang
    Admin_Stock_Opname_Pengujian
    Dekan
  }
`

export default typeDefs
