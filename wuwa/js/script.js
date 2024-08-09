function loadRandomBackground() {
    const images = [
        'pic/1.png',
        'pic/2.png',
        'pic/3.png',
        'pic/4.png'
    ];

    // 随机选择一张图片作为背景
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];
    console.log(`Selected Image: ${selectedImage}`);  // 调试输出，检查是否正确选择了图片

    // 检查图片是否加载成功
    const img = new Image();
    img.src = selectedImage;
    img.onload = function() {
        document.body.style.backgroundImage = `url('${selectedImage}')`;
        console.log('Background image loaded successfully.');
    };
    img.onerror = function() {
        console.error('Failed to load background image.');
        document.body.style.backgroundColor = '#333';  // 如果图片加载失败，设置默认背景颜色
    };
}

function calculatePeriods() {
    const startPeriod = new Date("2024-08-19T17:00:00");  // 初始周期时间点
    const periodDays = 14;  // 每个周期的天数
    const currentDate = new Date();  // 当前时间

    // 显示当前时间
    document.getElementById("current-time").innerHTML = currentDate.toLocaleString();

    let nextPeriods = [];
    let periodTime = startPeriod;

    // 计算并找到接下来5个周期的时间
    while (nextPeriods.length < 5) {
        if (periodTime > currentDate) {
            nextPeriods.push(periodTime);
        }
        periodTime = new Date(periodTime.getTime() + periodDays * 24 * 60 * 60 * 1000);
    }

    // 显示接下来的5个周期时间
    let periodsHtml = "";
    for (let i = 0; i < nextPeriods.length; i++) {
        periodsHtml += "<li>" + nextPeriods[i].toLocaleString() + "</li>";
    }
    document.getElementById("next-periods").innerHTML = periodsHtml;

    // 计算距离下一个周期的时间
    const nextPeriodTime = nextPeriods[0];
    const timeDiff = nextPeriodTime - currentDate;

    // 将时间差转换为天、小时、分钟、秒
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // 显示距离下一个周期的时间
    document.getElementById("time-until-next").innerHTML =
        "距离下一次刷新还有：" + days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒";
}

// 页面加载时调用背景加载函数
window.onload = function() {
    loadRandomBackground();
    calculatePeriods();
};

// 每秒更新一次距离下一个周期的时间
setInterval(calculatePeriods, 1000);
