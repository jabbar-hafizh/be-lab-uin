import SampleModel from './sample.model.js'

// QUERY
async function getAllSamples(parent) {
  return await SampleModel.find().lean()
}

async function getOneSample(parent, { _id }) {
  return await SampleModel.findById(_id).lean()
}

// MUTATION
async function createUpdateSample(parent, { _id, sample_input }) {
  let sample

  if (!_id) {
    sample = await SampleModel.create(sample_input)
  } else {
    sample = await SampleModel.findByIdAndUpdate(
      _id,
      { $set: sample_input },
      { new: true }
    ).lean()
  }

  return sample
}

// LOADER
async function test_parameter(parent, args, context) {
  if (parent.test_parameter) {
    return await context.loaders.TestParameterLoader.load(parent.test_parameter);
  }

  return null;
}

const Query = {
  getAllSamples,
  getOneSample
}

const Mutation = {
  createUpdateSample
}

const SampleResult = {
  test_parameter
}

const resolvers = {
  Query,
  Mutation,
  SampleResult
}

export default resolvers
