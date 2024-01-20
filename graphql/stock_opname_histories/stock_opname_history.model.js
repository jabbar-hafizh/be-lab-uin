import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const stockOpnameHistorySchema = new Schema(
  {
    stock_opname: {
      type: Schema.ObjectId,
      ref: 'stock_opname'
    },
    user: {
      type: String
    },
    date: {
      type: String
    },
    number: {
      type: Number
    }
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

export default model('stock_opname_history', stockOpnameHistorySchema)
