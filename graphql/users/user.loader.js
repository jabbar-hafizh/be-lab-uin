import DataLoader from 'dataloader'
import UserModel from './user.model.js'

const batchUsers = async userIds => {
  const users = await UserModel.find({ _id: { $in: userIds } }).lean()

  const dataMap = new Map()
  users.forEach(user => {
    dataMap.set(user._id.toString(), user)
  })

  return userIds.map(id => dataMap.get(id.toString()))
}

export default function UserLoader() {
  return new DataLoader(batchUsers)
}
