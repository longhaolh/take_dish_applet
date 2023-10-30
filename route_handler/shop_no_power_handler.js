// handle文件
const db = require('../utils/dbConnect')
/**
 * @author longhao
 * @time 2023年10月20日23:58:31
 * @description 添加菜品
 * @param {string} assort_name 分类名 必填
 */
exports.addDish = (req, res) => {
    const pm = req.body
    const sql = ``
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            res.send('ok')
        }
    })
}