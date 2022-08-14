const express = require('express');
const cors = require('cors');
const joi = require('joi')
const config = require('./config');
const expressJWT = require('express-jwt');

const app = express();

// 导入cors 将cors配置为全局中间件
app.use(cors())

// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 封装response.cc函数
app.use((request, response, next) => {
    response.cc = (error, status = 1) => {
        response.send({
            status,
            message: error instanceof Error ? error.message : error
        })
    }
    next();
})

// 配置解析token中间件
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))


// 导入用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入用户信息模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter)


// 定义错误级别中间件
app.use((error, request, response, next) => {
    // 验证失败错误
    if (error instanceof joi.ValidationError) return response.cc(error)
    // 身份认证失败错误
    if (error.name == 'UnauthorizedError') {
        return response.cc('身份认证失败！')
    }
    // 未知错误
    response.cc(error)
})


app.listen(3007, () => {
    console.log('listening!');
})