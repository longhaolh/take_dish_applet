const db = require('../utils/dbConnect')
/**
 * @author longhao
 * @time 2023年10月21日23:28:38
 * @description 添加菜品
 * @param {number} shop_id 店铺id 必填
 * @param {number} dish_assort 类目id 必填
 * @param {string} dish_name 餐品名称 必填
 * @param {float} dish_price 餐品原价 必填
 * @param {float} dish_discount 餐品折扣 选填
 * @param {string} dish_poster 餐品封面图url 选填
 * @param {string} dish_real_price 餐品实价 自动计算 dish_price * dish_discount
 * @param {array} dish_imgs 餐品橱窗图 选填
 * @param {string} dish_desc 餐品描述 选填
 * @param {number} dish_weight 餐品重量 唯一 必填
 * @param {array} dish_material 餐品原料 选填
 */
exports.addDish = (req, res) => {
    const pm = req.body
    pm.dish_imgs = pm.dish_imgs.replace(/\[|\]/g, "")
    pm.dish_material = pm.dish_material.replace(/\[|\]/g, "")
    console.log(pm)
    const sql = `INSERT INTO dish (shop_id,dish_assort,dish_name,dish_price,dish_discount,dish_poster,dish_real_price,dish_imgs,dish_desc,dish_weight,dish_material) 
VALUES (${pm.shop_id},${pm.dish_assort},'${pm.dish_name}',${(pm.dish_price).toFixed(2)},${pm.dish_discount?pm.dish_discount:1.00},'${pm.dish_poster}',${(pm.dish_price * pm.dish_discount).toFixed(2)},'${pm.dish_imgs?pm.dish_imgs:null}','${pm.dish_desc?pm.dish_desc:'暂时没有商品描述'}',${pm.dish_weight},'${pm.dish_material?pm.dish_material:'尚未添加原料信息'}')`
    console.log(sql)
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            if (data.affectedRows > 0) {
                res.send({status: 0, message: '添加成功'})
            }
        }
    })
}
/**
 * @author longhao
 * @time 2023年10月22日18:23:20
 * @description 根据id删除餐品信息
 * @param {number} shop_id 店铺id 必填
 * @param {string} dish_id 餐品id 必填
 */
exports.deleteDish = (req, res) => {
    const pm = req.body
    const sql = `UPDATE dish SET is_delete = 1 WHERE shop_id = ${pm.shop_id} AND dish_id = ${pm.dish_id}`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            res.send({status: 0, message: '删除完成'})
        }
    })
}

/**
 * @author longhao
 * @time 2023年10月22日19:28:55
 * @description 根据id更新餐品信息
 * @param {number} shop_id 店铺id 必填
 * @param {number} dish_id 餐品id 必填
 * @param {string} dish_name 餐品名称 选填
 * @param {number} dish_price 餐品原价 选填
 * @param {number} dish_discount 餐品折扣 选填
 * @param {string} dish_poster 餐品封面图url 选填
 * @param {array} dish_imgs 餐品橱窗图 选填
 * @param {string} dish_desc 餐品描述 选填
 * @param {number} dish_weight 餐品重量 唯一 选填
 * @param {array} dish_material 餐品原料 选填
 * @param {number} dish_status 餐品状态 选填
 */
exports.updateDish = (req, res) => {
    const pm = req.body
    const qryStr = `SELECT * FROM dish WHERE shop_id = ${pm.shop_id} AND dish_id = ${pm.dish_id} AND is_delete = 0`
    db.query(qryStr, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            if (data[0]) {
                let dish_real_price = 0
                if (pm.dish_price && !pm.dish_discount) {
                    dish_real_price = pm.dish_price * data[0].dish_discount
                } else if (!pm.dish_price && pm.dish_discount) {
                    dish_real_price = data[0].dish_price * pm.dish_discount
                } else if (pm.dish_price && pm.dish_discount) {
                    dish_real_price = pm.dish_price * pm.dish_discount
                } else {
                    dish_real_price = data[0].dish_price * data[0].dish_discount
                }
                const sql = `UPDATE dish SET dish_name = '${pm.dish_name?pm.dish_name:data[0].dish_name}',dish_price = ${pm.dish_price?pm.dish_price:data[0].dish_price},dish_discount = ${pm.dish_discount?pm.dish_discount:data[0].dish_discount},dish_real_price = ${dish_real_price},dish_poster = '${pm.dish_poster?pm.dish_poster:data[0].dish_poster}',dish_imgs = '${pm.dish_imgs?pm.dish_imgs:data[0].dish_imgs}',dish_desc = '${pm.dish_desc?pm.dish_desc:data[0].dish_desc}',dish_weight = ${pm.dish_weight?pm.dish_weight:data[0].dish_weight},dish_material = '${pm.dish_material?pm.dish_material:data[0].dish_material}',dish_status = ${pm.dish_status?pm.dish_status:data[0].dish_status} 
    WHERE shop_id = ${pm.shop_id} AND dish_id = ${pm.dish_id} AND is_delete = 0`
                db.query(sql, (err1, data1) => {
                    if (err1) {
                        res.cc(err1)
                    } else {
                        if (data1.affectedRows > 0) {
                            res.send({status: 0, message: '更新成功'})
                        } else {
                            res.cc('更新失败!')
                        }
                    }
                })
            } else {
                res.cc('餐品已经删除')
            }

        }
    })
}