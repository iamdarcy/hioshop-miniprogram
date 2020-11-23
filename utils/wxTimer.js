var wxTimer = function(initObj) {
    initObj = initObj || {};
    this.endTime = initObj.endTime || 0; //开始时间
    this.interval = initObj.interval || 0; //间隔时间
    this.complete = initObj.complete; //结束任务
    this.intervalFn = initObj.intervalFn; //间隔任务
    this.name = initObj.name; //当前计时器在计时器数组对象中的名字
    this.intervarID = initObj.id; //计时ID
    // this.intervarID; //计时ID
}

wxTimer.prototype = {
    //开始
    start: function(self) {
        console.log('倒计时开始');
        let end = this.endTime * 1000;
        let intId = this.intervarID;
        var that = this;
        //开始倒计时
        var count = 0; //这个count在这里应该是表示s数，js中获得时间是ms，所以下面*1000都换成ms
        function begin() {
            var countdown = parseInt((end - new Date().getTime()) / 1000);
            var day = _format(parseInt((end - new Date().getTime()) / 1000 / 60 / 60 / 24));
            // var hour = _format(parseInt((end - new Date().getTime()) / 1000 / 60 / 60 % 24));
            var hour = _format(parseInt((end - new Date().getTime()) / 1000 / 60 / 60 ));
            var minute = _format(parseInt((end - new Date().getTime()) / 1000 / 60 % 60));
            var seconds = _format(parseInt((end - new Date().getTime()) / 1000) % 60);
            var wxTimerList = self.data.wxTimerList;
            console.log(seconds);
            //更新计时器数组
            // console.log(that.name);
            // console.log(
            //     {
            //         wxDay: day,
            //         wxHour: hour,
            //         wxMinute: minute,
            //         wxSeconds: seconds,
            //         wxCountdown: countdown,
            //         wxIntId: intId
            //     }
            // );
            wxTimerList[that.name] = {
                wxDay: day,
                wxHour: hour,
                wxMinute: minute,
                wxSeconds: seconds,
                wxCountdown: countdown,
                wxIntId: intId
            }
            self.setData({
                wxDay: day,
                wxHour: hour,
                wxMinute: minute,
                wxSeconds: seconds,
                countDown: countdown,
                wxTimerList: wxTimerList,
                wxIntId: intId
            });
            //结束执行函数
            if (countdown <= 0) {
                if (that.complete) {
                    that.complete(self);
                    console.log('倒计时结束');
                }
                that.stop(self);
            }
        }
        begin();
        intId = setInterval(begin, 1000);
    },
    //结束
    // stop: function (self) {
    //     let Id = self.data.aTimer
    //     clearInterval(Id);
    // },
    stop: function (self) {
        let name = this.name;
        let timerId = self.data.wxTimerList[name].wxIntId;
        clearInterval(timerId);
    },
    // //校准
    // calibration: function() {
    //     this.endTime = this.endSystemTime - Date.now();
    // }
}

function _format(time) {
    if (time >= 10) {
        return time
    } else {
        return '0' + time
    }
}
module.exports = wxTimer;