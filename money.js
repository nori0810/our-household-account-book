const form = document.querySelector(".info");

const moneyList =
    document.querySelector("#money-list");

const deleteModeButton =
    document.querySelector("#delete-mode");

const editModeButton =
    document.querySelector("#edit-mode");

const currentUser =
    localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "login.html";
}


const moneyForm =
    document.querySelector("#form");

const moneyInput =
    document.querySelector("#money-input");

const totalMoney =
    document.querySelector("#totalmoney");

const useMoney =
    document.querySelector("#usemoney");

const moneyLeft =
    document.querySelector("#money-left");

const useMoneyLabel =
    document.querySelector("#use-money-label");

const currentMonthElement =
    document.querySelector("#current-month");

const historyTitle =
    document.querySelector("#history-title");

const prevMonthButton =
    document.querySelector("#prev-month");

const nextMonthButton =
    document.querySelector("#next-month");

const todayMonthButton =
    document.querySelector("#today-month");


const editSection =
    document.querySelector("#edit-section");

const editDetails =
    document.querySelector("#edit-details");

const editMoney =
    document.querySelector("#edit-money");

const editDate =
    document.querySelector("#edit-date");

const editSave =
    document.querySelector("#edit-save");

const editCancel =
    document.querySelector("#edit-cancel");

const logoutButton =
    document.querySelector("#logout-button");


let deleteMode = false;

let editMode = false;

let editTarget = null;


const moneyData = {

    initialMoney: 0,

    food: {
        total: 0,
        details: []
    },

    "travel-cost": {
        total: 0,
        details: []
    },

    "house-money": {
        total: 0,
        details: []
    },

    "hang out": {
        total: 0,
        details: []
    },

    other: {
        total: 0,
        details: []
    }

};


const typeLabels = {

    food: "🍚 食事",

    "travel-cost": "🚃 移動費",

    "house-money": "🏠 家賃",

    "hang out": "🏞 遊び",

    other: "🌷 その他"

};


const storageKey =
    `moneyData_${currentUser}`;


const savedData =
    localStorage.getItem(storageKey);


if (savedData) {

    try {

        const loadedData =
            JSON.parse(savedData);


        moneyData.initialMoney =
            Number(loadedData.initialMoney) || 0;


        for (
            const key of Object.keys(typeLabels)
        ) {

            if (
                loadedData[key] &&
                typeof loadedData[key] === "object"
            ) {

                moneyData[key].total =
                    Number(loadedData[key].total) || 0;


                moneyData[key].details =
                    Array.isArray(
                        loadedData[key].details
                    )
                        ? loadedData[key].details
                        : [];

            }

        }

    } catch (error) {

        localStorage.removeItem(storageKey);

    }

}


function saveData() {

    localStorage.setItem(
        storageKey,
        JSON.stringify(moneyData)
    );

}


function getToday() {

    const today =
        new Date();

    return today;

}


let selectedMonth = new Date();


function getMonthKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    return `${year}-${month}`;

}


function getMonthLabel(date) {

    return `${date.getFullYear()}年${
        date.getMonth() + 1
    }月`;

}


function isSameMonth(dateString, date) {

    if (!dateString) {
        return false;
    }


    const parts =
        dateString.split("-");


    if (parts.length < 2) {
        return false;
    }


    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]);


    return (
        year === date.getFullYear() &&
        month === date.getMonth() + 1
    );

}


function getMonthlyDetails() {

    const result = [];


    for (
        const key of Object.keys(typeLabels)
    ) {

        moneyData[key].details.forEach(
            function(item, index) {

                if (
                    isSameMonth(
                        item.date,
                        selectedMonth
                    )
                ) {

                    result.push({

                        key: key,

                        index: index,

                        item: item

                    });

                }

            }
        );

    }


    return result;

}


function getMonthlyTotal() {

    let total = 0;


    for (
        const key of Object.keys(typeLabels)
    ) {

        moneyData[key].details.forEach(
            function(item) {

                if (
                    isSameMonth(
                        item.date,
                        selectedMonth
                    )
                ) {

                    total +=
                        Number(item.amount) || 0;

                }

            }
        );

    }


    return total;

}


function getAllTimeSpent() {

    let total = 0;


    for (
        const key of Object.keys(typeLabels)
    ) {

        moneyData[key].details.forEach(
            function(item) {

                total +=
                    Number(item.amount) || 0;

            }
        );

    }


    return total;

}


function getMonthlyCategoryTotal(key) {

    let total = 0;


    moneyData[key].details.forEach(
        function(item) {

            if (
                isSameMonth(
                    item.date,
                    selectedMonth
                )
            ) {

                total +=
                    Number(item.amount) || 0;

            }

        }
    );


    return total;

}


function renderMonth() {

    const label =
        getMonthLabel(selectedMonth);


    currentMonthElement.textContent =
        label;


    historyTitle.textContent =
        `${label}の支出`;


    useMoneyLabel.textContent =
        `💸 ${label}の使用金額`;

}


function renderBalance() {

    const monthlyTotal =
        getMonthlyTotal();


    const allTimeSpent =
        getAllTimeSpent();


    const remainingMoney =
        moneyData.initialMoney -
        allTimeSpent;


    totalMoney.textContent =
        moneyData.initialMoney
            .toLocaleString() + "円";


    useMoney.textContent =
        monthlyTotal
            .toLocaleString() + "円";


    moneyLeft.textContent =
        remainingMoney
            .toLocaleString() + "円";


    if (remainingMoney < 0) {

        moneyLeft.style.color =
            "#D85C68";

    } else {

        moneyLeft.style.color =
            "";

    }

}


function clearEditForm() {

    editDetails.value = "";

    editMoney.value = "";

    editDate.value = "";

    editTarget = null;

    editSection.classList.remove(
        "show"
    );

}


function openEditForm() {

    editSection.classList.add(
        "show"
    );


    editSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


function renderMoneyList() {

    moneyList.innerHTML = "";


    for (
        const key of Object.keys(typeLabels)
    ) {

        const monthlyTotal =
            getMonthlyCategoryTotal(key);


        const expense =
            document.createElement("div");

        expense.className =
            "expense";


        const header =
            document.createElement("div");

        header.className =
            "expense-header";


        const label =
            document.createElement("span");

        label.textContent =
            typeLabels[key];


        const total =
            document.createElement("span");

        total.textContent =
            monthlyTotal
                .toLocaleString() + "円";


        header.appendChild(label);

        header.appendChild(total);


        const detailsArea =
            document.createElement("div");

        detailsArea.className =
            "expense-details";


        header.addEventListener(
            "click",
            function() {

                if (
                    detailsArea.classList.contains(
                        "open"
                    )
                ) {

                    detailsArea.classList.remove(
                        "open"
                    );

                    detailsArea.innerHTML = "";

                    return;

                }


                detailsArea.classList.add(
                    "open"
                );


                const monthlyItems =
                    moneyData[key].details
                        .map(
                            function(item, index) {

                                return {
                                    item: item,
                                    index: index
                                };

                            }
                        )
                        .filter(
                            function(data) {

                                return isSameMonth(
                                    data.item.date,
                                    selectedMonth
                                );

                            }
                        );


                if (
                    monthlyItems.length === 0
                ) {

                    const empty =
                        document.createElement("p");

                    empty.textContent =
                        "この月の明細はありません";

                    empty.className =
                        "empty-detail";

                    detailsArea.appendChild(
                        empty
                    );

                    return;

                }


                monthlyItems.forEach(
                    function(data) {

                        const item =
                            data.item;

                        const index =
                            data.index;


                        const detail =
                            document.createElement("p");


                        detail.textContent =
                            `${item.date}　${item.details}　${Number(item.amount).toLocaleString()}円`;


                        if (deleteMode) {

                            detail.classList.add(
                                "delete-target"
                            );


                            detail.addEventListener(
                                "click",
                                function(event) {

                                    event.stopPropagation();


                                    const result =
                                        confirm(
                                            "この明細を削除しますか？"
                                        );


                                    if (!result) {
                                        return;
                                    }


                                    moneyData[key].total -=
                                        Number(item.amount);


                                    moneyData[key].details.splice(
                                        index,
                                        1
                                    );


                                    saveData();

                                    renderMoneyList();

                                    renderBalance();

                                }
                            );

                        }


                        if (editMode) {

                            detail.classList.add(
                                "edit-target"
                            );


                            detail.addEventListener(
                                "click",
                                function(event) {

                                    event.stopPropagation();


                                    editTarget = {

                                        key: key,

                                        index: index

                                    };


                                    editDetails.value =
                                        item.details;


                                    editMoney.value =
                                        item.amount;


                                    editDate.value =
                                        item.date;


                                    openEditForm();

                                }
                            );

                        }


                        detailsArea.appendChild(
                            detail
                        );

                    }
                );

            }
        );


        expense.appendChild(header);

        expense.appendChild(detailsArea);

        moneyList.appendChild(expense);

    }

}


moneyForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const value =
            moneyInput.value.trim();


        if (value === "") {

            alert(
                "所持金を入力してください。"
            );

            return;

        }


        const amount =
            Number(value);


        if (
            !Number.isFinite(amount) ||
            amount < 0
        ) {

            alert(
                "正しい所持金を入力してください。"
            );

            return;

        }


        moneyData.initialMoney =
            amount;


        saveData();

        renderBalance();

        moneyInput.value = "";

    }
);


form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const type =
            document.querySelector(
                "#trade-type"
            ).value;


        const details =
            document.querySelector(
                "#details"
            ).value.trim();


        const date =
            document.querySelector(
                "#date"
            ).value;


        const amountValue =
            document.querySelector(
                "#amount"
            ).value.trim();


        const amount =
            Number(amountValue);


        if (
            details === "" ||
            date === "" ||
            amountValue === "" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            alert(
                "内容・金額・日付を正しく入力してください。"
            );

            return;

        }


        moneyData[type].details.push({

            details: details,

            date: date,

            amount: amount

        });


        moneyData[type].total +=
            amount;


        saveData();

        renderMoneyList();

        renderBalance();

        form.reset();


        document.querySelector(
            "#date"
        ).value =
            formatDate(
                selectedMonth
            );

    }
);


function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


prevMonthButton.addEventListener(
    "click",
    function() {

        selectedMonth.setMonth(
            selectedMonth.getMonth() - 1
        );


        renderMonth();

        renderMoneyList();

        renderBalance();

        clearEditForm();

    }
);


nextMonthButton.addEventListener(
    "click",
    function() {

        selectedMonth.setMonth(
            selectedMonth.getMonth() + 1
        );


        renderMonth();

        renderMoneyList();

        renderBalance();

        clearEditForm();

    }
);


todayMonthButton.addEventListener(
    "click",
    function() {

        selectedMonth =
            new Date();


        renderMonth();

        renderMoneyList();

        renderBalance();

        clearEditForm();


        document.querySelector(
            "#date"
        ).value =
            formatDate(
                selectedMonth
            );

    }
);


deleteModeButton.addEventListener(
    "click",
    function() {

        deleteMode =
            !deleteMode;


        if (deleteMode) {

            editMode = false;

            clearEditForm();


            deleteModeButton.textContent =
                "削除モード終了";


            editModeButton.textContent =
                "編集";


            deleteModeButton.classList.add(
                "active-mode"
            );


            editModeButton.classList.remove(
                "active-mode"
            );

        } else {

            deleteModeButton.textContent =
                "削除";


            deleteModeButton.classList.remove(
                "active-mode"
            );

        }


        renderMoneyList();

    }
);


editModeButton.addEventListener(
    "click",
    function() {

        editMode =
            !editMode;


        if (editMode) {

            deleteMode = false;


            deleteModeButton.textContent =
                "削除";


            deleteModeButton.classList.remove(
                "active-mode"
            );


            editModeButton.textContent =
                "編集モード終了";


            editModeButton.classList.add(
                "active-mode"
            );

        } else {

            editModeButton.textContent =
                "編集";


            editModeButton.classList.remove(
                "active-mode"
            );


            clearEditForm();

        }


        renderMoneyList();

    }
);


editSave.addEventListener(
    "click",
    function() {

        if (!editTarget) {

            alert(
                "編集する明細を選択してください。"
            );

            return;

        }


        const newDetails =
            editDetails.value.trim();


        const newAmountValue =
            editMoney.value.trim();


        const newAmount =
            Number(newAmountValue);


        const newDate =
            editDate.value;


        if (
            newDetails === "" ||
            newDate === "" ||
            newAmountValue === "" ||
            !Number.isFinite(newAmount) ||
            newAmount <= 0
        ) {

            alert(
                "内容・金額・日付を正しく入力してください。"
            );

            return;

        }


        const key =
            editTarget.key;


        const index =
            editTarget.index;


        const item =
            moneyData[key].details[index];


        if (!item) {

            alert(
                "編集対象の明細が見つかりません。"
            );

            clearEditForm();

            renderMoneyList();

            return;

        }


        moneyData[key].total -=
            Number(item.amount);


        moneyData[key].total +=
            newAmount;


        item.details =
            newDetails;


        item.amount =
            newAmount;


        item.date =
            newDate;


        saveData();

        clearEditForm();

        renderMoneyList();

        renderBalance();

    }
);


editCancel.addEventListener(
    "click",
    function() {

        clearEditForm();

    }
);


logoutButton.addEventListener(
    "click",
    function() {

        localStorage.removeItem(
            "currentUser"
        );


        location.replace(
            "login.html"
        );

    }
);


document.querySelector(
    "#date"
).value =
    formatDate(
        selectedMonth
    );


renderMonth();

renderMoneyList();

renderBalance();
