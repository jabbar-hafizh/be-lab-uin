import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const testParameterSchema = new Schema(
  {
    test_parameter_name: { type: String },
    instrument: {
      type: Schema.ObjectId,
      ref: 'instrument'
    },
    is_measurable: { type: Boolean },
    price: { type: Number },
    test_date: { type: String },
    method: { type: String }
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

export default model('test_parameter', testParameterSchema)
