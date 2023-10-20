const mysql = require('mysql')
const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'root123',
    database:'mydb'
})

//测试链接
db.query('select 1', (err, res) => {
    if (err) {
        console.log('数据库连接失败!',err.message)
    } else {
         console.log('数据库连接成功!');
    }
})
module.exports = db
