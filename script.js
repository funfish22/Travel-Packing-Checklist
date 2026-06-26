let itemCounter = 0;
let isEditMode = false;
let currentTag = 'travelTw';
let lastFocusedElement = null;
let indicatorFrame = 0;
let toolbarFilterSignature = '';
let ver = '3.3';

const toolbarGlassConfig = {
    thickness: 28,
    bezel: 12,
    ior: 1.38,
    blur: 0.24,
    saturation: 1.35,
    specularOpacity: 0.24,
    scaleRatio: 0.26
};

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

    window.addEventListener('resize', scheduleToolbarIndicator);
    document.fonts?.ready.then(() => updateToolbarIndicator(false));

    updateToolbarIndicator(false);
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
    updateToolbarIndicator(true);
}

function scheduleToolbarIndicator() {
    window.cancelAnimationFrame(indicatorFrame);
    indicatorFrame = window.requestAnimationFrame(() => updateToolbarIndicator(false));
}

function updateToolbarIndicator(animate = true) {
    const toolbar = document.getElementById('tagSection');
    const indicator = toolbar?.querySelector('.toolbar-indicator');
    const activeTab = toolbar?.querySelector('.tag.active');

    if (!toolbar || !indicator || !activeTab) return;

    const toolbarRect = toolbar.getBoundingClientRect();
    const activeRect = activeTab.getBoundingClientRect();

    indicator.style.setProperty('--indicator-x', `${activeRect.left - toolbarRect.left}px`);
    indicator.style.setProperty('--indicator-y', `${activeRect.top - toolbarRect.top}px`);
    indicator.style.setProperty('--indicator-width', `${activeRect.width}px`);
    indicator.style.setProperty('--indicator-height', `${activeRect.height}px`);
    rebuildToolbarGlassFilter(Math.round(activeRect.width), Math.round(activeRect.height));
    toolbar.classList.add('indicator-ready');

    if (animate) {
        toolbar.classList.remove('indicator-moving');
        void toolbar.offsetWidth;
        toolbar.classList.add('indicator-moving');
    }
}

function convexSquircleSurface(x) {
    const t = Math.max(0, Math.min(1, x));
    return Math.pow(1 - Math.pow(1 - t, 4), 0.25);
}

function calculateRefractionProfile(glassThickness, bezelWidth, ior, samples = 96) {
    const eta = 1 / ior;
    const profile = new Float64Array(samples);

    function refract(nx, ny) {
        const dot = ny;
        const k = 1 - eta * eta * (1 - dot * dot);
        if (k < 0) return null;
        const sq = Math.sqrt(k);
        return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
    }

    for (let i = 0; i < samples; i++) {
        const x = i / samples;
        const y = convexSquircleSurface(x);
        const dx = 0.0001;
        const y2 = convexSquircleSurface(Math.min(1, x + dx));
        const deriv = (y2 - y) / dx;
        const mag = Math.sqrt(deriv * deriv + 1);
        const ref = refract(-deriv / mag, -1 / mag);

        if (!ref || ref[1] === 0) {
            profile[i] = 0;
            continue;
        }

        profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1]);
    }

    return profile;
}

function createPixelCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, width);
    canvas.height = Math.max(1, height);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    return context ? { canvas, context } : null;
}

function generateDisplacementMap(width, height, radius, bezelWidth, profile, maxDisplacement) {
    const buffer = createPixelCanvas(width, height);
    if (!buffer) return '';

    const { canvas, context } = buffer;
    const image = context.createImageData(width, height);
    const data = image.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 128;
        data[i + 1] = 128;
        data[i + 2] = 0;
        data[i + 3] = 255;
    }

    const r = radius;
    const rSq = r * r;
    const rOuterSq = (r + 1) ** 2;
    const rBezelSq = Math.max(r - bezelWidth, 0) ** 2;
    const widthBody = width - r * 2;
    const heightBody = height - r * 2;
    const samples = profile.length;

    for (let yPos = 0; yPos < height; yPos++) {
        for (let xPos = 0; xPos < width; xPos++) {
            const x = xPos < r ? xPos - r : xPos >= width - r ? xPos - r - widthBody : 0;
            const y = yPos < r ? yPos - r : yPos >= height - r ? yPos - r - heightBody : 0;
            const distanceSq = x * x + y * y;

            if (distanceSq > rOuterSq || distanceSq < rBezelSq) continue;

            const distance = Math.sqrt(distanceSq);
            if (distance === 0) continue;

            const fromSide = r - distance;
            const opacity = distanceSq < rSq
                ? 1
                : 1 - (distance - Math.sqrt(rSq)) / (Math.sqrt(rOuterSq) - Math.sqrt(rSq));

            if (opacity <= 0) continue;

            const cos = x / distance;
            const sin = y / distance;
            const bezelIndex = Math.min(((fromSide / bezelWidth) * samples) | 0, samples - 1);
            const displacement = profile[bezelIndex] || 0;
            const dX = (-cos * displacement) / maxDisplacement;
            const dY = (-sin * displacement) / maxDisplacement;
            const index = (yPos * width + xPos) * 4;

            data[index] = (128 + dX * 127 * opacity + 0.5) | 0;
            data[index + 1] = (128 + dY * 127 * opacity + 0.5) | 0;
        }
    }

    context.putImageData(image, 0, 0);
    return canvas.toDataURL();
}

function generateSpecularMap(width, height, radius, bezelWidth, angle = Math.PI / 3) {
    const buffer = createPixelCanvas(width, height);
    if (!buffer) return '';

    const { canvas, context } = buffer;
    const image = context.createImageData(width, height);
    const data = image.data;
    data.fill(0);

    const r = radius;
    const rSq = r * r;
    const rOuterSq = (r + 1) ** 2;
    const rBezelSq = Math.max(r - bezelWidth, 0) ** 2;
    const widthBody = width - r * 2;
    const heightBody = height - r * 2;
    const lightVector = [Math.cos(angle), Math.sin(angle)];

    for (let yPos = 0; yPos < height; yPos++) {
        for (let xPos = 0; xPos < width; xPos++) {
            const x = xPos < r ? xPos - r : xPos >= width - r ? xPos - r - widthBody : 0;
            const y = yPos < r ? yPos - r : yPos >= height - r ? yPos - r - heightBody : 0;
            const distanceSq = x * x + y * y;

            if (distanceSq > rOuterSq || distanceSq < rBezelSq) continue;

            const distance = Math.sqrt(distanceSq);
            if (distance === 0) continue;

            const fromSide = r - distance;
            const opacity = distanceSq < rSq
                ? 1
                : 1 - (distance - Math.sqrt(rSq)) / (Math.sqrt(rOuterSq) - Math.sqrt(rSq));

            if (opacity <= 0) continue;

            const cos = x / distance;
            const sin = -y / distance;
            const dot = Math.abs(cos * lightVector[0] + sin * lightVector[1]);
            const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
            const coeff = dot * edge;
            const color = (255 * coeff) | 0;
            const alpha = (color * coeff * opacity) | 0;
            const index = (yPos * width + xPos) * 4;

            data[index] = color;
            data[index + 1] = color;
            data[index + 2] = color;
            data[index + 3] = alpha;
        }
    }

    context.putImageData(image, 0, 0);
    return canvas.toDataURL();
}

function rebuildToolbarGlassFilter(width, height) {
    const defs = document.getElementById('liquidFilterDefs');
    if (!defs || width < 8 || height < 8) return;

    const radius = Math.min(height / 2, width / 2);
    const bezel = Math.max(2, Math.min(toolbarGlassConfig.bezel, radius - 1, width / 2 - 1, height / 2 - 1));
    const signature = [
        width,
        height,
        Math.round(radius * 100) / 100,
        bezel,
        toolbarGlassConfig.thickness,
        toolbarGlassConfig.ior,
        toolbarGlassConfig.blur,
        toolbarGlassConfig.saturation,
        toolbarGlassConfig.specularOpacity
    ].join(':');

    if (signature === toolbarFilterSignature) return;

    const profile = calculateRefractionProfile(
        toolbarGlassConfig.thickness,
        bezel,
        toolbarGlassConfig.ior
    );
    const maxDisplacement = Math.max(...Array.from(profile, Math.abs)) || 1;
    const displacementUrl = generateDisplacementMap(width, height, radius, bezel, profile, maxDisplacement);
    const specularUrl = generateSpecularMap(width, height, radius, bezel * 2.3);

    if (!displacementUrl || !specularUrl) return;

    const scale = Math.max(2, maxDisplacement * toolbarGlassConfig.scaleRatio);

    defs.innerHTML = `
        <filter id="liquid-toolbar-filter" x="0%" y="0%" width="100%" height="100%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="${toolbarGlassConfig.blur}" result="blurred_source"></feGaussianBlur>
            <feImage href="${displacementUrl}" x="0" y="0" width="${width}" height="${height}" result="disp_map"></feImage>
            <feDisplacementMap in="blurred_source" in2="disp_map" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="displaced"></feDisplacementMap>
            <feColorMatrix in="displaced" type="saturate" values="${toolbarGlassConfig.saturation}" result="displaced_sat"></feColorMatrix>
            <feImage href="${specularUrl}" x="0" y="0" width="${width}" height="${height}" result="spec_layer"></feImage>
            <feComponentTransfer in="spec_layer" result="spec_faded">
                <feFuncA type="linear" slope="${toolbarGlassConfig.specularOpacity}"></feFuncA>
            </feComponentTransfer>
            <feBlend in="displaced_sat" in2="spec_faded" mode="normal"></feBlend>
        </filter>
    `;

    toolbarFilterSignature = signature;
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
