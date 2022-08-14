// 连接数据库的入口文件，host，user，password，database根据个人情况填写
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'database',
})

// 向外共享 db 数据库连接对象
module.exports = db
