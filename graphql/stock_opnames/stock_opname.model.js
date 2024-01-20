import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const stockOpnameSchema = new Schema(
  {
    laboratorium_type: {
      type: String,
      enum: ['Agripa', 'Tisimat', 'Tambang', 'Pengujian']
    },
    name: { type: String },
    remaining_ingredient: { type: Number }, // sisa bahan
    piece: { type: Number }, // kemasan
    unit_of_piece: { type: String }, // satuan kemasan
    spesification: { type: String },
    expired_date: { type: String },
    created_by: {
      type: Schema.ObjectId,
      ref: 'user'
    },
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

export default model('stock_opname', stockOpnameSchema)
