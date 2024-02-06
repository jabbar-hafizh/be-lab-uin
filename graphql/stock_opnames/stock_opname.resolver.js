import mongoose from 'mongoose'
import StockOpnameHistoryModel from '../stock_opname_histories/stock_opname_history.model.js'
import StockOpnameModel from './stock_opname.model.js'

// QUERY
async function getAllStockOpnames(parent, { filter }, ctx) {
  const query = {
    $and: [{ _id: { $ne: null } }]
  }
  const aggregateQuery = [{ $match: query }]

  if (filter) {
    if (filter?.laboratorium_type?.length) {
      query.$and.push({ laboratorium_type: { $in: filter.laboratorium_type } })
    }
    if (filter?.not_empty_remaining) {
      query.$and.push({ remaining_ingredient: { $ne: null } })
    }
  }

  return await StockOpnameModel.aggregate(aggregateQuery)
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
  const stock_opname_history = await StockOpnameHistoryModel.aggregate([
    {
      $match: {
        stock_opname: new mongoose.Types.ObjectId(_id)
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$number' }
      }
    }
  ])
  const total_used_stock_opname = stock_opname_history[0]?.total || 0

  if (stock_opname_input.piece >= total_used_stock_opname) {
    stock_opname_input.remaining_ingredient =
      stock_opname_input.piece - total_used_stock_opname
  } else {
    return new Error('Less Than Total Used!')
  }

  return await StockOpnameModel.findByIdAndUpdate(
    _id,
    {
      $set: stock_opname_input
    },
    { new: true }
  ).lean()
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
