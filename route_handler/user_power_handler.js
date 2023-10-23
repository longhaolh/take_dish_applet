const db = require('../utils/dbConnect')
const bcrypt = require('bcryptjs')

/**
 * @description 获取用户信息接口 根据token中的id获取用户信息 req.auth为解析后的token信息
 * */
exports.getUserInfo = (req, res) => {
    db.query("SELECT * FROM users WHERE id = ?", req.auth.id, (err, data) => {
        if (err) {
            res.status(500).cc(err)
        } else {
            let userinfo = data[0]
            delete userinfo.password
            res.send({status: 0, message: '获取成功', data: {userinfo}})
        }
    })
}
/**
 * @description 更新用户信息接口
 * */
exports.updateUserInfo = (req, res) => {
    // console.log(typeof req.headers.authorization)
    db.query("UPDATE users SET ? WHERE ID = ?", [req.body, req.auth.id], (err, data) => {
        if (err) {
            res.status(500).cc(err)
        } else {
            res.send({status: 0, message: '更新成功'})
        }
    })
}
/**
 * @description 修改密码接口(需要旧密码)
 * */
exports.editPassword = (req, res) => {
    db.query("SELECT * FROM users WHERE id = ?", req.auth.id, (err, data) => {
        if (err) {
            res.status(500).cc(err)
        } else {
            const compareResult = bcrypt.compareSync(req.body.oldPwd, data[0].password)
            if (compareResult) {
                db.query("UPDATE users SET password = ? WHERE ID = ?", [bcrypt.hashSync(req.body.newPwd, 10), req.auth.id], (err1, data1) => {
                    if (err1) {
                        res.status(500).cc(err1)
                    } else {
                        res.send({status: 0, message: '更新完成'})
                    }
                })
            } else {
                res.cc('原密码错误!')
            }

        }
    })
}
