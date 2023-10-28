import InstrumentModel from './instrument.model.js'

// QUERY
async function getAllInstruments(parent) {
  return await InstrumentModel.find().lean()
}

async function getOneInstrument(parent, { _id }) {
  return await InstrumentModel.findById(_id).lean()
}

// MUTATION
async function createUpdateInstrument(parent, { _id, instrument_input }) {
  let instrument

  if (!_id) {
    instrument = await InstrumentModel.create(instrument_input)
  } else {
    instrument = await InstrumentModel.findByIdAndUpdate(
      _id,
      { $set: instrument_input },
      { new: true }
    ).lean()
  }

  return instrument
}

const Query = {
  getAllInstruments,
  getOneInstrument
}

const Mutation = {
  createUpdateInstrument
}

const resolvers = {
  Query,
  Mutation
}

export default resolvers
