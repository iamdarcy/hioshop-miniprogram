function reTime(time, timeId, that) {
    let endTime = time * 1000;
    that.setData({
        [timeId]: {
            day: _format(parseInt((endTime - new Date().getTime()) / 1000 / 60 / 60 / 24)),
            hour: _format(parseInt((endTime - new Date().getTime()) / 1000 / 60 / 60 % 24)),
            minute: _format(parseInt((endTime - new Date().getTime()) / 1000 / 60 % 60)),
        }
    })
}

function _format(time) {
    if (time >= 10) {
        return time
    } else {
        return '0' + time
    }
}

module.exports = {
    reTime
}