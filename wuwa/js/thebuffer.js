const startPeriod = new Date("2024-08-19T17:00:00");
const periodDays = 14;
const currentDate = new Date();

// 计算与当前时间最近的一个未来周期
let periodTime = startPeriod;
while (periodTime < currentDate) {
    periodTime = new Date(periodTime.getTime() + periodDays * 24 * 60 * 60 * 1000);
}

// 定义存储周期的数组
let nextPeriods = [];

// 计算5个周期：前两个周期、当前周期、后两个周期
for (let i = -2; i <= 2; i++) {
    const cycleTime = new Date(periodTime.getTime() + i * periodDays * 24 * 60 * 60 * 1000);
    nextPeriods.push(cycleTime);
}

// 显示下一个周期时间
const nextPeriodTime = nextPeriods[2];  // 中间的是当前周期
document.getElementById("next-period").innerHTML = nextPeriodTime.toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
});

// 显示所有5个周期
let collapsedPeriodsHtml = "";
for (let i = 0; i < nextPeriods.length; i++) {
    const periodId = `period-${i}`;
    const periodName = nextPeriods[i].toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    collapsedPeriodsHtml += `<li id="${periodId}">
        ${periodName}
        <button id="button-${periodId}" onclick="toggleCompletion('${periodName}', '${periodId}')">加载中</button>
    </li>`;
}
document.getElementById("collapsed-periods").innerHTML = collapsedPeriodsHtml;

// 更新剩余时间
const timeDiff = nextPeriodTime - currentDate;

const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

document.getElementById("time-until-next").innerHTML =
    "距离下一次刷新还有：" + days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒";

// 加载完成状态
nextPeriods.forEach((periodTime, i) => {
    const periodId = `period-${i}`;
    const periodName = periodTime.toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    loadCompletionState(periodName, periodId);
});
