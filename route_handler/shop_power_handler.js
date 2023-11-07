// handle文件
const db = require('../utils/dbConnect')
const clear = require('../utils/clearUnlessImg')
const power = require('../utils/power')
const {validatePower} = require('../utils/power')
/**
 * @author longhao
 * @time 2023年10月31日16:29:43
 * @description 添加店铺接口,req.body入参如下
 * @param {string} shop_name 店铺名称 必填
 * @param {string} shop_address 店铺地址 必填
 * @param {string} shop_host 店铺负责人 必填
 * @param {string} shop_phone 店铺联系电话 必填
 * @param {string} shop_status 店铺状态 0正常营业 1暂停营业 2封店 3已注销 必填
 * @param {string} shop_admin 店铺管理账号 必填
 * @param {string} shop_license 店铺营业执照图片url 选填
 * @param {string} shop_banner 店铺海报图片url 必填
 * @param {string} shop_card 店铺收款账号 必填
 */
exports.addShop = (req, res) => {
    const pm = req.body
    const sql1 = `SELECT * FROM shop WHERE shop_name = '${pm.shop_name}'`
    const sql = `INSERT INTO shop (shop_name,shop_address,shop_host,shop_phone,shop_status,shop_admin,shop_banner,shop_card,shop_license) VALUES ('${pm.shop_name}','${pm.shop_address}','${pm.shop_host}','${pm.shop_phone}','${pm.shop_status}','${pm.shop_admin}','${pm.shop_banner}','${pm.shop_card}','${pm.shop_license}')`
    // 先查询店铺名称是否已经存在,再执行插入操作,防止主键自增
    db.query(sql1, (err1, data1) => {
        if (err1) {
            res.status(500).cc(err1)
        } else {
            // data1.length>0说明有重复名称
            if (data1.length > 0) {
                res.cc(`添加失败!店铺名称 ${pm.shop_name} 已存在!`)
            } else {
                db.query(sql, (err, data) => {
                    if (err) {
                        res.cc(err)
                    } else {
                        res.send({status: 0, message: '添加店铺成功'})
                    }
                })
            }
        }
    })
}
/**
 * @author longhao
 * @time 2023年10月20日10:17:30
 * @description 更新店铺信息,req.body入参如下
 * @param {number} shop_id 店铺id 必填
 * @param {string} shop_name 店铺名称 选填,不可重复
 * @param {string} shop_address 店铺地址 选填
 * @param {string} shop_host 店铺负责人姓名 选填
 * @param {string} shop_phone 店铺联系电话 选填
 * */
exports.updateShop = (req, res) => {
    const pm = req.body;
    const qrysql = `SELECT * FROM shop WHERE shop_id = '${pm.shop_id}'`;
    // 检查当前登录的用户username是否和店铺管理员账号一致
    db.query(qrysql, (qerr, qdata) => {
        if (qerr) {
            return res.status(500).cc(qerr);
        } else {
            if (qdata[0]) {
                // 检查传入的字段是否为空
                if (!pm.shop_name && !pm.shop_address && !pm.shop_host && !pm.shop_phone) {
                    return res.status(400).cc('至少需要填写一个字段');
                }
                // 创建一个更新语句的字符串，如果传入的字段为空则插入原字段值
                const updateStatement = `UPDATE shop SET shop_name = '${pm.shop_name?pm.shop_name:qdata[0].shop_name}', shop_address = '${pm.shop_address?pm.shop_address:qdata[0].shop_address}', shop_host = '${pm.shop_host?pm.shop_host:qdata[0].shop_host}', shop_phone = '${pm.shop_phone?pm.shop_phone:qdata[0].shop_phone}' WHERE shop_id = '${pm.shop_id}'`;
                if (qdata[0].shop_admin === req.auth.username) {
                    db.query(updateStatement, (err, data) => {
                        if (err) {
                            if (err.code === 'ER_DUP_ENTRY') {
                                const msg = `更新失败!店铺名称重复!`
                                res.status(500).cc(msg)
                            } else {
                                res.status(500).cc(err)
                            }
                        } else {
                            return res.send({status: 0, message: '修改成功'});
                        }
                    });
                } else {
                    return res.send({
                        status: -1,
                        message: `当前登录账号 ${req.auth.username} 没有权限对店铺 ${qdata[0].shop_name} 进行此操作`
                    });
                }
            } else {
                res.cc('要修改的店铺不存在')
            }
        }
    });
}
/**
 * @author longhao
 * @time 2023年10月20日19:40:30
 * @description 注销店铺,req.body入参如下
 * @param {number} shop_id 店铺id 必填
 * @param {string} shut_reason 注销理由 必填
 * @param {string} shut_time 注销时间 必填,后台取服务器日期
 * @param {string} shut_account 注销人账号,后台获取token中的username
 * */
exports.shutdownShop = (req, res) => {
    const pm = req.body;
    const qrysql = `SELECT * FROM shop WHERE shop_id = '${pm.shop_id}'`;
    const sql = `UPDATE shop SET shop_status = 3 WHERE shop_id = '${pm.shop_id}'`
    const sql2 = `INSERT INTO shut_shop (shop_id,shut_reason,shut_time,shut_account) VALUES ('${pm.shop_id}','${pm.shut_reason}', NOW(),'${req.auth.username}')`
    // 检查当前登录的用户username是否和店铺管理员账号一致 用户注销
    db.query(qrysql, (qerr, qdata) => {
        if (qerr) {
            return res.status(500).cc(qerr);
        } else {
            if (qdata[0]) {
                if (qdata[0].shop_status === 3) {
                    res.cc('注销店铺失败!该店铺已经注销!')
                    return
                }
                // 将注销信息写入shut_shop表
                db.query(sql2, (err, data) => {
                    if (err) {
                        res.cc(err)
                    } else {
                        // 更新shop表中的状态
                        db.query(sql, (err1, data1) => {
                            if (err1) {
                                res.cc(err1)
                            } else {
                                console.log(data1)
                                res.send({status: 0, message: '店铺注销成功'})
                            }
                        })
                    }
                })
            } else {
                res.cc('要删除的店铺不存在')
            }
        }
    });
    // 系统注销
    if (req.auth.username === 'system') {
        res.cc('系统注销')
    }
}
/**
 * @description 获取所有店铺列表,权限接口,需要账号权限大于等于2
 */
exports.getAllShop = (req, res) => {
    power.validatePower(req.auth, 2).then(result => {
        let page_number = req.query.page_number;
        let page_count = req.query.page_count;
        const start = (page_number - 1) * page_count
        const sql = `SELECT * FROM shop LIMIT ${start},${page_count?page_count:10}`
        db.query(sql, (err, data) => {
            if (err) {
                res.cc(err)
            } else {
                if (data.length > 0) {
                    db.query(`SELECT COUNT(*) AS total FROM shop`, (err1, data1) => {
                        if (err1) {
                            res.cc(err1)
                        } else {
                            let shopList = data
                            shopList.forEach(e => {
                                delete e.password
                            })
                            res.send({status: 0, message: '查询成功', data: [...shopList], total: data1[0].total})
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
 * @description 店铺信息模糊搜索
 * @time 2023年11月6日09:23:25
 * @param searchTerm {string}搜索字段
 */
exports.queryShop = (req, res) => {
    const searchTerm = req.query.searchTerm;
    validatePower(req.auth, 3).then(() => {
        const query = `SELECT * FROM shop WHERE shop_admin LIKE ? OR shop_name LIKE ? OR shop_phone LIKE ? OR shop_host LIKE ?`;
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