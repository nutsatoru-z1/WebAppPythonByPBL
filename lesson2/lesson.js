/**
 * Computing Science Grade 8 - Flowgorithm Web Progression Unlock System
 */

let flowchartData = [];
let activeTargetContext = null;
let selectedModalType = 'input';
let currentTaskKey = 'ex1';
let userVariables = {};
let pendingInputVar = null;

// คลังโจทย์ทั้งหมด (2 ตัวอย่าง + 5 โจทย์ภารกิจล็อกด่าน)
const taskDatabase = {
    // ---------------- ตัวอย่าง ---------------- //
    ex1: {
        isExample: true,
        title: 'ตัวอย่างที่ 1: การคำนวณราคารถเมล์แบบเหมาจ่าย',
        badge: '📌 ตัวอย่างศึกษา',
        badgeClass: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
        desc: 'สถานการณ์: เครื่องออกตั๋วต้องการรับค่าระยะทาง (dist) จากผู้โดยสาร นำมาคำนวณราคาตั๋ว (price) ในอัตรากิโลเมตรละ 2 บาท แล้วแสดงผลราคาตั๋ว (price) ทางจอภาพ',
        requiredVars: ['dist', 'price']
    },

    ex2: {
        isExample: true,
        title: 'ตัวอย่างที่ 2: การตรวจสอบส่วนลดสิทธิ์ตั๋วนักเรียน',
        badge: '📌 ตัวอย่างศึกษา',
        badgeClass: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
        desc: 'สถานการณ์: เครื่องขายตั๋วรับค่าประเภทผู้โดยสาร (type) และระยะทาง (dist) ถ้าประเภทผู้โดยสารเป็น "student" จะคิดราคาตั๋ว (price) กิโลเมตรละ 1 บาท แต่ถ้าเป็นประเภทอื่น จะคิดราคาตั๋ว (price) กิโลเมตรละ 2 บาท แล้วแสดงผลราคาตั๋ว (price)',
        requiredVars: ['type', 'dist', 'price']
    },

    // ---------------- 5 โจทย์ภารกิจจริง ---------------- //
    q1: {
        isExample: false,
        qIndex: 1,
        title: 'ข้อที่ 1: ระบบตรวจสอบสิทธิ์ผู้สูงอายุ (age >= 60)',
        badge: '🎮 ภารกิจข้อที่ 1',
        badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        desc: 'สถานการณ์: ตู้ขายตั๋วต้องการรับค่าอายุผู้โดยสาร (age) และระยะทาง (dist) ถ้าผู้โดยสารอายุตั้งแต่ 60 ปีขึ้นไป (age >= 60) จะได้สิทธิ์นั่งฟรีทันที (price = 0) มิฉะนั้นคิดราคาปกติกิโลเมตรละ 2 บาท (price = dist * 2) แล้วแสดงผลราคาตั๋ว (price)',
        requiredVars: ['age', 'dist', 'price']
    },

    q2: {
        isExample: false,
        qIndex: 2,
        title: 'ข้อที่ 2: ระบบคิดค่าธรรมเนียมช่วงเวลาเร่งด่วน (is_peak == 1)',
        badge: '🎮 ภารกิจข้อที่ 2',
        badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        desc: 'สถานการณ์: ตู้ขายตั๋วรับค่าระยะทาง (dist) และสถานะชั่วโมงเร่งด่วน (is_peak) มาคำนวณราคาตั๋วเบื้องต้น (price = dist * 2) จากนั้นถ้าเป็นชั่วโมงเร่งด่วน (is_peak == 1) ให้คิดค่าธรรมเนียมเพิ่ม 5 บาท (price = price + 5) แล้วแสดงผลราคาตั๋ว (price)',
        requiredVars: ['dist', 'is_peak', 'price']
    },

    q3: {
        isExample: false,
        qIndex: 3,
        title: 'ข้อที่ 3: ระบบคำนวณเงินทอนตั๋วรถเมล์อัตโนมัติ',
        badge: '🎮 ภารกิจข้อที่ 3',
        badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        desc: 'สถานการณ์: เครื่องออกตั๋วรับค่าระยะทาง (dist) มาคำนวณราคาตั๋ว (price = dist * 2) จากนั้นรับเงินที่ผู้โดยสารหยอด (cash) เพื่อคำนวณเงินทอน (change = cash - price) ก่อนแสดงผลเงินทอน (change) ทางหน้าจอ',
        requiredVars: ['dist', 'price', 'cash', 'change']
    },

    q4: {
        isExample: false,
        qIndex: 4,
        title: 'ข้อที่ 4: ระบบส่วนลดการเดินทางระยะทางไกล (dist > 15)',
        badge: '🎮 ภารกิจข้อที่ 4',
        badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        desc: 'สถานการณ์: เครื่องออกตั๋วรับค่าระยะทาง (dist) มาตรวจสอบ ถ้าผู้โดยสารเดินทางระยะทางไกลเกิน 15 กม. (dist > 15) จะคิดราคาตั๋วราคาพิเศษกิโลเมตรละ 1.5 บาท (price = dist * 1.5) มิฉะนั้นคิดราคาปกติกิโลเมตรละ 2 บาท (price = dist * 2) แล้วแสดงผลราคาตั๋ว (price)',
        requiredVars: ['dist', 'price']
    },

    q5: {
        isExample: false,
        qIndex: 5,
        title: 'ข้อที่ 5: ระบบคำนวณราคารวมและเงินคืนสะสมสมาชิก (is_member == 1)',
        badge: '🎮 ภารกิจข้อที่ 5 (ด่านสุดท้าย)',
        badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        desc: 'สถานการณ์: เครื่องออกตั๋วรับค่าระยะทาง (dist) และสถานะสมาชิก (is_member) มาคำนวณราคาตั๋ว (price = dist * 2) ถ้าผู้โดยสารเป็นสมาชิก (is_member == 1) จะได้รับเงินคืนสะสม 10% (cashback = price * 0.1) มิฉะนั้นไม่ได้เงินคืน (cashback = 0) แล้วแสดงผลเงินคืนสะสม (cashback) ออกทางหน้าจอ',
        requiredVars: ['dist', 'is_member', 'price', 'cashback']
    }
};

document.addEventListener('DOMContentLoaded', () => {
    checkCurrentUser();
    renderTaskButtons();
    loadFlowTask('ex1');
});

function checkCurrentUser() {
    const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || 'null');
    const userText = document.getElementById('current-user-text');
    if (userText) {
        if (currentStudent) {
            userText.textContent = `${currentStudent.name} (เลขที่ ${currentStudent.no})`;
        } else {
            userText.textContent = "ยังไม่ได้เข้าสู่ระบบ";
        }
    }
}

// อ่านด่านที่ผ่านแล้วจาก localStorage (เริ่มต้นผ่าน 1 ด่าน = สิทธิ์ทำข้อ 1)
function getUnlockedLevel() {
    return parseInt(localStorage.getItem('flowgorithmUnlockedLevel') || '1');
}

// วาดปุ่มเลือกโจทย์ตัวอย่าง และปุ่มโจทย์ภารกิจพร้อมไอคอนล็อก
function renderTaskButtons() {
    const container = document.getElementById('task-buttons-container');
    const unlockedLevel = getUnlockedLevel();
    let passedCount = unlockedLevel - 1;
    if (passedCount > 5) passedCount = 5;

    document.getElementById('unlock-progress-text').textContent = `ผ่านแล้ว ${passedCount}/5 ข้อ`;

    // เปลี่ยนสีฟอนต์ปุ่มตัวอย่างเป็นสีดำเข้ม (text-slate-900)
    let html = `
        <button onclick="loadFlowTask('ex1')" id="btn-task-ex1" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-teal-100 hover:bg-teal-200 border border-teal-300 text-slate-900 shadow-sm">
            <i class="fa-solid fa-book-open text-teal-700 mr-1"></i> ตัวอย่างที่ 1
        </button>
        <button onclick="loadFlowTask('ex2')" id="btn-task-ex2" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-teal-100 hover:bg-teal-200 border border-teal-300 text-slate-900 shadow-sm">
            <i class="fa-solid fa-book-open text-teal-700 mr-1"></i> ตัวอย่างที่ 2
        </button>
        <div class="h-6 w-px bg-slate-300 my-auto mx-1"></div>
    `;

    for (let i = 1; i <= 5; i++) {
        const qKey = `q${i}`;
        const isUnlocked = i <= unlockedLevel;

        if (isUnlocked) {
            html += `
                <button onclick="loadFlowTask('${qKey}')" id="btn-task-${qKey}" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700">
                    <i class="fa-solid fa-gamepad text-amber-400 mr-1"></i> ข้อที่ ${i}
                </button>
            `;
        } else {
            html += `
                <button disabled class="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-60">
                    <i class="fa-solid fa-lock mr-1"></i> ข้อที่ ${i} (ล็อก)
                </button>
            `;
        }
    }

    container.innerHTML = html;
}

function loadFlowTask(taskKey) {
    currentTaskKey = taskKey;
    flowchartData = [];
    userVariables = {};
    const task = taskDatabase[taskKey];

    document.getElementById('task-title-text').textContent = task.title;
    document.getElementById('task-badge-type').textContent = task.badge;
    document.getElementById('task-badge-type').className = `px-3 py-1 rounded-full text-xs font-bold ${task.badgeClass}`;
    document.getElementById('task-description-text').textContent = task.desc;

    document.getElementById('flow-console').innerHTML = '<p class="text-slate-500">> สร้างผังงานทางซ้ายแล้วกดปุ่ม "รันผังงาน (Run)"...</p>';
    document.getElementById('flow-status-box').classList.add('hidden');
    document.getElementById('flow-input-modal').classList.add('hidden');

    renderFlowchartTree();
}

// ---------------- RENDER FLOWCHART TREE WITH BRANCHING ---------------- //

function renderFlowchartTree() {
    const container = document.getElementById('flowchart-tree');
    let html = `
        <div class="w-32 h-10 bg-amber-500 text-slate-950 font-bold rounded-full flex items-center justify-center text-xs shadow-md">
            Main (Start)
        </div>
    `;

    html += renderNodesSequence(flowchartData, 'root');

    html += `
        <div class="w-32 h-10 bg-amber-500 text-slate-950 font-bold rounded-full flex items-center justify-center text-xs shadow-md mt-2">
            End
        </div>
    `;

    container.innerHTML = html;
}

function renderNodesSequence(nodesArray, pathId) {
    let html = '';
    nodesArray.forEach((node, idx) => {
        html += renderAddLineButton(pathId, idx);
        html += renderBlockNode(node, pathId, idx);
    });
    html += renderAddLineButton(pathId, nodesArray.length);
    return html;
}

function renderAddLineButton(pathId, idx) {
    return `
        <div class="flex flex-col items-center my-1">
            <div class="w-0.5 h-3.5 bg-slate-600"></div>
            <button onclick="openBlockModal('${pathId}', ${idx})" class="w-5 h-5 rounded-full bg-slate-800 border border-amber-500/80 text-amber-400 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center text-[11px] font-bold transition-all shadow" title="เพิ่มบล็อกคำสั่ง">
                +
            </button>
            <div class="w-0.5 h-3.5 bg-slate-600"></div>
        </div>
    `;
}

function renderBlockNode(node, pathId, idx) {
    if (node.type === 'input') {
        return `
            <div class="relative group w-44 h-9 bg-teal-500/20 border-2 border-teal-400 text-teal-300 -skew-x-12 flex items-center justify-center text-xs font-bold shadow">
                <span class="skew-x-12">Input: ${node.val}</span>
                <button onclick="deleteBlock('${pathId}', ${idx})" class="absolute -right-2 -top-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] hidden group-hover:flex items-center justify-center shadow">×</button>
            </div>
        `;
    } else if (node.type === 'assign') {
        return `
            <div class="relative group w-44 h-9 bg-sky-500/20 border-2 border-sky-400 text-sky-300 rounded-lg flex items-center justify-center text-xs font-bold shadow">
                <span>${node.var} = ${node.expr}</span>
                <button onclick="deleteBlock('${pathId}', ${idx})" class="absolute -right-2 -top-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] hidden group-hover:flex items-center justify-center shadow">×</button>
            </div>
        `;
    } else if (node.type === 'output') {
        return `
            <div class="relative group w-44 h-9 bg-purple-500/20 border-2 border-purple-400 text-purple-300 rounded-lg flex items-center justify-center text-xs font-bold shadow">
                <span>Output: ${node.val}</span>
                <button onclick="deleteBlock('${pathId}', ${idx})" class="absolute -right-2 -top-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] hidden group-hover:flex items-center justify-center shadow">×</button>
            </div>
        `;
    } else if (node.type === 'if') {
        return `
            <div class="relative group flex flex-col items-center my-1 w-full">
                <div class="w-48 h-16 shrink-0 relative flex items-center justify-center">
                    <svg class="w-full h-full text-amber-500/20 stroke-amber-400 fill-current" viewBox="0 0 160 60" style="stroke-width: 2;">
                        <polygon points="80,2 158,30 80,58 2,30" />
                    </svg>
                    <span class="absolute font-bold text-amber-300 text-xs tracking-tight text-center px-4">${node.cond}</span>
                    <button onclick="deleteBlock('${pathId}', ${idx})" class="absolute top-0 right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] hidden group-hover:flex items-center justify-center shadow">×</button>
                </div>

                <div class="w-full grid grid-cols-2 gap-4 mt-2 px-2">
                    <div class="flex flex-col items-center bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-2">
                        <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full mb-1">True (ใช่)</span>
                        ${renderNodesSequence(node.trueBranch, `${pathId}-${idx}-true`)}
                    </div>

                    <div class="flex flex-col items-center bg-rose-950/30 border border-rose-500/30 rounded-2xl p-2">
                        <span class="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2.5 py-0.5 rounded-full mb-1">False (ไม่ใช่)</span>
                        ${renderNodesSequence(node.falseBranch, `${pathId}-${idx}-false`)}
                    </div>
                </div>

                <div class="flex flex-col items-center mt-2">
                    <div class="w-0.5 h-3 bg-amber-500/80"></div>
                    <div class="w-3 h-3 rounded-full bg-amber-400 border border-amber-200"></div>
                </div>
            </div>
        `;
    }
    return '';
}

function getArrayByPathId(pathId) {
    if (pathId === 'root') return flowchartData;
    const parts = pathId.split('-');
    let curr = flowchartData;

    for (let i = 1; i < parts.length; i += 2) {
        const idx = parseInt(parts[i]);
        const branchType = parts[i + 1];
        if (branchType === 'true') {
            curr = curr[idx].trueBranch;
        } else {
            curr = curr[idx].falseBranch;
        }
    }
    return curr;
}

// ---------------- UI MODAL & FORM CONTROLS ---------------- //

function openBlockModal(pathId, idx) {
    activeTargetContext = { pathId, idx };
    setModalBlockType('input');
    document.getElementById('block-form-modal').classList.remove('hidden');
}

function closeBlockModal() {
    document.getElementById('block-form-modal').classList.add('hidden');
}

function setModalBlockType(type) {
    selectedModalType = type;
    const container = document.getElementById('modal-fields-container');

    ['input', 'assign', 'output', 'if'].forEach(t => {
        const btn = document.getElementById(`modal-type-${t}`);
        if (btn) {
            if (t === type) {
                btn.className = 'type-tab p-3 rounded-xl border-2 border-amber-500 bg-amber-500/20 text-white flex items-center gap-2 font-bold';
            } else {
                btn.className = 'type-tab p-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-2';
            }
        }
    });

    if (type === 'input') {
        container.innerHTML = `
            <div>
                <label class="block text-xs font-bold text-teal-300 mb-1">ชื่อตัวแปรที่รับค่า (Variable Name):</label>
                <input type="text" id="modal-field-val" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500" placeholder="">
            </div>
        `;
    } else if (type === 'assign') {
        container.innerHTML = `
            <div>
                <label class="block text-xs font-bold text-sky-300 mb-1">ตัวแปรที่ต้องการกำหนดค่า (Variable):</label>
                <input type="text" id="modal-field-var" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500 mb-2" placeholder="">
                
                <label class="block text-xs font-bold text-sky-300 mb-1">สูตรการคำนวณ (Expression):</label>
                <input type="text" id="modal-field-expr" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500" placeholder="">
            </div>
        `;
    } else if (type === 'output') {
        container.innerHTML = `
            <div>
                <label class="block text-xs font-bold text-purple-300 mb-1">ตัวแปรหรือข้อความที่แสดงผล (Output Value):</label>
                <input type="text" id="modal-field-val" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500" placeholder="">
            </div>
        `;
    } else if (type === 'if') {
        container.innerHTML = `
            <div>
                <label class="block text-xs font-bold text-amber-300 mb-1">เงื่อนไขตรวจสอบ (Condition):</label>
                <input type="text" id="modal-field-cond" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500" placeholder="">
            </div>
        `;
    }
}

function saveBlockFromModal() {
    let newNode = { type: selectedModalType };

    if (selectedModalType === 'input') {
        const val = document.getElementById('modal-field-val')?.value.trim();
        if (!val) return alert('กรุณากรอกชื่อตัวแปรที่รับค่าครับ');
        newNode.val = val;
    } else if (selectedModalType === 'assign') {
        const v = document.getElementById('modal-field-var')?.value.trim();
        const expr = document.getElementById('modal-field-expr')?.value.trim();
        if (!v || !expr) return alert('กรุณากรอกชื่อตัวแปรและสูตรคำนวณครับ');
        newNode.var = v;
        newNode.expr = expr;
    } else if (selectedModalType === 'output') {
        const val = document.getElementById('modal-field-val')?.value.trim();
        if (!val) return alert('กรุณากรอกชื่อตัวแปรที่ต้องการแสดงผลครับ');
        newNode.val = val;
    } else if (selectedModalType === 'if') {
        const cond = document.getElementById('modal-field-cond')?.value.trim();
        if (!cond) return alert('กรุณากรอกเงื่อนไขครับ');
        newNode.cond = cond;
        newNode.trueBranch = [];
        newNode.falseBranch = [];
    }

    const targetArr = getArrayByPathId(activeTargetContext.pathId);
    targetArr.splice(activeTargetContext.idx, 0, newNode);
    closeBlockModal();
    renderFlowchartTree();
}

function deleteBlock(pathId, idx) {
    const targetArr = getArrayByPathId(pathId);
    targetArr.splice(idx, 1);
    renderFlowchartTree();
}

function clearFlowgorithm() {
    flowchartData = [];
    userVariables = {};
    renderFlowchartTree();
    document.getElementById('flow-console').innerHTML = '<p class="text-slate-500">> เคลียร์ผังงานเรียบร้อยแล้ว...</p>';
    document.getElementById('flow-status-box').classList.add('hidden');
    document.getElementById('flow-input-modal').classList.add('hidden');
}

// ---------------- RECURSIVE EXECUTION ENGINE & UNLOCK ---------------- //

function runFlowgorithm() {
    const consoleBox = document.getElementById('flow-console');
    consoleBox.innerHTML = '<p class="text-amber-400">[Starting Flowgorithm Execution...]</p>';
    userVariables = {};
    
    if (flowchartData.length === 0) {
        consoleBox.innerHTML += '<p class="text-red-400">⚠️ ผังงานว่างเปล่า! กรุณากดปุ่ม + เพื่อสร้างผังงานก่อนครับ</p>';
        return;
    }

    executeSequence(flowchartData, 0, () => {
        consoleBox.innerHTML += '<p class="text-emerald-400 font-bold">[Execution Completed Successfully]</p>';
        validateFlowgorithmResult();
    });
}

function executeSequence(nodesArray, index, onComplete) {
    const consoleBox = document.getElementById('flow-console');

    if (index >= nodesArray.length) {
        if (onComplete) onComplete();
        return;
    }

    const node = nodesArray[index];

    if (node.type === 'input') {
        pendingInputVar = node.val;
        document.getElementById('flow-input-prompt').textContent = `กรุณากรอกค่าสำหรับ Input (${node.val}):`;
        document.getElementById('flow-input-modal').classList.remove('hidden');
        document.getElementById('flow-user-input-field').value = '';
        document.getElementById('flow-user-input-field').focus();

        window.submitFlowInput = function() {
            const val = document.getElementById('flow-user-input-field').value;
            if (!val) return;

            userVariables[pendingInputVar] = isNaN(val) ? val : parseFloat(val);
            document.getElementById('flow-input-modal').classList.add('hidden');
            consoleBox.innerHTML += `<p class="text-teal-300">> Input (${pendingInputVar}): ${val}</p>`;

            executeSequence(nodesArray, index + 1, onComplete);
        };

    } else if (node.type === 'assign') {
        try {
            let expr = node.expr;
            Object.keys(userVariables).forEach(k => {
                expr = expr.replaceAll(k, typeof userVariables[k] === 'string' ? `"${userVariables[k]}"` : userVariables[k]);
            });
            const result = eval(expr);
            userVariables[node.var] = result;
            consoleBox.innerHTML += `<p class="text-sky-300">> Assign: ${node.var} = ${result}</p>`;
            executeSequence(nodesArray, index + 1, onComplete);
        } catch (e) {
            consoleBox.innerHTML += `<p class="text-red-400">> Error คำนวณสูตร ${node.expr}: ไม่พบตัวแปร</p>`;
        }
    } else if (node.type === 'output') {
        const outVal = userVariables[node.val] !== undefined ? userVariables[node.val] : node.val;
        consoleBox.innerHTML += `<p class="text-purple-300 font-bold">> Output: ${outVal}</p>`;
        executeSequence(nodesArray, index + 1, onComplete);
    } else if (node.type === 'if') {
        let condExpr = node.cond;
        Object.keys(userVariables).forEach(k => {
            condExpr = condExpr.replaceAll(k, typeof userVariables[k] === 'string' ? `"${userVariables[k]}"` : userVariables[k]);
        });

        let condResult = false;
        try {
            condResult = Boolean(eval(condExpr));
        } catch(e) {
            condResult = false;
        }

        if (condResult) {
            consoleBox.innerHTML += `<p class="text-emerald-400 font-bold">> If Condition (${node.cond}) -> TRUE Branch</p>`;
            executeSequence(node.trueBranch, 0, () => {
                executeSequence(nodesArray, index + 1, onComplete);
            });
        } else {
            consoleBox.innerHTML += `<p class="text-rose-400 font-bold">> If Condition (${node.cond}) -> FALSE Branch</p>`;
            executeSequence(node.falseBranch, 0, () => {
                executeSequence(nodesArray, index + 1, onComplete);
            });
        }
    }
}

function validateFlowgorithmResult() {
    const statusBox = document.getElementById('flow-status-box');
    const statusText = document.getElementById('flow-status-text');
    const unlockBtn = document.getElementById('unlock-next-btn');
    const currentTask = taskDatabase[currentTaskKey];
    const reqVars = currentTask.requiredVars;

    let isSuccess = true;
    reqVars.forEach(v => {
        if (userVariables[v] === undefined) isSuccess = false;
    });

    if (isSuccess) {
        statusText.textContent = "ถูกต้อง! คุณสร้างผังงานและรันประมวลผลคำนวณแก้โจทย์ได้สำเร็จ";
        document.getElementById('flow-status-card').className = "p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold";
        
        if (!currentTask.isExample) {
            unlockBtn.classList.remove('hidden');
        } else {
            unlockBtn.classList.add('hidden');
        }

        statusBox.classList.remove('hidden');
    } else {
        statusText.textContent = `ผังงานยังไม่สมบูรณ์ (ตัวแปรที่โจทย์ต้องการ: ${reqVars.join(', ')})`;
        document.getElementById('flow-status-card').className = "p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500 text-amber-300 text-xs font-bold";
        unlockBtn.classList.add('hidden');
        statusBox.classList.remove('hidden');
    }
}

// ปลดล็อกด่านถัดไปเมื่อผู้เรียนผ่านภารกิจ
function unlockAndNextTask() {
    const currentTask = taskDatabase[currentTaskKey];
    if (currentTask.isExample) return;

    const currentQIdx = currentTask.qIndex;
    let unlockedLevel = getUnlockedLevel();

    if (currentQIdx >= unlockedLevel) {
        unlockedLevel = currentQIdx + 1;
        localStorage.setItem('flowgorithmUnlockedLevel', unlockedLevel.toString());
    }

    renderTaskButtons();

    if (currentQIdx < 5) {
        loadFlowTask(`q${currentQIdx + 1}`);
    } else {
        alert("🎉 ยินดีด้วย! คุณพิชิตด่านผังงาน Flowgorithm ครบทั้ง 5 ข้อเรียบร้อยแล้ว!");
    }
}