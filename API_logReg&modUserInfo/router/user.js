const express = require('express');
const userHandler = require('../router_handler/user')
// 导入验证数据中间件
const expressJoi = require('@escook/express-joi');
const { reg_login_schema } = require('../schema/user')

const router = express.Router();

// 注册新用户路由
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser)
// 登录路由
router.post('/login', expressJoi(reg_login_schema), userHandler.login)
module.exports = router