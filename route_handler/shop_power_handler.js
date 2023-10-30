// handle文件
const db = require('../utils/dbConnect')
/**
 * @author longhao
 * @time 2023年10月20日23:58:31
 * @description 添加菜品
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
    const sql = ``
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            res.send('ok')
        }
    })
}