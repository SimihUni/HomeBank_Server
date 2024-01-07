import authN from './Routes/authentications'
import users from './Routes/users'
import txns from './Routes/transactions'
import express from 'express'

const routerConf = express.Router()

routerConf.use('/auth', authN)
routerConf.use('/txn', txns)
routerConf.use('/user', users)

export default routerConf
