import { getDatabase } from '../database/mongodb';

interface Condition {
  [key: string]: any;
}

interface Project {
  [key: string]: 0 | 1;
}

interface Page {
  skip?: number;
  limit?: number;
}

interface Sort {
  [key: string]: 1 | -1;
}

const db: any = getDatabase();

// const insert = (model:any, data:any) => db.collection(model).insertOne(data)

// const insertMany = (model:any, data: any) => db.collection(model).insertMany(data)

// // const find = (model:any, condition : any, project = {}) => db.collection(model).find(condition, { projection: project || {} }).toArray()

// const createIndex = (model:any, condition : any, name ) => db.collection(model).createIndex(condition, {name: name})

// const createMultipleIndex = (model:any, condition : any) => db.collection(model).createIndexes(condition)

// const getCollections = (model:any) => db.listCollections({ name : model }).toArray();

// const createCollection = (model:any) => db.createCollection(model);

// const getIndexes = (model:any) => db.collection(model).indexes();

// const findOne = (model:any, condition : any, project = {}) => db.collection(model).findOne(condition, { projection: project || {} })

// const update = (model:any, condition : any, data: any, options?: any) => db.collection(model).updateOne(condition, data, options)

// const updateMany = (model:any, condition : any, data : any,options?: any) => db.collection(model).updateMany(condition, data,options)

// const aggregate = (model:any, condition : any) => db.collection(model).aggregate(condition).toArray()

// const Delete = (model:any, condition : any) => db.collection(model).deleteOne(condition)

// const deleteMany = (model:any, condition : any) => db.collection(model).deleteMany(condition)

// const count = (model:any, condition : any) => db.collection(model).countDocuments(condition)

// const findOneAndUpdate = (model:any, condition : any, data: any, options? : any) => db.collection(model).findOneAndUpdate(condition, data,options)

// const find = (model:any, condition : any, project:any = {}, page:any = {}, sort: any) => db.collection(model).find(condition, { projection: project || {} }).sort(sort || {}).skip(page.skip || 0).limit(page.limit || 100).toArray()

// const findAll = (model:any, condition : any, project = {}, page = {}, sort: any) => db.collection(model).find(condition, { projection: project || {} }).sort(sort || {}).toArray()

// const bulkWrite = (model:any, bulkOptions: any) => db.collection(model).bulkWrite(bulkOptions);

export {
  // insert,
  // insertMany,
  // update,
  // find,
  // findOne,
  // aggregate,
  // createIndex,
  // Delete,
  // count,
  // findOneAndUpdate,
  // createMultipleIndex,
  // deleteMany,
  // findAll,
  // updateMany,
  // bulkWrite,
  // getIndexes,
  // getCollections,
  // createCollection,

};
