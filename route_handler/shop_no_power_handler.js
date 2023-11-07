// handle文件
const db = require('../utils/dbConnect')
const power = require('../utils/power')

/**
 * @description 获取所有店铺列表 power>=2
 * @param req
 * @param res
 */
exports.getAllShop = (req, res) => {
    power.validatePower(req.auth, 2).then(result => {
        const sql = `SELECT * FROM shop`
        db.query(sql, (err, data) => {
            if (err) {
                res.cc(err)
            } else {
                res.send({status: 0, message: "查询成功", data: [...data]})
            }
        })
    }).catch(error => {
        res.cc(error.message)
    })

}
/**
 * @author longhao
 * @time 2023年10月20日15:31:39
 * @description 查询店铺信息,req.body入参如下
 * @param {number} shop_id 店铺id,必传
 * */
exports.queryShop = (req, res) => {
    const pm = req.query
    const sql = `SELECT * FROM shop WHERE shop_id = '${pm.shop_id}'`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            if (data.length > 0) {
                delete data[0].shop_admin
                res.send({status: 0, message: '查询成功', list: [...data]})
            } else {
                res.cc('没有该店铺信息')
            }
        }
    })
}