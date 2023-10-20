const db = require('../utils/dbConnect')
/**
 * @author longhao
 * @time 2023年10月20日09:59:03
 * @description 添加菜品分类
 * @param {string} assort_name 分类名 必填
 * @param {string} assort_alias 分类别名 必填
 * @param {number} shop_id 店铺id 唯一 必填
* */
exports.addAssort = (req,res)=>{
    const pm = req.body
    const sql = `SELECT * FROM assort WHERE shop_id = ${pm.shop_id} LIMIT 1;`
    // 查询shop_id下是否有ssort_name, assort_alias相同值
    db.query(sql,(err1,data1)=>{
        if(err1){
            res.status(500).cc(err1)
        }else{
            if(data1[0]){
                res.cc('添加失败!分类名或分类别名重复')
            }else{
                db.query("INSERT INTO assort (assort_name,assort_alias,shop_id) VALUES (?,?,?)",[pm.assort_name,pm.assort_alias,pm.shop_id],(err,data)=>{
                    if(err){
                        if(err.code==='ER_DUP_ENTRY'){
                            const  msg = `分类"${pm.assort_name}"或者别名"${pm.assort_alias}"已存在!`
                            res.status(500).cc(msg)
                        }else{
                            res.status(500).cc(err)
                        }
                    }else{
                        res.send({status:0,message:'添加分类成功'})
                    }
                })
            }
        }
    })

}
/**
 * @author longhao
 * @time 2023年10月20日10:06:52
 * @description 添加店铺接口,req.body入参如下
 * @param {number} shop_name 店铺名称 必填,不可重复
 * @param {string} shop_address 店铺地址 必填
 * @param {string} shop_host 店铺负责人姓名 必填
 * @param {string} shop_phone 店铺联系电话 必填
 * @param {string} shop_admin 店铺管理账号 (当前登录账号)
 */
exports.addShop = (req,res)=>{
    const pm = req.body
    const sql1 = `SELECT * FROM shop WHERE shop_name = '${pm.shop_name}'`
    const sql = `INSERT INTO shop (shop_name,shop_address,shop_host,shop_phone,shop_admin) VALUES ('${pm.shop_name}','${pm.shop_address}','${pm.shop_host}','${pm.shop_phone}','${req.auth.username}')`
    // 先查询店铺名称是否已经存在,再执行插入操作,防止主键自增
    db.query(sql1,(err1,data1)=>{
        if(err1){
            res.status(500).cc(err1)
        }else{
            // data1.length>0说明有重复名称
            if(data1.length>0){
                res.cc(`添加失败!店铺名称 ${pm.shop_name} 已存在!`)
            }else{
                db.query(sql,(err,data)=>{
                    if(err){
                        if(err.code==='ER_DUP_ENTRY'){
                            const  msg = `更新失败!联系电话重复!`
                            res.status(500).cc(msg)
                        }else{
                            res.status(500).cc(err)
                        }
                    }else{
                        res.send({status:0,message:'添加店铺成功'})
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
            if(qdata[0]){
                // 检查传入的字段是否为空
                if (!pm.shop_name && !pm.shop_address && !pm.shop_host && !pm.shop_phone) {
                    return res.status(400).cc('至少需要填写一个字段');
                }
                // 创建一个更新语句的字符串，如果传入的字段为空则插入原字段值
                const updateStatement = `UPDATE shop SET shop_name = '${pm.shop_name?pm.shop_name:qdata[0].shop_name}', shop_address = '${pm.shop_address?pm.shop_address:qdata[0].shop_address}', shop_host = '${pm.shop_host?pm.shop_host:qdata[0].shop_host}', shop_phone = '${pm.shop_phone?pm.shop_phone:qdata[0].shop_phone}' WHERE shop_id = '${pm.shop_id}'`;
                if (qdata[0].shop_admin === req.auth.username) {
                    db.query(updateStatement, (err, data) => {
                        if (err) {
                            if(err.code==='ER_DUP_ENTRY'){
                                const  msg = `更新失败!店铺名称重复!`
                                res.status(500).cc(msg)
                            }else{
                                res.status(500).cc(err)
                            }
                        } else {
                            return res.send({ status: 0, message: '修改成功' });
                        }
                    });
                } else {
                    return res.send({ status: -1, message: `当前登录账号 ${req.auth.username} 没有权限对店铺 ${qdata[0].shop_name} 进行此操作` });
                }
            }else{
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
            if(qdata[0]){
                if(qdata[0].shop_status===3){
                    res.cc('注销店铺失败!该店铺已经注销!')
                    return
                }
                // 将注销信息写入shut_shop表
                db.query(sql2,(err,data)=>{
                    if(err){
                        res.cc(err)
                    }else{
                        // 更新shop表中的状态
                        db.query(sql,(err1,data1)=>{
                            if(err1){
                                res.cc(err1)
                            }else{
                                console.log(data1)
                                res.send({status:0,message:'店铺注销成功'})
                            }
                        })
                    }
                })
            }else{
                res.cc('要删除的店铺不存在')
            }
        }
    });
    // 系统注销
    if(req.auth.username==='system'){
        res.cc('系统注销')
    }
}
/**
 * @author longhao
 * @time 2023年10月20日20:26:00
 * @description 删除类目,req.body入参如下
 * @param {number} id 需要删除的类目id
 * @param {number} shop_id 店铺id
 */
exports.deleteCategory = (req,res)=>{
        const pm = req.body
        const sql = `SELECT assort_status FROM assort WHERE assort_id = '${pm.assort_id}'`
        // 查询分类id状态是否为0,为0才可以进行删除操作
        db.query(sql,(err1,data1)=>{
            if(err1){
                res.status(500).cc(err1)
            }else{
                if(data1[0].assort_status === 0){
                    db.query(`UPDATE assort SET assort_status = 1 WHERE shop_id = ${pm.shop_id} AND assort_id = ${pm.assort_id}`,(err,data)=>{
                        if(err){
                            res.status(500).cc(err)
                        }else{
                            res.send({status:0,message:'删除分类成功'})
                        }
                    })
                }else{
                    res.cc(`删除失败!分类不存在`)
                }

            }
        })

}
/**
 * @author longhao
 * @time 2023年10月20日22:05:42
 * @description 删除类目,req.body入参如下
 * @param {number} id 需要修改的类目id 必填
 * @param {number} shop_id 店铺id 必填
 * @param {string} assort_name 类目名称 必填
 * @param {string} assort_alias 类目别名 必填
 */
exports.updateCategory = (req,res)=>{
    const pm = req.body;
    const qrysql = `SELECT * FROM shop WHERE shop_id = '${pm.shop_id}' LIMIT 1`;
    // 检查当前登录的用户username是否和店铺管理员账号一致
    db.query(qrysql, (qerr, qdata) => {
        if (qerr) {
            return res.status(500).cc(qerr);
        } else {
            if(qdata[0]){
                // 查询店铺所有分类
                db.query(`SELECT * FROM assort WHERE shop_id = ${pm.shop_id}`,(qerr1,qdata1)=>{
                    if(qerr1){
                        res.cc(qerr1)
                    }else{
                        if(qdata1.length>0){
                            // 判断添加的 assort_name,assort_alias 是否与shop_id下的类目有重复
                            db.query(`SELECT * FROM assort WHERE assort_name = '${pm.assort_name}' OR assort_alias = '${pm.assort_alias}' LIMIT 1`,(qerr2,qdata2)=>{
                                if(qerr2){
                                    res.cc(qdata2)
                                }else{
                                    if(qdata2.length>0){
                                        res.cc('类目名称或别名重复,添加失败!')
                                    }else{
                                        db.query(`UPDATE assort SET assort_name = '${pm.assort_name}',assort_alias = '${pm.assort_alias}' WHERE assort_id = ${pm.assort_id} AND shop_id = ${pm.shop_id}`,(err,data)=>{
                                            if(err){
                                                res.cc(err)
                                            }else{
                                                if(data.affectedRows>0){
                                                    res.send({status:0,message:'类目修改成功!'})
                                                }else{
                                                    res.cc('类目修改失败')
                                                }
                                            }
                                        })
                                    }
                                }
                            })

                        }
                    }
                })

            }else{
                res.cc('要修改的店铺不存在')
            }
        }
    });
}