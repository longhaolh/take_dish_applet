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
const { expressjwt: jwt } = require("express-jwt");
// 导入全局配置文件
const config = require('./config')

// 注册跨域中间件
app.use(cors())
// 调用解析数据模块来解析post请求中的请求体  必须在api接口前面调用 否则无法解析
app.use(express.json()).use(express.urlencoded());
// 用来处理错误响应数据的中间件
app.use((req,res,next)=>{
    // status  0成功 -1失败 默认为-1
    res.cc = (err,status = -1) => {
        res.send({
            status,
            message:err instanceof Error ? err.message:err
        })
    }
    next()
})

// 解析token的中间件必须在路由之前配置,unless配置所有/api前缀的接口均不需要进行token验证
app.use(
    jwt({secret:config.jwtSecrtKey,algorithms:['HS256']}).unless({path:[/^\/api/]})
)

// 注册无需token的路由模块为全局中间件 并添加/api前缀
app.use('/api',user_no_power).use('/api',dish_no_power).use('/api',category_no_power)
// 注册需要token的路由模块为全局中间件 并添加/verify前缀
app.use('/verify',user_power).use('/verify',dish_power).use('/verify',category_power)
// 定义一个错误中间件来捕获全局的程序错误 它有四个参数err,req,res,next  错误中间件必须在所有路由之后定义
app.use((err, req, res, next) => {
    // 验证错误
    if(err instanceof joi.ValidationError){
        res.cc('入参验证失败！'+err)
    }else if(err.name === 'UnauthorizedError'){
        res.cc('token已失效')
    }else{
        // 未知错误
        res.cc(err)
    }
    next()
})

app.listen(port,() => {
    console.log(`app is running at http://127.0.0.1:${port}`)
})