import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const sampleSchema = new Schema(
  {
    customer_label: { type: String },
    lab_label: { type: String },
    results: [
      {
        test_parameter: {
          type: Schema.ObjectId,
          ref: 'test_parameter'
        },
        unit_of_measurement: { type: String },
        result: { type: String }
      }
    ]
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

export default model('sample', sampleSchema)
