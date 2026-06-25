let itemCounter = 0;
let isEditMode = false;
let currentTag = 'travelTw';
let lastFocusedElement = null;
let ver = '3.00';

const initialItems = {
    travelTw: ["證件 (身分證、健保卡、駕照)", "衣物 (衣服、褲子、內褲、襪子)", "衣物收納袋或乾淨塑膠袋", "洗漱用品 (牙膏、牙刷、洗面乳、漱口水)", "毛巾", "控油洗髮精", "衛生紙", "保養品", "雨傘", "保溫瓶", "原子筆", "手機", "平板電腦", "充電器 (相機、手機、平版充電器)", "行動電源", "相機 (注意是否有記憶卡和電池)", "現金和信用卡", "藥物", "防蚊液 (防小黑蚊)"],
    travelGlobal: ["護照", "機票", "旅館預訂確認", "衣物 (衣服、褲子、內褲、襪子)", "衣物收納袋或乾淨塑膠袋", "洗漱用品 (牙膏、牙刷、洗面乳、漱口水)", "毛巾", "控油洗髮精", "衛生紙", "保養品", "雨傘", "保溫瓶", "原子筆", "漫遊sim卡", "手機", "平板電腦", "充電器 (相機、手機、平版充電器)", "行動電源", "相機 (注意是否有記憶卡和電池)", "現金和信用卡", "拖鞋", "藥物", "防蚊液 (防小黑蚊)"],
    business: ["名片", "文件夾", "商務服裝", "衣物 (衣服、褲子、內褲、襪子)", "衣物收納袋或乾淨塑膠袋", "洗漱用品 (牙膏、牙刷、洗面乳、漱口水)", "毛巾", "控油洗髮精", "衛生紙", "保養品", "雨傘", "保溫瓶", "原子筆", "筆記型電腦", "平板電腦", "手機", "商務手機", "充電器 (相機、手機、平版充電器)", "記事本", "行動電源", "現金和信用卡", "拖鞋", "藥物", "防蚊液 (防小黑蚊)"]
};

document.addEventListener('DOMContentLoaded', function() {
    writeVer();
    const localVer = localStorage.getItem('ver');
    if(localVer === null) localStorage.setItem('ver', ver);
    if(localVer !== ver) {
        localStorage.setItem('ver', ver);
        localStorage.removeItem('travelTwList');
        localStorage.removeItem('travelGlobalList');
        localStorage.removeItem('businessList');
    }
    loadList();

    const newItemInput = document.getElementById("newItem");
    const addItemForm = document.getElementById("addItemForm");
    const modal = document.getElementById('confirmModal');
    const cancelButton = document.getElementById('cancelButton');

    addItemForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addItem();
    });

    newItemInput.addEventListener('input', function() {
        hideError();
    });

    cancelButton.addEventListener('click', closeConfirmModal);

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeConfirmModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeConfirmModal();
        }
    });
});

function fixVh() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}

function switchTag(tag) {
    currentTag = tag;
    const tabs = {
        travelTw: document.getElementById('travelTwTag'),
        travelGlobal: document.getElementById('travelGlobalTag'),
        business: document.getElementById('businessTag')
    };

    Object.entries(tabs).forEach(([tabName, tabButton]) => {
        const isActive = tabName === tag;
        tabButton.classList.toggle('active', isActive);
        tabButton.setAttribute('aria-selected', String(isActive));
    });

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
    deleteBtn.type = "button";
    deleteBtn.innerHTML = '<span aria-hidden="true">×</span> 刪除';
    deleteBtn.setAttribute('aria-label', `刪除「${text}」`);
    deleteBtn.onclick = function() {
        showConfirmModal('確定要刪除這個項目嗎？', function() {
            list.removeChild(li);
            saveList();
            updateProgress();
        });
    };
    
    checkbox.onchange = function() {
        label.classList.toggle("checked", checkbox.checked);
        saveList();
        updateProgress();
    };
    
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    list.appendChild(li);
    updateProgress();
}

function toggleEditMode() {
    const list = document.getElementById("travelList");
    const editButton = document.getElementById("editButton");
    isEditMode = !isEditMode;
    
    list.classList.toggle("edit-mode", isEditMode);
    editButton.setAttribute('aria-pressed', String(isEditMode));
    
    if (isEditMode) {
        editButton.innerHTML = '<span aria-hidden="true">✓</span> <span>完成</span>';
    } else {
        editButton.innerHTML = '<span aria-hidden="true">✎</span> <span>編輯</span>';
    }
}

function resetList(first) {
    if(first) {
        showConfirmModal('確定要還原預設列表嗎？這將刪除所有當前項目。', function() {
            const list = document.getElementById("travelList");
            list.innerHTML = '';
            itemCounter = 0;
            initialItems[currentTag].forEach(item => addListItem(item));
            saveList();
            updateProgress();
        });
    } else {
        const list = document.getElementById("travelList");
        list.innerHTML = '';
        itemCounter = 0;
        initialItems[currentTag].forEach(item => addListItem(item));
        saveList();
        updateProgress();
    }
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
    updateProgress();
}

function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmButton = document.getElementById('confirmButton');

    lastFocusedElement = document.activeElement;
    modalMessage.textContent = message;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');

    confirmButton.onclick = function() {
        closeConfirmModal();
        onConfirm();
    };

    window.requestAnimationFrame(() => {
        document.getElementById('cancelButton').focus();
    });
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');

    if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
    }
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
    updateProgress();
}

function updateProgress() {
    const progressText = document.getElementById('progressText');
    const checkboxes = Array.from(document.querySelectorAll('#travelList input[type="checkbox"]'));

    if (!progressText) return;

    const completed = checkboxes.filter(checkbox => checkbox.checked).length;
    const total = checkboxes.length;
    progressText.textContent = total === 0 ? '尚無項目' : `${completed} / ${total} 已完成`;
}

function writeVer() {
    const verDom = document.querySelector('.ver');
    verDom.textContent = `版本 ${ver}`;
}
