const db = require('../utils/dbConnect')
// 用来加密用户密码的插件
const bcrypt = require('bcryptjs')
// 导入生成token的包
const jwt = require('jsonwebtoken')
// 导入全局配置文件
const config = require('../config')
/**
 * @description 注册接口 接受至少两个入参username和password
 * */
exports.register = (req, res) => {
    // 通过req.body获取请求中的查询字符串、发送到服务器的数据
    const pm = req.body
    const pwd = bcrypt.hashSync(pm.password, 10)
    console.log(pm)
    const sql = `INSERT INTO users (username,password,avatar,email,address,nickname) VALUES ('${pm.username}','${pwd}','${pm.avatarUrl}','${pm.email?pm.email:''}','${pm.address?pm.address:''}','${pm.nickname?pm.nickname:''}')`
    // 添加用户信息 密码使用bcrypt.hashSync进行加密处理 bcrypt.hashSync(明文密码:string,随机盐长度:number)
    db.query(sql, (err, data) => {
        if (err) {
            if (err.sqlMessage.indexOf('username') && err.code == 'ER_DUP_ENTRY') {
                res.cc(`用户名 ${pm.username} 已存在!`);
            } else {
                res.cc(err)
            }
        } else {
            res.send({
                status: 0,
                message: '注册成功'
            });
        }
    })
}
/**
 * @description 登录接口
 * */
exports.login = (req, res) => {
    // 通过req.body获取请求体中的数据
    const userinfo = req.body
    // 先查询用户名是否存在
    db.query('SELECT * FROM users WHERE username = ?', userinfo.username, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            if (data[0]) {
                // 校验密码 使用bcrypt的compareSync方法
                const compareResult = bcrypt.compareSync(userinfo.password, data[0].password)
                // 调用res.send来响应请求
                // 剔除敏感信息
                const user = {...data[0], password: '', phone: '', address: ''}
                // 加密用户信息并生成token
                const token = 'Bearer ' + jwt.sign(user, config.jwtSecrtKey, {expiresIn: config.expiresIn})
                // 返回用户信息前剔除铭感字段
                delete data[0].password
                if (compareResult) {
                    res.send({
                        status: 0,
                        message: '登录成功!',
                        data: {token}
                    })
                } else {
                    res.cc('密码错误')
                }
            } else {
                res.cc(`用户名 ${req.body.username} 不存在`)
            }
        }
    })
};