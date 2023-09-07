const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getResources, getResourcesById, addResources, updateResources, removeResources, } = require('./resource.controller')
const router = express.Router()

// middleware that is specific to this router
router.use(requireAuth)

router.get('/', getResources)
router.get('/:id', getResourcesById)
router.post('/', /* requireAuth,  */addResources)
router.put('/:id',/*  requireAuth, */ updateResources)
router.delete('/:id', /* requireAuth ,*/ removeResources)
// router.delete('/:id', requireAuth, requireAdmin, removeResource)

// router.post('/:id/msg', requireAuth, addResourceMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeResourceMsg)

module.exports = router
