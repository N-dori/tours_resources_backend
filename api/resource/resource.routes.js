const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getResource, getResourceById, addResource, updateResource, removeResource, addResourceMsg, removeResourceMsg } = require('./resource.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getResource)
router.get('/:id', getResourceById)
router.post('/', /* requireAuth,  */addResource)
router.put('/:id',/*  requireAuth, */ updateResource)
router.delete('/:id', /* requireAuth ,*/ removeResource)
// router.delete('/:id', requireAuth, requireAdmin, removeResource)

// router.post('/:id/msg', requireAuth, addResourceMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeResourceMsg)

module.exports = router