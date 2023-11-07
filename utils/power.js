/**
 * @description 判断权限
 */
exports.validatePower = (auth, power) => {
    return new Promise((resolve, reject) => {
        if (auth.power >= power) {
            resolve({status: true, message: '权限足够'})
        } else {
            reject({status: false, message: '权限不足!'})
        }
    })
}