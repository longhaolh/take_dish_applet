const db = require('../utils/dbConnect')
exports.queryOrderList = (req, res) => {
    const pm = req.body
    const sql = `SELECT * FROM orders WHERE shop_id = ${pm.shop_id} AND is_delete = 0`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            res.send({status: 0, message: '查询成功', list: [...data]})
        }
    })
}