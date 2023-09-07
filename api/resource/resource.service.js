//1בסד

const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId


async function query(filterBy = { txt: ''}) {
    try {
        const criteria = {
            title: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('resource')
        var resource = await collection.find({}).toArray()
    //    console.log('resources',resource);
       
        return resource

    } catch (err) {
        logger.error('cannot find resource', err)
        throw err
    }
}

async function getById(resourceId) {
    try {
        const collection = await dbService.getCollection('resource')
        const resource = collection.findOne({ _id: ObjectId(resourceId) })
        return resource
    } catch (err) {
        logger.error(`while finding resource ${resourceId}`, err)
        throw err
    }
}

async function remove(resourceId) {
    try {
        const collection = await dbService.getCollection('resource')
        await collection.deleteOne({ _id: ObjectId(resourceId) })
        return resourceId
    } catch (err) {
        logger.error(`cannot remove resource ${resourceId}`, err)
        throw err
    }
}

async function add(resource) {
    try {
        const collection = await dbService.getCollection('resource')
        await collection.insertOne(resource)
        // console.log('added this one :',resource);
        
        return resource
    } catch (err) {
        logger.error('cannot insert resource', err)
        throw err
    }
}

async function update(resource) {
    try {
        const resourceToSave = {
            cart: resource.cart,
            students: resource.students
        }
        console.log('updatedResource in resource controller',resource);

        const collection = await dbService.getCollection('resource')
        await collection.updateOne({ _id: ObjectId(resource._id) }, { $set: resourceToSave })
        return resource
    } catch (err) {
        logger.error(`cannot update resource ${resource._id}`, err)
        throw err
    }
}

async function addresourceMsg(resourceId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('resource')
        await collection.updateOne({ _id: ObjectId(resourceId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add resource msg ${resourceId}`, err)
        throw err
    }
}

async function removeresourceMsg(resourceId, msgId) {
    try {
        const collection = await dbService.getCollection('resource')
        await collection.updateOne({ _id: ObjectId(resourceId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add resource msg ${resourceId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addresourceMsg,
    removeresourceMsg
}
