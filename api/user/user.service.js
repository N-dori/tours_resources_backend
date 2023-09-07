
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId
const socketService = require('../../services/socket.service.js')
module.exports = {
    query,
    getById,
    getByUserEmail,
    getByUserName,
    remove,
    update,
    add,
    clearGuestCart,
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find({}).toArray()
        
        // users = users.map(user => {
        //     delete user.password
        //     user.createdAt = ObjectId(user._id).getTimestamp()
        //     // Returning fake fresh data
        //     // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
        //     return user
        // })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}


async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password

        // user.givenReviews = await reviewService.query({ byUserId: ObjectId(user._id) })
        // user.givenReviews = user.givenReviews.map(review => {
        //     delete review.byUser
        //     return review
        // })

        return user
    } catch (err) {
        logger.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}
async function getByUserEmail(email) {
    
    try {
        console.log('getByUsername in user service ---username :',email);
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ email })
        // console.log('user found in user service',user);
        return user
    } catch (err) {
        logger.error(`while finding user by email: ${email}`, err)
        throw err
    }
}
async function getByUserName(fname) {
    
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ fname })
        // console.log('user found by getUsername in user service',user);
        return user
    } catch (err) {
        logger.error(`while finding user by email: ${fname}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ _id: ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}
async function clearGuestCart() {
    try {
        // peek only updatable properties
        const userToSave = {
            _id: ObjectId('64abe02a8723e73efc4d4be8'), // needed for the returnd obj
            cart:[],
       
        }
        const collection = await dbService.getCollection('user')
        //on the left side is the object to update, on the rigth is the keys we want to change
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    }
     catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // peek only updatable properties
        const userToSave = {
            _id: ObjectId(user._id), // needed for the returnd obj
            fname:user.fname,
            email:user.email,
            cart:user.cart,
            courses:user.courses,
        }
        if(user.action === 'purchase'){
            delete user.action
            const msg = 'purchase-was-made'
            socketService.emit('purchased', msg)
        }
        const collection = await dbService.getCollection('user')
        //on the left side is the object to update, on the rigth is the keys we want to change
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    }
     catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    
    try {
        // console.log('user addddddd',user);
        const userToAdd = {
            fname: user.fname,
            email:user.email,
            password: user.password,
            imgUrl: user.imgUrl,
            courses: user.courses? user.courses : [],
            cart:[],
            isAdmin:false    
        }
     const collection = await dbService.getCollection('user')
      await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot add user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}




