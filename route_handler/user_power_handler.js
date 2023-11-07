const db = require('../utils/dbConnect')
const bcrypt = require('bcryptjs')
const {validatePower} = require('../utils/power')
const power = require('../utils/power')
/**
 * @description 根据id获取用户信息接口 根据token中的id获取用户信息 req.auth为解析后的token信息
 * */
exports.getUserInfo = (req, res) => {
    db.query("SELECT * FROM users WHERE id = ?", req.auth.id, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            let userinfo = data[0]
            delete userinfo.password
            res.send({status: 0, message: '获取成功', data: {userinfo}})
        }
    })
}
/**
 * @description 管理员admin获取所有用户信息接口 根据token中的id获取用户信息 req.auth为解析后的token信息
 * */
exports.getAllUser = (req, res) => {
    let page_number = req.query.page_number;
    let page_count = req.query.page_count;
    power.validatePower(req.auth, 2).then(result => {
        const start = (page_number - 1) * page_count
        const sql = `SELECT * FROM users LIMIT ${start},${page_count?page_count:10}`
        db.query(sql, (err, data) => {
            if (err) {
                res.cc(err)
            } else {
                if (data.length > 0) {
                    db.query(`SELECT COUNT(*) AS total FROM users`, (err1, data1) => {
                        if (err1) {
                            res.cc(err1)
                        } else {
                            let userList = data
                            userList.forEach(e => {
                                delete e.password
                            })
                            res.send({status: 0, message: '获取成功', data: [...userList], total: data1[0].total})
                        }
                    })
                } else {
                    res.send({status: 0, message: '获取成功', data: []})
                }
            }
        })
    }).catch(error => {
        res.cc(error.message)
    })

}
/**
 * @description 用户信息模糊搜索
 */
exports.queryUser = (req, res) => {
    const searchTerm = req.query.searchTerm;
    validatePower(req.auth.power, 3).then(() => {
        const query = `SELECT * FROM users WHERE email LIKE ? OR phone LIKE ? OR nickname LIKE ? OR username LIKE ?`;
        db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`], (err, data) => {
            if (err) {
                res.cc('查询出错')
            } else {
                if (data.length > 0) {
                    res.send({status: 0, message: '查询成功', data: [...data]})
                } else {
                    res.send({status: 0, message: '查询成功', data: []})
                }
            }
        });
    }).catch(err => {
        res.cc(err.message)
    })

}
/**
 * @description 账户搜索
 */
exports.queryUserSelect = (req, res) => {
    const pm = req.query
    const sql = `SELECT username FROM users WHERE username LIKE '%${pm.word}%' AND power <= 1`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            res.send({status: 0, message: '查询成功', data: [...data]})
        }
    })
}
/**
 * @description 注销用户
 */
exports.deleteUser = (req, res) => {
    const pm = req.body
    const sql = `UPDATE users SET status = 2 WHERE id = ${pm.id}`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            if (data.affectedRows > 0) {
                res.send({status: 0, message: '注销成功'})
            } else {
                res.cc('未知错误')
            }
        }
    })
}
/**
 * @description 恢复注销用户
 */
exports.restoreUser = (req, res) => {
    const pm = req.body
    const sql = `UPDATE users SET status = 0 WHERE id = ${pm.id}`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            if (data.affectedRows > 0) {
                res.send({status: 0, message: '恢复成功'})
            } else {
                res.cc('未知错误')
            }
        }
    })
}
/**
 * @description 封禁用户
 */
exports.banUser = (req, res) => {
    const pm = req.body
    const sql = `UPDATE users SET status = 1 WHERE id = ${pm.id}`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            if (data.affectedRows > 0) {
                res.send({status: 0, message: '封禁成功'})
            } else {
                res.cc('未知错误')
            }
        }
    })
}
/**
 * @description 更新用户信息接口
 * */
exports.updateUserInfo = (req, res) => {
    db.query("UPDATE users SET ? WHERE ID = ?", [req.body, req.auth.id], (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            res.send({status: 0, message: '更新成功'})
        }
    })
}
/**
 * @description 编辑用户信息接口
 * */
exports.editUserInfo = (req, res) => {
    console.log(req.body)
    db.query("UPDATE users SET ? WHERE ID = ?", [req.body, req.body.id], (err, data) => {
        if (err) {
            res.cc(err)
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
/**
 * @description 获取权限列表
 */
exports.queryPower = (req, res) => {
    const options = [
        {
            value: '0',
            label: '普通用户',
            disabled: true,
        },
        {
            value: '1',
            label: '商户',
            disabled: true,
        },
        {
            value: '2',
            label: '客服',
            disabled: true,
        },
        {
            value: '3',
            label: '管理员',
            disabled: true,
        }
    ]
    const power = req.auth.power
    for (let i = 0; i < power; i++) {
        options[i].disabled = false
    }
    res.send({status: 0, message: '获取权限列表成功', data: [...options]})
}