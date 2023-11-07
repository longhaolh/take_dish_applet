const db = require('../utils/dbConnect')
/**
 * @author longhao
 * @time 2023年10月20日09:59:03
 * @description 添加菜品分类
 * @param {string} assort_name 分类名 必填
 * @param {string} assort_alias 分类别名 必填
 * @param {number} shop_id 店铺id 唯一 必填
 * */
exports.addAssort = (req, res) => {
    const pm = req.body
    const sql = `SELECT * FROM assort WHERE shop_id = ${pm.shop_id} AND (assort_name = '${pm.assort_name}' OR assort_alias = '${pm.assort_alias}')`;
    // 查询shop_id下是否有ssort_name, assort_alias相同值
    db.query(sql, (err1, data1) => {
        if (err1) {
            res.status(500).cc(err1)
        } else {
            if (data1[0]) {
                res.cc('添加失败!分类名或分类别名重复')
            } else {
                db.query("INSERT INTO assort (assort_name,assort_alias,shop_id) VALUES (?,?,?)", [pm.assort_name, pm.assort_alias, pm.shop_id], (err, data) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            const msg = `分类"${pm.assort_name}"或者别名"${pm.assort_alias}"已存在!`
                            res.status(500).cc(msg)
                        } else {
                            res.status(500).cc(err)
                        }
                    } else {
                        res.send({status: 0, message: '添加分类成功'})
                    }
                })
            }
        }
    })

}

/**
 * @author longhao
 * @time 2023年10月20日20:26:00
 * @description 删除类目,req.body入参如下
 * @param {number} id 需要删除的类目id
 * @param {number} shop_id 店铺id
 */
exports.deleteCategory = (req, res) => {
    const pm = req.body
    const sql = `SELECT assort_status FROM assort WHERE assort_id = '${pm.assort_id}'`
    // 查询分类id状态是否为0,为0才可以进行删除操作
    db.query(sql, (err1, data1) => {
        if (err1) {
            res.status(500).cc(err1)
        } else {
            if (data1[0].assort_status === 0) {
                db.query(`UPDATE assort SET assort_status = 1 WHERE shop_id = ${pm.shop_id} AND assort_id = ${pm.assort_id}`, (err, data) => {
                    if (err) {
                        res.status(500).cc(err)
                    } else {
                        res.send({status: 0, message: '删除分类成功'})
                    }
                })
            } else {
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
exports.updateCategory = (req, res) => {
    const pm = req.body;
    const qrysql = `SELECT * FROM shop WHERE shop_id = '${pm.shop_id}' LIMIT 1`;
    // 检查当前登录的用户username是否和店铺管理员账号一致
    db.query(qrysql, (qerr, qdata) => {
        if (qerr) {
            return res.status(500).cc(qerr);
        } else {
            if (qdata[0]) {
                // 查询店铺所有分类
                db.query(`SELECT * FROM assort WHERE shop_id = ${pm.shop_id}`, (qerr1, qdata1) => {
                    if (qerr1) {
                        res.cc(qerr1)
                    } else {
                        if (qdata1.length > 0) {
                            // 判断添加的 assort_name,assort_alias 是否与shop_id下的类目有重复
                            db.query(`SELECT * FROM assort WHERE assort_name = '${pm.assort_name}' OR assort_alias = '${pm.assort_alias}' LIMIT 1`, (qerr2, qdata2) => {
                                if (qerr2) {
                                    res.cc(qdata2)
                                } else {
                                    if (qdata2.length > 0) {
                                        res.cc('类目名称或别名重复,添加失败!')
                                    } else {
                                        db.query(`UPDATE assort SET assort_name = '${pm.assort_name}',assort_alias = '${pm.assort_alias}' WHERE assort_id = ${pm.assort_id} AND shop_id = ${pm.shop_id}`, (err, data) => {
                                            if (err) {
                                                res.cc(err)
                                            } else {
                                                if (data.affectedRows > 0) {
                                                    res.send({status: 0, message: '类目修改成功!'})
                                                } else {
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

            } else {
                res.cc('要修改的店铺不存在')
            }
        }
    });
}
/**
 *
 */