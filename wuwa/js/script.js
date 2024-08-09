function loadRandomBackground() {
    const images = [
        'pic/1.png',
        'pic/2.png',
        'pic/3.png',
        'pic/4.png'
    ];

    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];
    console.log(`Selected Image: ${selectedImage}`);

    const img = new Image();
    img.src = selectedImage;
    img.onload = function() {
        document.body.style.backgroundImage = `url('${selectedImage}')`;
        console.log('Background image loaded successfully.');
    };
    img.onerror = function() {
        console.error('Failed to load background image.');
        document.body.style.backgroundColor = '#333';
    };
}

function calculatePeriods() {
    const startPeriod = new Date("2024-08-19T17:00:00");
    const periodDays = 14;
    const currentDate = new Date();

    // 设置24小时制的时间格式选项
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false  // 24小时制
    };

    // 显示当前时间
    document.getElementById("current-time").innerHTML = currentDate.toLocaleString(undefined, options);

    let nextPeriods = [];
    let periodTime = startPeriod;

    while (nextPeriods.length < 5) {
        if (periodTime > currentDate) {
            nextPeriods.push(periodTime);
        }
        periodTime = new Date(periodTime.getTime() + periodDays * 24 * 60 * 60 * 1000);
    }

    // 显示最近的一个周期时间
    const nextPeriodTime = nextPeriods[0];
    document.getElementById("next-period").innerHTML = nextPeriodTime.toLocaleString(undefined, options);

    // 折叠显示其余的周期时间
    let collapsedPeriodsHtml = "";
    for (let i = 1; i < nextPeriods.length; i++) {
        collapsedPeriodsHtml += "<li>" + nextPeriods[i].toLocaleString(undefined, options) + "</li>";
    }
    document.getElementById("collapsed-periods").innerHTML = collapsedPeriodsHtml;

    // 计算距离下一个周期的时间
    const timeDiff = nextPeriodTime - currentDate;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById("time-until-next").innerHTML =
        "距离下一次刷新还有：" + days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒";
}

// 展开/折叠功能
function toggleCollapse() {
    const collapseElement = document.getElementById("collapsed-periods");
    const toggleButton = document.getElementById("toggle-button");
    if (collapseElement.style.display === "none") {
        collapseElement.style.display = "block";
        toggleButton.innerHTML = "折叠";
    } else {
        collapseElement.style.display = "none";
        toggleButton.innerHTML = "显示剩余刷新时间";
    }
}

window.onload = function() {
    loadRandomBackground();
    calculatePeriods();
    document.getElementById("collapsed-periods").style.display = "none"; // 初始折叠状态
};

// 每秒更新一次距离下一个周期的时间
setInterval(calculatePeriods, 1000);
