const express = require("express");
import authN from "./Routes/authentications";
import users from "./Routes/users";
import txns from "./Routes/transactions";

const routerConf = express.Router();

routerConf.use("/auth",authN);
routerConf.use("/txn",txns);
routerConf.use("/user",users);

export default routerConf;