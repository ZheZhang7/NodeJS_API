const db = require('../db/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// 注册新用户处理函数
exports.regUser = (request, response) => {
    // 获取客户端提交的用户信息
    const userinfo = request.body;
    // 用户唯一性校验
    const sqlStr = "SELECT * FROM ev_users WHERE username=?";
    db.query(sqlStr, userinfo.username, (error, results) => {
        if (error) return response.cc(error)
        if (results.length > 0) return response.cc('用户名被占用，请更换其他用户名！')
        // 使用bcryptjs进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // 插入数据
        const sql = 'insert into ev_users set ?';
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (error, results) => {
            if (error) return response.cc(error)
            if (results.affectedRows !== 1) return response.cc("注册失败，稍后再试")
            response.cc("注册成功！", 0);
        })
    })
}

// 用户登录处理函数
exports.login = (request, response) => {
    const userinfo = request.body;
    const sql = 'select * from ev_users where username = ?'
    db.query(sql, userinfo.username, (error, results) => {
        if (error) return response.cc(error);
        if (results.length != 1) return response.cc('登录失败');
        // 判断用户输入密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareResult) return response.cc('登录失败！')
        // 剔除密码和头像的值
        const user = { ...results[0], password: '', user_pic: '' };
        // 生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' })
        response.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr
        })
    })
}