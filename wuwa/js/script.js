import { get, set } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

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

    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    document.getElementById("current-time").innerHTML = currentDate.toLocaleString(undefined, options);

    let nextPeriods = [];
    let periodTime = startPeriod;

    while (nextPeriods.length < 5) {
        if (periodTime > currentDate) {
            nextPeriods.push(periodTime);
        }
        periodTime = new Date(periodTime.getTime() + periodDays * 24 * 60 * 60 * 1000);
    }

    const nextPeriodTime = nextPeriods[0];
    document.getElementById("next-period").innerHTML = nextPeriodTime.toLocaleString(undefined, options);

    let collapsedPeriodsHtml = "";
    for (let i = 0; i < nextPeriods.length; i++) {
        const periodId = `period-${i}`;
        const periodName = nextPeriods[i].toLocaleString(undefined, options); // 使用周期时间作为名称
        collapsedPeriodsHtml += `<li id="${periodId}">
            ${periodName}
            <button id="button-${periodId}" onclick="toggleCompletion('${periodName}', '${periodId}')">加载中</button>
        </li>`;
    }
    document.getElementById("collapsed-periods").innerHTML = collapsedPeriodsHtml;

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
        const periodName = periodTime.toLocaleString(undefined, options);
        loadCompletionState(periodName, periodId);
    });
}

function loadCompletionState(periodName, periodId) {
    const button = document.getElementById(`button-${periodId}`);
    const periodRef = window.firebaseRef(window.firebaseDatabase, 'periods/' + periodName);

    get(periodRef).then(snapshot => {
        if (snapshot.exists()) {
            const status = snapshot.val();
            updateButton(periodId, status);
        } else {
            console.log(`No data available for ${periodName}. Creating default state.`);
            // 如果不存在，创建一个默认状态
            set(periodRef, false).then(() => {
                updateButton(periodId, false); // 默认未完成
            }).catch(error => {
                console.error("Error creating default state:", error);
            });
        }
    }).catch(error => {
        console.error("Error loading completion state:", error);
        updateButton(periodId, false); // 处理错误时默认未完成
    });
}

function toggleCompletion(periodName, periodId) {
    const periodRef = window.firebaseRef(window.firebaseDatabase, 'periods/' + periodName);

    get(periodRef).then(snapshot => {
        if (snapshot.exists()) {
            const currentStatus = snapshot.val();
            const newStatus = !currentStatus;
            set(periodRef, newStatus).then(() => {
                updateButton(periodId, newStatus);
            }).catch(error => {
                console.error("Error updating completion state:", error);
            });
        } else {
            console.log(`No data available for ${periodName}.`);
        }
    }).catch(error => {
        console.error("Error toggling completion state:", error);
    });
}

function updateButton(periodId, status) {
    const button = document.getElementById(`button-${periodId}`);
    if (status) {
        button.textContent = "已完成";
    } else {
        button.textContent = "未完成";
    }
}

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

window.toggleCollapse = toggleCollapse; // 让函数在全局作用域中可用
window.toggleCompletion = toggleCompletion; // 让函数在全局作用域中可用

window.onload = function() {
    loadRandomBackground();
    calculatePeriods();
    document.getElementById("collapsed-periods").style.display = "none"; // 初始折叠状态
};

// 每秒更新一次距离下一个周期的时间
setInterval(calculatePeriods, 1000);
