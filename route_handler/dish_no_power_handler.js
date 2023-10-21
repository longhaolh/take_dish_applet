const db = require('../utils/dbConnect')

/**
 * @author longhao
 * @time 2023年10月22日01:36:15
 * @description 查询所有餐品信息,req.body入参如下
 * @param {number} shop_id 店铺id,必传
 * */
exports.queryDish = (req, res) => {
    const pm = req.query
    const sql = `SELECT * FROM dish WHERE dish_assort = ${pm.dish_assort} AND shop_id = ${pm.shop_id}`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            console.log(data)
            res.send({status: 0, message: '查询成功', list: [...data]})
        }
    })
}
