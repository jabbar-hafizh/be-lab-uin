import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const testSchema = new Schema(
  {
    id_test: { type: String },
    sample_name: { type: String },
    sample_quantity: { type: Number },
    sample_type: [
      {
        type: String,
        enum: ['cair', 'padat']
      }
    ],
    samples: [
      {
        type: Schema.ObjectId,
        ref: 'sample'
      }
    ],
    test_parameters: [
      {
        type: Schema.ObjectId,
        ref: 'test_parameter'
      }
    ],
    unit_price: { type: Number },
    total_price: { type: Number },
    payment_status: {
      type: String,
      enum: ['belum_diterima', 'sudah_diterima']
    },
    sample_status: {
      type: String,
      enum: ['belum_diterima', 'sudah_diterima']
    },
    current_status: {
      type: String,
      enum: [
        'Draft',
        'Formulir_terkirim',
        'Formulir_ditolak',
        'Formulir_diterima',
        'Pembayaran_dan_sampel_diterima',
        'Diserahkan_ke_analis',
        'Diserahkan_ke_penyelia',
        'Selesai_diuji',
        'Disetujui_korbid',
        'Disetujui_Ka_PLT',
        'Dibatalkan'
      ]
    },
    histories: [
      {
        status: {
          type: String,
          enum: [
            'Draft',
            'Formulir_terkirim',
            'Formulir_ditolak',
            'Formulir_diterima',
            'Pembayaran_dan_sampel_diterima',
            'Diserahkan_ke_analis',
            'Diserahkan_ke_penyelia',
            'Selesai_diuji',
            'Disetujui_korbid',
            'Disetujui_Ka_PLT',
            'Dibatalkan'
          ]
        },
        remark: { type: String },
        updated_by: {
          type: Schema.ObjectId,
          ref: 'user'
        },
        date: { type: String }
      }
    ],
    korbid: {
      type: Schema.ObjectId,
      ref: 'user'
    },
    dekan: {
      type: Schema.ObjectId,
      ref: 'user'
    },
    buyer: {
      type: Schema.ObjectId,
      ref: 'user'
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

export default model('test', testSchema)
