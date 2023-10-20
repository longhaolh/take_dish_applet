const db = require('../utils/dbConnect')

/**
 * @author longhao
 * @time 2023年10月20日15:31:39
 * @description 查询店铺信息,req.body入参如下
 * @param {number} shop_id 店铺id,必传
 * */
exports.queryShop = (req,res)=>{
    const pm = req.query
    const sql = `SELECT * FROM shop WHERE shop_id = '${pm.shop_id}'`
    db.query(sql,(err,data)=>{
        if(err){
            res.cc(err)
        }else{
            if(data.length>0){
                  delete data[0].shop_admin
                res.send({status:0,message:'查询成功',data:{shop_info:data[0]}})
            }else{
                res.cc('没有该店铺信息')
            }
        }
    })
}
/**
 * @author longhao
 * @time 2023年10月20日23:46:02
 * @description 查询店铺的所有类目信息,req.body入参如下
 * @param {number} shop_id 店铺id,必传
 */
exports.queryAssort = (req,res)=>{
    const pm = req.query
    const sql = `SELECT * FROM assort WHERE shop_id = '${pm.shop_id}' AND assort_status = 0 LIMIT 1000`
    db.query(sql,(err,data)=>{
        if(err){
            res.cc(err)
        }else{
            if(data.length>0){
                res.send({status:0,message:'查询成功',data:{assort_info:data}})
            }else{
                res.cc('没有分类信息')
            }
        }
    })
}