const fs = require('fs');
const db = require('./dbConnect');

/**
 * @description 传入字段名和表名 查询字段名所对应的图片文件 并清除所有没有对应关系的图片文件
 * @param field 含有uploads中文件名称的字段
 * @param tableName 字段对应的表名
 * @param type 图片所在的文件夹
 */
exports.clearImg = (field, tableName, type) => {
    const sql = `SELECT ${field} FROM ${tableName}`;
    db.query(sql, (error, results) => {
        if (error) throw error;
        // 获取有效文件名列表
        const validImageNames = results.map(item => item[field]).filter(e =>
            typeof e === 'string' && e !== ''
        ).map(e => e.split('/')[5]);
        // 读取uploads文件夹中的所有文件
        fs.readdir(`uploads/${type}`, (err, files) => {
            if (err) throw err;
            // 创建一个空的无效文件名列表
            const invalidImageNames = [];
            // 遍历uploads文件夹中的每个文件
            files.forEach((file) => {
                // 检查文件名是否存在于有效文件名列表中
                if (!validImageNames.includes(file)) {
                    // 添加到无效文件名列表
                    invalidImageNames.push(file);
                }
            });
            // console.log('有引用的文件名称', validImageNames, '无引用的文件名称', invalidImageNames, '所有文件', files)
            // 删除无效的图片文件
            invalidImageNames.forEach((fileName) => {
                fs.unlinkSync(`uploads/${type}/${fileName}`);
                console.log(`文件${fileName}没有对应的引用，已被删除`);
            });
        });
    });
};