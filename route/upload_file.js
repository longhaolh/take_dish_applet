// router文件
// 这是需要验证token的API接口路由
const express = require('express')
const router = express.Router()
// 导入处理函数模块
const expressJoi = require("@escook/express-joi");
const multer = require('multer'); // 用于处理文件上传
const uniqid = require('uniqid');//生成唯一字符串
const {
    add_dish_schema,
    delete_dish_schema,
    update_dish_schema
} = require('../schema/dish')
const db = require('../utils/dbConnect')
const clear = require('../utils/clearUnlessImg')

// 配置文件上传中间件
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.route.path === '/uploadAvatar' || req.route.path === '/updateAvatar') {
            cb(null, 'uploads/avatar'); // 指定上传文件的存储目录
        } else if (req.route.path === '/uploadLicense') {
            cb(null, 'uploads/license'); // 指定上传文件的存储目录
        } else if (req.route.path === '/uploadBannerList') {
            cb(null, 'uploads/banner'); // 指定上传文件的存储目录
        } else if (req.route.path === '/uploadDishPoster' || req.route.path === '/uploadDishPoster') {
            cb(null, 'uploads/dish'); // 指定上传文件的存储目录
        } else {
            return {message: '未指定的上传路径!'}
        }
    },
    filename: (req, file, cb) => {
        // 生成随机字符串作为文件名
        let randomFileName = uniqid();
        cb(null, `${randomFileName}.${file.mimetype.split('/')[1]}`);

    },
});

const upload = multer({storage: storage});

/**
 * @description 用户上传头像
 */
router.post('/uploadAvatar', upload.single('file'), (req, res) => {
    // 这里的'file'参数对应于前端上传文件的字段名
    if (!req.file) {
        return res.cc('未收到文件');
    }
    const filePath = `http://127.0.0.1:8888/uploads/avatar/${req.file.filename}`
    const sql = `UPDATE users SET avatar=${filePath} WHERE id = ${req.auth.id}`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            // 可以在这里将文件路径保存到数据库，以便后续检索用户头像
            res.status(200).json({status: 0, message: '头像上传完成', avatarUrl: filePath});
        }
    })
});
/**
 * @description 管理员上传头像
 */
router.post('/updateAvatar', upload.single('file'), (req, res) => {
    // 这里的'file'参数对应于前端上传文件的字段名
    if (!req.file) {
        return res.cc('未收到文件');
    }

    const filePath = `http://127.0.0.1:8888/uploads/avatar/${req.file.filename}`
    const sql = `UPDATE users SET avatar='${filePath}' WHERE id = ${req.body.id}`
    db.query(sql, (err, data) => {
        if (err) {
            res.cc(err)
        } else {
            // 可以在这里将文件路径保存到数据库，以便后续检索用户头像
            // 一定要在插入图片文件引用的操作之后执行,不然会先清除文件
            clear.clearImg('avatar', 'users', 'avatar')
            res.status(200).json({status: 0, message: '头像上传完成', avatarUrl: filePath});
        }
    })
});
/**
 * @description 上传营业执照
 */
router.post('/uploadLicense', upload.single('file'), (req, res) => {
    // 这里的'file'参数对应于前端上传文件的字段名
    if (!req.file) {
        return res.cc('未收到文件');
    }
    const filePath = `http://127.0.0.1:8888/uploads/license/${req.file.filename}`
    // 可以在这里将文件路径保存到数据库，以便后续检索用户头像
    res.status(200).json({status: 0, message: '营业执照上传完成', imgUrl: filePath});
});
/**
 * @description 上传海报
 */
router.post('/uploadBannerList', upload.single('file'), (req, res) => {
    // 这里的'file'参数对应于前端上传文件的字段名
    if (!req.file) {
        return res.cc('未收到文件');
    }
    // clear.clearImg('avatar', 'users')
    const filePath = `http://127.0.0.1:8888/uploads/banner/${req.file.filename}`

    // 可以在这里将文件路径保存到数据库，以便后续检索用户头像
    res.status(200).json({status: 0, message: '海报上传完成', imgUrl: filePath});
});
/**
 * @description 上传菜品封面图
 */
router.post('/uploadDishPoster', upload.single('file'), (req, res) => {
    // 这里的'file'参数对应于前端上传文件的字段名
    if (!req.file) {
        return res.cc('未收到文件');
    }
    const filePath = `http://127.0.0.1:8888/uploads/dish/${req.file.filename}`
    // 可以在这里将文件路径保存到数据库，以便后续检索用户头像
    res.status(200).json({status: 0, message: '菜品封面图上传完成', imgUrl: filePath});
});
/**
 * @description 上传菜品详情图
 */
router.post('/uploadDishImgs', upload.single('file'), (req, res) => {
    // 这里的'file'参数对应于前端上传文件的字段名
    if (!req.file) {
        return res.cc('未收到文件');
    }
    // clear.clearImg('avatar', 'users')
    const filePath = `http://127.0.0.1:8888/uploads/dish/${req.file.filename}`

    // 可以在这里将文件路径保存到数据库，以便后续检索用户头像
    res.status(200).json({status: 0, message: '菜品详情图上传完成', imgUrl: filePath});
});
module.exports = router