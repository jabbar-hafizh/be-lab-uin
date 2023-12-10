import UserModel from '../users/user.model.js'
import StockOpnameModel from './stock_opnames.model.js'

// QUERY
async function getAllStockOpnames(parent, { filter }, ctx) {
  const query = {
    $and: [{ _id: { $ne: null } }]
  }
  const aggregateQuery = [{ $match: query }]

  if (filter) {
    if (filter.laboratorium_type) {
      query.$and.push({ laboratorium_type: filter.laboratorium_type })
    }
  }

  return await UserModel.aggregate(aggregateQuery)
}

async function getOneStockOpname(parent, { _id }) {
  return await StockOpnameModel.findById(_id).lean()
}

// MUTATION
async function createStockOpname(parent, { stock_opname_input }, ctx) {
  stock_opname_input.created_by = stock_opname_input.created_by || ctx.user_id
  return await StockOpnameModel.create(stock_opname_input)
}

async function updateStockOpname(parent, { _id, stock_opname_input }, ctx) {
  return await StockOpnameModel.findByIdAndUpdate(_id, {
    $set: stock_opname_input
  }).lean()
}

async function deleteStockOpname(parent, { _id }) {
  return await StockOpnameModel.findByIdAndDelete(_id).lean()
}

// LOADER
async function created_by(parent, args, context) {
  if (parent.created_by) {
    return await context.loaders.UserLoader.load(parent.created_by)
  }

  return null
}

const Query = {
  getAllStockOpnames,
  getOneStockOpname
}

const Mutation = {
  createStockOpname,
  updateStockOpname,
  deleteStockOpname
}

const StockOpname = {
  created_by
}

const resolvers = {
  Query,
  Mutation,
  StockOpname
}

export default resolvers
