// 导入验证规则对象
const joi = require('joi');
const dish_id = joi.number().required()
const shop_id = joi.number().required()
const dish_assort = joi.required()
const dish_name = joi.string().min(1).max(20)
const dish_price = joi.number().min(0)
const dish_discount = joi.number().min(0).max(1)
const dish_poster = joi.string()
const dish_imgs = joi.string().allow('', null)
const dish_desc = joi.string().allow(null, '')
const dish_weight = joi.string()
const dish_material = joi.string().allow(null, '')
const dish_status = joi.number()
const is_delete = joi.number()
const order = joi.string().required()
// 添加餐品
exports.add_dish_schema = {
    body: {
        shop_id,
        dish_assort,
        dish_name: dish_name.required(),
        dish_price: dish_price.required(),
        dish_discount,
        dish_poster: dish_poster.required(),
        dish_imgs,
        dish_desc,
        dish_weight: dish_weight.required(),
        dish_material
    }
}
// 删除餐品
exports.delete_dish_schema = {
    body: {
        shop_id,
        dish_id,
        is_delete
    }
}
// 更新餐品
exports.update_dish_schema = {
    body: {
        shop_id,
        dish_id,
        dish_name: dish_name.allow('', null),
        dish_price: dish_price.allow('', null),
        dish_discount: dish_discount.allow('', null),
        dish_poster: dish_poster.allow('', null),
        dish_imgs: dish_imgs.allow('', null),
        dish_desc,
        dish_weight: dish_weight.allow('', null),
        dish_material,
        dish_status
    }
}
// 查询所有餐品信息
exports.query_dish_schema = {
    query: {
        shop_id,
        dish_assort
    }
}
// 查询餐品详情
exports.query_dish_detail_schema = {
    query: {
        shop_id,
        order
    }
}