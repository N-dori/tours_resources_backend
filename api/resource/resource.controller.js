const resourceService = require('./resource.service.js')

const logger = require('../../services/logger.service.js')

async function getResources(req, res) {
  try {
    logger.debug('Getting Resources')
    const filterBy = {
      txt: req.query.title || '',
    
    }
    console.log('filterBy',filterBy);
    
    const resources = await resourceService.query(filterBy)    
    res.json(resources)
  } catch (err) {
    logger.error('Failed to get resources', err)
    res.status(500).send({ err: 'Failed to get resources' })
  }
}

async function getResourcesById(req, res) {
  try {
    const resourcesId = req.params.id
    console.log('resourcesId in resource controller ',resourcesId);
    const resources = await resourceService.getById(resourcesId)    
    res.json(resources)
  } catch (err) {
    logger.error('Failed to get resources', err)
    res.status(500).send({ err: 'Failed to get resources' })
  }
}

async function addResources(req, res) {
  try {
    const resources = req.body    
    
    const addedResources = await resourceService.add(resources)
    console.log('resources in controller',addedResources);
    res.json(addedResources)
  } catch (err) {
    logger.error('Failed to add resources', err)
    res.status(500).send({ err: 'Failed to add resources' })
  }
}


async function updateResources(req, res) {
  try {
    const resource = req.body
    console.log('updatedResource in resource controller',resource);
    const updatedResource = await resourceService.update(resource)    
    console.log('updatedResource in couse controller',updatedResource);
    
    res.json(updatedResource)
  } catch (err) {
    logger.error('Failed to update resource', err)
    res.status(500).send({ err: 'Failed to update resource' })

  }
}

async function removeResources(req, res) {
  try {
    const resourcesId = req.params.id
    const removedId = await resourceService.remove(resourcesId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove resources', err)
    res.status(500).send({ err: 'Failed to remove resources' })
  }
}

async function addResourcesMsg(req, res) {
  const {loggedinUser} = req
  try {
    const resourcesId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await resourceService.addResourcesMsg(resourcesId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update resources', err)
    res.status(500).send({ err: 'Failed to update resources' })

  }
}

async function removeResourcesMsg(req, res) {
  const {loggedinUser} = req
  try {
    const resourcesId = req.params.id
    const {msgId} = req.params

    const removedId = await resourceService.removeResourcesMsg(resourcesId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove resources msg', err)
    res.status(500).send({ err: 'Failed to remove resources msg' })

  }
}

module.exports = {
  getResources,
  getResourcesById,
  addResources,
  updateResources,
  removeResources,
  addResourcesMsg,
  removeResourcesMsg
}
