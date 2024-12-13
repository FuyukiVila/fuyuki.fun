function secondToDate(second) {
    if (!second) {
        return [0, 0, 0, 0, 0];
    }
    let remainingSeconds = second;
    const time = [0, 0, 0, 0, 0];

    if (remainingSeconds >= 365 * 24 * 3600) {
        time[0] = Math.floor(remainingSeconds / (365 * 24 * 3600));
        remainingSeconds %= 365 * 24 * 3600;
    }
    if (remainingSeconds >= 24 * 3600) {
        time[1] = Math.floor(remainingSeconds / (24 * 3600));
        remainingSeconds %= 24 * 3600;
    }
    if (remainingSeconds >= 3600) {
        time[2] = Math.floor(remainingSeconds / 3600);
        remainingSeconds %= 3600;
    }
    if (remainingSeconds >= 60) {
        time[3] = Math.floor(remainingSeconds / 60);
        remainingSeconds %= 60;
    }
    if (remainingSeconds > 0) {
        time[4] = remainingSeconds;
    }
    return time;
};

function setTime() {
    // 博客创建时间秒数，时间格式中，月比较特殊，是从0开始的，所以想要显示5月，得写4才行，如下
    const create_time = Math.round(new Date(Date.UTC(2024, 11, 9, 0, 0, 0)).getTime() / 1000); // 当前时间秒数,增加时区的差异
    const timestamp = Math.round((new Date().getTime() + 8 * 60 * 60 * 1000) / 1000);
    const currentTime = secondToDate((timestamp - create_time));
    if (currentTime[0] === 0) {
        const currentTimeHtml = `${currentTime[1]}天${currentTime[2]}时${currentTime[3]}分${currentTime[4]}秒`;
    } else {
        const currentTimeHtml = `${currentTime[0]}年${currentTime[1]}天${currentTime[2]}时${currentTime[3]}分${currentTime[4]}秒`;
    }
    // 兼容pjax，当htmer_time存在时输出，否则清空计时器
    if (document.getElementById("htmer_time")) {
        document.getElementById("htmer_time").innerHTML = currentTimeHtml;
    } else {
        clearInterval(timer);
    }
}

const timer = setInterval(setTime, 1000);