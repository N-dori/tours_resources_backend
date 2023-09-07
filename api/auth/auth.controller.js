const authService = require('./auth.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    try {
        const { fname, password } = req.body
        // console.log('auth controller login req.body',req.body);
        
        const user = await authService.login(fname, password)
        // console.log('user in auth controller verified user :',user);
        const loginToken = authService.getLoginToken(user)

        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken, {sameSite: 'None', secure: true})
        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}
async function getLoggedinUser(req, res) {
    try {

        const loggedinUser = await authService.getLoggedinUser(req)
        // console.log('loggedinUser in auth controller  :',loggedinUser);
        res.json(loggedinUser)
    } catch (err) {
        logger.error('Failed to get logged in   user :' + err)
        // res.status(401).send({ err: 'Failed to get logged in   user ' })
    }
}

async function signup(req, res) {
    console.log('credentials',req.body);
    try {
        const credentials = req.body
        
        // Never log passwords
        logger.debug(credentials)
        const account = await authService.signup(credentials)
        const loginToken = authService.getLoginToken(account)
        res.cookie('loginToken', loginToken, {sameSite: 'None', secure: true})
        // this is because user sign up as google user 
        if(!credentials.password){
            logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
            res.json(account)
        }else{
            logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
            const user = await authService.login(credentials.fname, credentials.password)
            logger.info('User signup:', user)

            res.json(user)
        }
        
        // const loginToken = authService.getLoginToken(user)
        // res.cookie('loginToken', loginToken, {sameSite: 'None', secure: true})
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res){
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout,
    getLoggedinUser
}