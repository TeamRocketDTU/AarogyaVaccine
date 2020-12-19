const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function genRandomString(length) {
    let buff = []
    while (buff.length < length) {
        const charCode = parseInt(Math.random() * (36))
        buff.push(ALPHANUMERIC.charAt(charCode))
    }
    return buff.join('')
}

module.exports = {
    genRandomString
}