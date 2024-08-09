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
        "距离下一个周期还有：" + days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒";
}

function loadRandomBackground() {
    const picFolder = 'pic/'; // 图片文件夹路径

    // 使用 AJAX 请求文件夹中的图片
    fetch(picFolder)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const imageLinks = Array.from(htmlDoc.querySelectorAll('a'))
                                    .map(a => a.href)
                                    .filter(href => href.match(/\.(jpg|jpeg|png|gif)$/i));

            if (imageLinks.length > 0) {
                const randomIndex = Math.floor(Math.random() * imageLinks.length);
                const selectedImage = imageLinks[randomIndex];
                document.body.style.backgroundImage = `url('${selectedImage}')`;
            } else {
                document.body.style.backgroundColor = '#333'; // 如果没有加载到图片，设置默认背景颜色
            }
        })
        .catch(error => console.error('Error loading images:', error));
}

// 每秒更新一次距离下一个周期的时间
setInterval(calculatePeriods, 1000);

// 页面加载时调用背景加载函数
window.onload = function() {
    calculatePeriods();
    loadRandomBackground();
};
