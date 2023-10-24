const express = require('express')
// 导入跨域中间件
const cors = require('cors')
const port = 8888
const app = express()
const user_no_power = require('./route/user_no_power')
const user_power = require('./route/user_power')
const category_no_power = require('./route/category_no_power')
const category_power = require('./route/category_power')
const dish_no_power = require('./route/dish_no_power')
const dish_power = require('./route/dish_power')
const joi = require('joi')
// 导入解析token的包
const {expressjwt: jwt} = require("express-jwt");
// 导入全局配置文件
const config = require('./config')
const multer = require('multer'); // 用于处理文件上传
const uniqid = require('uniqid');//生成唯一字符串
// 注册跨域中间件
app.use(cors())
// 调用解析数据模块来解析post请求中的请求体  必须在api接口前面调用 否则无法解析
app.use(express.json()).use(express.urlencoded());
// 用来处理错误响应数据的中间件
app.use((req, res, next) => {
    // status  0成功 -1失败 默认为-1
    res.cc = (err, status = -1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
// 配置静态资源托管
app.use('/uploads', express.static('uploads/'));
// 解析token的中间件必须在路由之前配置,unless配置所有/api前缀的接口均不需要进行token验证
app.use(
    jwt({secret: config.jwtSecrtKey, algorithms: ['HS256']}).unless({
        path: [/\/api|\/uploads/]
    })
)

// 注册无需token的路由模块为全局中间件 并添加/api前缀
app.use('/api', user_no_power).use('/api', dish_no_power).use('/api', category_no_power)
// 注册需要token的路由模块为全局中间件 并添加/verify前缀
app.use('/verify', user_power).use('/verify', dish_power).use('/verify', category_power)

// 配置文件上传中间件
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 指定上传文件的存储目录
    },
    filename: (req, file, cb) => {
        // 生成随机字符串作为文件名
        let randomFileName = uniqid();
        cb(null, `avatar_${randomFileName}.${file.mimetype.split('/')[1]}`);
    },
});

const upload = multer({storage: storage});

// 处理文件上传请求
app.post('/verify/uploadAvatar', upload.single('file'), (req, res) => {
    // 这里的'file'参数对应于前端上传文件的字段名
    if (!req.file) {
        return res.cc('未收到文件');
    }
    const filePath = `http://127.0.0.1:${port}/uploads/${req.file.filename}`
    // 可以在这里将文件路径保存到数据库，以便后续检索用户头像
    res.status(200).json({status: 0, message: '头像上传完成', avatarUrl: filePath});
});
// 定义一个错误中间件来捕获全局的程序错误 它有四个参数err,req,res,next  错误中间件必须在所有路由之后定义
app.use((err, req, res, next) => {
    // 验证错误
    if (err instanceof joi.ValidationError) {
        res.cc('入参验证失败！' + err)
    } else if (err.name === 'UnauthorizedError') {
        res.cc('token已失效')
    } else {
        // 未知错误
        res.cc(err)
    }
    next()
})
app.listen(port, () => {
    console.log(`app is running at http://127.0.0.1:${port}`)
})