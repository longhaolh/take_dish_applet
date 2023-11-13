const db = require('../utils/dbConnect')

/**
 * @author longhao
 * @time 2023年10月22日01:36:15
 * @description 查询所有餐品信息,req.body入参如下
 * @param {number} shop_id 店铺id,必传
 * */
exports.queryDish = (req, res) => {
    const pm = req.query
    let sql = ``
    pm.dish_assort = +pm.dish_assort
    if (pm.dish_assort > 0) {
        sql = `SELECT * FROM dish WHERE dish_assort = ${pm.dish_assort} AND shop_id = ${pm.shop_id} AND is_delete = 0 LIMIT 1000`
    } else if (pm.dish_assort === 0) {
        // 返回全部商品
        sql = `SELECT * FROM dish WHERE shop_id = ${pm.shop_id} LIMIT 1000`
    } else {
        // 返回销量前十的商品
        sql = `SELECT * FROM dish ORDER BY dish_sales DESC LIMIT 10`
    }
    // console.log(sql, pm.dish_assort)
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            if (pm.dish_assort === 0 || pm.dish_assort === -1) {
                // 根据商品名称进行去重
                const uniqueDishes = [];
                const dishNamesSet = new Set();

                for (const dish of data) {
                    if (!dishNamesSet.has(dish.dish_name)) {
                        uniqueDishes.push(dish);
                        dishNamesSet.add(dish.dish_name);
                    }
                }
                res.send({status: 0, message: '查询成功', list: [...uniqueDishes]})
            } else {
                res.send({status: 0, message: '查询成功', list: [...data]})
            }
        }
    })
}
/**
 * @description 根据id查询餐品信息
 * @param {number} shop_id 店铺id 必填
 * @param {number} dish_id 餐品id 必填
 */
exports.queryDishDetail = (req, res) => {
    const pm = req.query
    const order = JSON.parse(pm.order)
    let arr = []
    order.forEach(e => {
        const sql = `SELECT * FROM dish WHERE shop_id = ${pm.shop_id} AND dish_id = ${e.dish_id} AND is_delete = 0`
        db.query(sql, (err, data) => {
            if (err) {
                res.cc(err)
            } else {
                if (data[0]) {
                    data[0].dish_count = e.dish_count
                    data[0].dish_total_price = e.dish_count * (data[0].dish_real_price > 0 ? data[0].dish_real_price : data[0].dish_price)
                    arr.push(data[0])
                } else {
                    res.cc('没有该餐品信息')
                }
            }
        })
    })
    setTimeout(() => {
        res.send({status: 0, message: '查询成功', list: [...arr]})
    }, 30)

}