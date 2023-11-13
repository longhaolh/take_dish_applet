const db = require('../utils/dbConnect')


/**
 * @author longhao
 * @time 2023年10月20日23:46:02
 * @description 查询店铺的所有类目信息,req.body入参如下
 * @param {number} shop_id 店铺id,必传
 */
exports.queryAssort = (req, res) => {
    const pm = req.query
    const sql = `SELECT * FROM assort WHERE shop_id = '${pm.shop_id}' AND assort_status = 0 LIMIT 1000`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            const defaultArr = [
                // 定义两个默认分类 "全部"和"热销"  全部返回所有商品  热销返回销量前十的商品
                {assort_id: 0, assort_alias: 'all', assort_name: '全部'},
                {
                    assort_id: -1,
                    assort_alias: 'hot',
                    assort_name: '热销'
                }]
            if (data.length > 0) {
                res.send({status: 0, message: '查询成功', list: [defaultArr.concat(...data)]})
            } else {
                res.send({status: 0, message: '查询成功', list: [defaultArr]})
            }
        }
    })
}