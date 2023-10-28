import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const instrumentSchema = new Schema(
  {
    name: { type: String }
  },
  {
    timestamps: true,
    toJSON: {
      getters: true
    },
    toObject: {
      getters: true
    }
  }
)

export default model('instrument', instrumentSchema)
