let itemCounter = 0;
let isEditMode = false;
let currentTag = 'travelTw';

const initialItems = {
    travelTw: ["證件 (身分證、健保卡、駕照)", "衣物 (衣服、褲子、內褲、襪子)", "衣物收納袋", "洗漱用品 (牙膏、牙刷、洗面乳)", "毛巾", "控油洗髮精", "保養品", "手機", "平板電腦", "充電器 (相機、手機、平版充電器)", "行動電源", "相機 (注意是否有記憶卡和電池)", "現金和信用卡", "藥物", "防蚊液 (防小黑蚊)"],
    travelGlobal: ["護照", "機票", "旅館預訂確認", "衣物", "洗漱用品", "充電器", "相機", "現金和信用卡"],
    business: ["筆記本電腦", "名片", "文件夾", "商務服裝", "充電器", "筆", "記事本", "商務手機"]
};

document.addEventListener('DOMContentLoaded', function() {
    loadList();

    const newItemInput = document.getElementById("newItem");
    const addButton = document.getElementById("addButton");

    newItemInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            addItem();
        }
    });

    newItemInput.addEventListener('input', function() {
        hideError();
    });

    addButton.addEventListener('click', function(event) {
        event.preventDefault();
        addItem();
    });

    
});

window.addEventListener('load', (event) => {
    fixVh()
});

function fixVh() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}

function switchTag(tag) {
    currentTag = tag;
    document.getElementById('travelTwTag').classList.toggle('active', tag === 'travelTw');
    document.getElementById('travelGlobalTag').classList.toggle('active', tag === 'travelGlobal');
    document.getElementById('businessTag').classList.toggle('active', tag === 'business');
    loadList();
}

function addItem() {
    const input = document.getElementById("newItem");
    const text = input.value.trim();
    
    if (text === "") {
        showError("請輸入項目名稱");
        return;
    }
    
    addListItem(text);
    input.value = "";
    hideError();
    saveList();
}

function addListItem(text, checked = false) {
    const list = document.getElementById("travelList");
    const li = document.createElement("li");
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    
    itemCounter++;
    const uniqueId = `item-${itemCounter}`;
    checkbox.id = uniqueId;
    checkbox.checked = checked;
    
    const label = document.createElement("label");
    label.htmlFor = uniqueId;
    label.appendChild(document.createTextNode(text));
    if (checked) {
        label.classList.add("checked");
    }
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> 刪除'; // 添加刪除文字
    deleteBtn.onclick = function() {
        showConfirmModal('確定要刪除這個項目嗎？', function() {
            list.removeChild(li);
            saveList();
        });
    };
    
    checkbox.onchange = function() {
        label.classList.toggle("checked");
        saveList();
    };
    
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    list.appendChild(li);
}

function toggleEditMode() {
    const list = document.getElementById("travelList");
    const editButton = document.getElementById("editButton");
    isEditMode = !isEditMode;
    
    list.classList.toggle("edit-mode", isEditMode);
    
    if (isEditMode) {
        editButton.innerHTML = '<i class="fas fa-check"></i> 完成';
    } else {
        editButton.innerHTML = '<i class="fas fa-edit"></i> 編輯';
    }
}

function resetList() {
    showConfirmModal('確定要還原預設列表嗎？這將刪除所有當前項目。', function() {
        const list = document.getElementById("travelList");
        list.innerHTML = '';
        itemCounter = 0;
        initialItems[currentTag].forEach(item => addListItem(item));
        saveList();
    });
}

function saveList() {
    const list = document.getElementById("travelList");
    const items = Array.from(list.children).map(li => {
        const label = li.querySelector('label');
        const checkbox = li.querySelector('input[type="checkbox"]');
        return {
            text: label.textContent,
            checked: checkbox.checked
        };
    });
    localStorage.setItem(`${currentTag}List`, JSON.stringify(items));
}

function loadList() {
    const savedList = localStorage.getItem(`${currentTag}List`);
    if (savedList) {
        const items = JSON.parse(savedList);
        const list = document.getElementById("travelList");
        list.innerHTML = '';
        itemCounter = 0;
        items.forEach(item => addListItem(item.text, item.checked));
    } else {
        resetList();
    }
}

function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    modalMessage.textContent = message;
    modal.style.display = 'block';

    confirmButton.onclick = function() {
        modal.style.display = 'none';
        onConfirm();
    };

    cancelButton.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function showError(message) {
    const errorMessage = document.getElementById("inputError");
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
}

function hideError() {
    const errorMessage = document.getElementById("inputError");
    errorMessage.classList.remove("show");
}

function uncheckAll() {
    const checkboxes = document.querySelectorAll('#travelList input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // 取消勾選
        const label = checkbox.nextElementSibling; // 獲取相應的 label
        label.classList.remove("checked"); // 移除 checked 樣式
    });
    saveList(); // 保存狀態
}
