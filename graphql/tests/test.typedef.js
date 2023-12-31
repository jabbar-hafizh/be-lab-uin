const typeDefs = `#graphql
  extend type Query {
    getOneTest(_id: ID): Test
    getAllTests(filter: TestFilterInput): [Test]
  }

  extend type Mutation {
    createUpdateTest(_id: ID, test_input: TestInput): Test
    deleteTest(_id: ID!): Test
  }

  input TestInput {
    id_test: String
    sample_name: String
    sample_quantity: Int
    sample_type: EnumTestSampleType
    samples: [SampleInput]
    test_parameters: [TestParameterInput]
    payment_status: EnumTestPaymentStatus
    sample_status: EnumTestSampleStatus
    current_status: EnumTestCurrentStatus
    korbid: ID
    dekan: ID
    buyer: ID
    LHU_document_url: String
    ka_plt: ID
    payment_file: String
    no_letter: String
    remark: String
  }

  type Test {
    _id: ID
    id_test: String
    sample_name: String
    sample_quantity: Int
    sample_type: EnumTestSampleType
    samples: [Sample]
    test_parameters: [TestParameter]
    unit_price: Int
    total_price: Int
    payment_status: EnumTestPaymentStatus
    sample_status: EnumTestSampleStatus
    current_status: EnumTestCurrentStatus
    histories: [TestHistory]
    korbid: User
    dekan: User
    buyer: User
    LHU_document_url: String
    ka_plt: User
    payment_file: String
    no_letter: String
    createdAt: String
    updatedAt: String
  }

  type TestHistory {
    status: EnumTestCurrentStatus
    remark: String
    updated_by: User
    date: String
  }

  input TestFilterInput {
    current_statuses: [EnumTestCurrentStatus]
  }

  enum EnumTestSampleType {
    cair
    padat
  }

  enum EnumTestPaymentStatus {
    belum_diterima
    sudah_diterima
  }

  enum EnumTestSampleStatus {
    belum_diterima
    sudah_diterima
  }

  enum EnumTestCurrentStatus {
    Draft
    Formulir_terkirim
    Formulir_ditolak
    Formulir_diterima
    Pembayaran_dan_sampel_diterima
    Diserahkan_ke_analis
    Diserahkan_ke_penyelia
    Selesai_diuji
    Disetujui_korbid
    Disetujui_Ka_PLT
    Dibatalkan
  }
`

export default typeDefs
