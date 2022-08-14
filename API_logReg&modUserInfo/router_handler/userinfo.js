const db = require('../db/index');
const bcrypt = require('bcryptjs');

// 获取用户信息处理函数
exports.getUserInfo = (request, response) => {
    const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?';

    db.query(sql, request.user.id, (error, results) => {
        if (error) return response.cc(error);
        if (results.length !== 1) return response.cc('获取用户信息失败');
        response.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })
}

// 更新用户信息处理函数
exports.updateUserInfo = (request, response) => {
    const sql = 'update ev_users set ? where id=?';
    db.query(sql, [request.body, request.body.id], (error, results) => {
        if (error) return response.cc(error);
        if (results.affectedRows !== 1) return response.cc('修改用户基本信息失败！');
        response.cc('修改用户信息成功', 0)
    })
}

// 重置密码处理函数
exports.updatePassword = (request, response) => {
    const sql = 'select * from ev_users where id=?';
    db.query(sql, request.user.id, (error, results) => {
        if (error) return response.cc(error);
        if (results.length !== 1) return response.cc('用户不存在！');
        // 判断旧密码是否正确
        const compareResult = bcrypt.compareSync(request.body.oldPwd, results[0].password)
        if (!compareResult) return response.cc('旧密码错误');
        // 更新数据库密码
        const sql = 'update ev_users set password=? where id=?';
        const newPwd = bcrypt.hashSync(request.body.newPwd, 10);
        db.query(sql, [newPwd, request.body.id], (error, results) => {
            if (error) return response.cc(error);
            if (results.affectedRows != 1) return response.cc('更新密码失败');
            response.cc('更新密码成功', 0)
        })
    })
}

// 更改头像处理函数
exports.updateAvatar = (request, response) => {
    const sql = 'update ev_users set user_pic=? where id=?';
    db.query(sql, [request.body.avatar, request.user.id], (error, results) => {
        if (error) return response.cc(error);
        if (results.affectedRows != 1) return response.cc('更新头像失败');
        response.cc('更新头像成功', 0)
    })
}