import moment from 'moment-timezone'

import mongoose from 'mongoose'
import StockOpnameModel from '../stock_opnames/stock_opname.model.js'
import StockOpnameHistoryModel from './stock_opname_history.model.js'

// QUERY
async function getAllStockOpnameHistories(parent, { filter }, ctx) {
  const query = {
    $and: [{ _id: { $ne: null } }]
  }
  const aggregateQuery = [
    {
      $addFields: {
        date_formatted: {
          $dateFromString: {
            dateString: '$date'
            // format: '%d-%m-%Y'
          }
        }
      }
    },
    { $match: query }
  ]

  if (filter) {
    if (filter.start_date && filter.end_date) {
      query.$and.push({
        date_formatted: {
          $gt: moment(filter.start_date, 'DD-MM-YYYY').startOf('day').toDate(),
          $lt: moment(filter.end_date, 'DD-MM-YYYY').endOf('day').toDate()
        }
      })
    }
    if (filter.stock_opname_id) {
      query.$and.push({
        stock_opname: new mongoose.Types.ObjectId(filter.stock_opname_id)
      })
    }
    if (filter?.laboratorium_type?.length) {
      aggregateQuery.push(
        {
          $lookup: {
            from: 'stock_opnames',
            localField: 'stock_opname',
            foreignField: '_id',
            as: 'stock_opname_lookup'
          }
        },
        {
          $match: {
            'stock_opname_lookup.laboratorium_type': { $in: filter.laboratorium_type }
          }
        }
      )
    }
  }

  return await StockOpnameHistoryModel.aggregate(aggregateQuery)
}

async function getOneStockOpnameHistory(parent, { _id }) {
  return await StockOpnameHistoryModel.findById(_id).lean()
}

// MUTATION
async function createStockOpnameHistory(parent, { stock_opname_history_input }) {
  const stock_opname = await StockOpnameModel.findById(
    stock_opname_history_input.stock_opname
  ).lean()
  if (stock_opname_history_input.number > stock_opname.remaining_ingredient || 0) {
    return new Error('Cannot use more than remaining ingredient!')
  }
  await StockOpnameModel.findByIdAndUpdate(
    stock_opname_history_input.stock_opname,
    {
      $set: {
        remaining_ingredient:
          stock_opname.remaining_ingredient - stock_opname_history_input.number
      }
    },
    { new: true }
  ).lean()
  return await StockOpnameHistoryModel.create(stock_opname_history_input)
}

async function updateStockOpnameHistory(
  parent,
  { _id, stock_opname_history_input },
  ctx
) {
  const stock_opname_history = await StockOpnameHistoryModel.findById(_id)
    .populate([{ path: 'stock_opname' }])
    .lean()
  if (!stock_opname_history) return new Error('Data not found')

  if (
    stock_opname_history_input.number >
    (stock_opname_history.stock_opname.remaining_ingredient || 0) +
      stock_opname_history.number
  ) {
    return new Error('Cannot use/update more than remaining ingredient!')
  }

  await StockOpnameModel.findByIdAndUpdate(
    stock_opname_history.stock_opname._id,
    {
      $set: {
        remaining_ingredient:
          (stock_opname_history.stock_opname.remaining_ingredient || 0) +
          stock_opname_history.number -
          stock_opname_history_input.number
      }
    },
    { new: true }
  ).lean()

  return await StockOpnameHistoryModel.findByIdAndUpdate(
    _id,
    {
      $set: stock_opname_history_input
    },
    { new: true }
  ).lean()
}

async function deleteStockOpnameHistory(parent, { _id }) {
  return await StockOpnameHistoryModel.findByIdAndDelete(_id).lean()
}

// LOADER
async function stock_opname(parent, args, context) {
  if (parent.stock_opname) {
    return await context.loaders.StockOpnameLoader.load(parent.stock_opname)
  }

  return null
}

const Query = {
  getAllStockOpnameHistories,
  getOneStockOpnameHistory
}

const Mutation = {
  createStockOpnameHistory,
  updateStockOpnameHistory,
  deleteStockOpnameHistory
}

const StockOpnameHistory = {
  stock_opname
}

const resolvers = {
  Query,
  Mutation,
  StockOpnameHistory
}

export default resolvers
