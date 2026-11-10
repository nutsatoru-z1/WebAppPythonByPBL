const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwoX6QMNNWi6THvdH-7SH7TZJPBIOC3lwQxAmA8p2R7YySFVzv4R69iIfZhDftaxnAzKg/exec";

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
    // ล้างข้อมูลแคชแบบเดิมที่ไม่ผูกกับเลขที่ เพื่อไม่ให้ข้อมูลคนก่อนหน้าตกค้าง
    localStorage.removeItem('flowgorithmPassedMissions');
    localStorage.removeItem('flowgorithmUnlockedLevel');

    checkCurrentUser();
    renderTaskButtons();
    updateScoreboard();
    loadFlowTask('ex1');
});

// คืนค่า Prefix สำหรับแยกพื้นที่เก็บข้อมูลของนักเรียนแต่ละคนตามเลขที่ (เช่น student_10_, student_15_)
function getStudentStorageKeyPrefix() {
    const studentData = localStorage.getItem("currentStudent");
    if (studentData) {
        try {
            const s = JSON.parse(studentData);
            if (s && s.no) {
                return `student_${s.no}_`;
            }
        } catch (e) {}
    }
    return 'guest_';
}

// อ่านรายชื่อด่านที่เล่นผ่านแล้วจาก localStorage (แยกตามเลขที่ของนักเรียนคนนั้นๆ)
function getPassedMissions() {
    try {
        const prefix = getStudentStorageKeyPrefix();
        return JSON.parse(localStorage.getItem(prefix + 'flowgorithmPassedMissions') || '{}');
    } catch (e) {
        return {};
    }
}

// คำนวณคะแนน: ผ่าน 1 ด่าน = 2 คะแนน (สูงสุด 10 คะแนน)
function calculateScore() {
    const passed = getPassedMissions();
    const count = Object.keys(passed).length;
    return Math.min(10, count * 2);
}

// อ่านด่านที่ปลดล็อกแล้วของนักเรียนแต่ละคน (ค่าเริ่มต้น = 1 คือปลดล็อกเฉพาะข้อ 1)
function getUnlockedLevel() {
    const prefix = getStudentStorageKeyPrefix();
    return parseInt(localStorage.getItem(prefix + 'flowgorithmUnlockedLevel') || '1');
}

// อัปเดตกระดานคะแนนแบบ Real-time
function updateScoreboard() {
    const passed = getPassedMissions();
    const passedCount = Object.keys(passed).length;
    const score = Math.min(10, passedCount * 2);

    // แสดงตัวเลขคะแนนสะสม
    const scoreEl = document.getElementById('live-score-display');
    if (scoreEl) scoreEl.textContent = score;

    // แสดงข้อความสรุปจำนวนข้อและคะแนน
    const progressText = document.getElementById('unlock-progress-text');
    if (progressText) {
        progressText.textContent = `ผ่านแล้ว ${passedCount}/5 ข้อ (${score} / 10 คะแนน)`;
    }

    // แสดงชื่อนักเรียนบนการ์ดคะแนน
    const studentData = localStorage.getItem("currentStudent");
    const studentInfoEl = document.getElementById('score-student-info');
    if (studentInfoEl) {
        if (studentData) {
            try {
                const s = JSON.parse(studentData);
                studentInfoEl.innerHTML = `ผู้เรียน: <strong class="text-amber-400 font-bold">${s.fullName || s.name} (เลขที่ ${s.no})</strong> • บันทึกคะแนนลง Google Sheets อัตโนมัติ`;
            } catch (e) {}
        } else {
            studentInfoEl.innerHTML = `<span class="text-rose-400 font-medium">⚠️ ยังไม่ได้เข้าสู่ระบบ (<span class="underline cursor-pointer hover:text-rose-300 font-bold" onclick="openLoginModal()">คลิกที่นี่เพื่อล็อกอินบันทึกคะแนน</span>)</span>`;
        }
    }

    // เรนเดอร์จุด Checkpoint ความก้าวหน้า 5 ด่าน
    const milestonesContainer = document.getElementById('checkpoint-milestones');
    if (milestonesContainer) {
        let html = '';
        const unlockedLevel = getUnlockedLevel();

        for (let i = 1; i <= 5; i++) {
            const qKey = `q${i}`;
            const isPassed = !!passed[qKey];
            const isCurrent = (i === unlockedLevel && !isPassed);
            const points = i * 2;

            if (isPassed) {
                html += `
                    <div class="p-2 sm:p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-center transition">
                        <div class="text-[10px] text-emerald-300 font-bold flex items-center justify-center gap-1">
                            <i class="fa-solid fa-circle-check"></i> ด่าน ${i}
                        </div>
                        <div class="text-xs sm:text-sm font-black font-heading text-emerald-400">+2 คะแนน</div>
                        <div class="text-[9px] text-emerald-200/80">สะสม ${points} คะแนน</div>
                    </div>
                `;
            } else if (isCurrent) {
                html += `
                    <div class="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-center animate-pulse transition">
                        <div class="text-[10px] text-amber-300 font-bold flex items-center justify-center gap-1">
                            <i class="fa-solid fa-play text-[9px]"></i> ด่าน ${i}
                        </div>
                        <div class="text-xs sm:text-sm font-black font-heading text-amber-300">+2 คะแนน</div>
                        <div class="text-[9px] text-amber-200">กำลังทำ</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center opacity-60 transition">
                        <div class="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                            <i class="fa-solid fa-lock text-[9px]"></i> ด่าน ${i}
                        </div>
                        <div class="text-xs sm:text-sm font-bold font-heading text-slate-500">+2 คะแนน</div>
                        <div class="text-[9px] text-slate-600">ล็อกอยู่</div>
                    </div>
                `;
            }
        }
        milestonesContainer.innerHTML = html;
    }
}

// วาดปุ่มเลือกโจทย์ตัวอย่าง และปุ่มโจทย์ภารกิจ 5 ด่าน
function renderTaskButtons() {
    const container = document.getElementById('task-buttons-container');
    const unlockedLevel = getUnlockedLevel();
    const passed = getPassedMissions();

    let html = `
        <button onclick="loadFlowTask('ex1')" id="btn-task-ex1" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-teal-100 hover:bg-teal-200 border border-teal-300 text-slate-900 shadow-sm cursor-pointer">
            <i class="fa-solid fa-book-open text-teal-700 mr-1"></i> ตัวอย่างที่ 1
        </button>
        <button onclick="loadFlowTask('ex2')" id="btn-task-ex2" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-teal-100 hover:bg-teal-200 border border-teal-300 text-slate-900 shadow-sm cursor-pointer">
            <i class="fa-solid fa-book-open text-teal-700 mr-1"></i> ตัวอย่างที่ 2
        </button>
        <div class="h-6 w-px bg-slate-300 my-auto mx-1"></div>
    `;

    for (let i = 1; i <= 5; i++) {
        const qKey = `q${i}`;
        const isUnlocked = i <= unlockedLevel;
        const isPassed = !!passed[qKey];
        const isCurrent = (currentTaskKey === qKey);

        if (isPassed) {
            const activeClass = isCurrent ? "ring-2 ring-emerald-400 bg-emerald-950/80 border-emerald-500 text-emerald-200" : "bg-slate-800 border-emerald-600/60 text-emerald-300 hover:bg-slate-700";
            html += `
                <button onclick="loadFlowTask('${qKey}')" id="btn-task-${qKey}" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${activeClass} cursor-pointer">
                    <i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> ข้อที่ ${i} (+2 คะแนน)
                </button>
            `;
        } else if (isUnlocked) {
            const activeClass = isCurrent ? "ring-2 ring-amber-400 bg-amber-950/80 border-amber-500 text-amber-200" : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700";
            html += `
                <button onclick="loadFlowTask('${qKey}')" id="btn-task-${qKey}" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${activeClass} cursor-pointer">
                    <i class="fa-solid fa-gamepad text-amber-400 mr-1"></i> ข้อที่ ${i} (รับ 2 คะแนน)
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
    updateScoreboard();
}

// ส่งคะแนนและสถานะไปยัง Google Sheets
async function syncScoreToGoogleSheets(score, qIdx, isFinal) {
    const indicator = document.getElementById('sync-status-indicator');
    if (indicator) {
        indicator.className = "text-[11px] text-amber-400 flex items-center gap-1 font-medium animate-pulse";
        indicator.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึกคะแนนลงระบบ...';
    }

    const studentData = localStorage.getItem("currentStudent");
    let student = { no: "-", studentId: "-", fullName: "บุคคลทั่วไป" };
    if (studentData) {
        try {
            student = JSON.parse(studentData);
        } catch (e) {}
    }

    const answersDetail = isFinal 
        ? "ผ่านครบทั้ง 5 ด่าน (10 คะแนนเต็ม)" 
        : `ผ่านด่านที่ ${qIdx} (คะแนนสะสม ${score}/10)`;

    try {
        const params = new URLSearchParams({
            action: "saveScore",
            sheetName: "score2",
            sheet: "score2",
            targetSheet: "score2",
            no: student.no || "-",
            studentId: student.studentId || "",
            fullName: student.fullName || student.name || "นักเรียน",
            lesson: "บทที่ 2 การออกแบบอัลกอริทึม",
            answers: answersDetail,
            score: score
        });

        await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, { mode: 'no-cors' });

        if (indicator) {
            indicator.className = "text-[11px] text-emerald-400 flex items-center gap-1 font-medium";
            indicator.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> บันทึกคะแนน ${score}/10 ลง Google Sheets เรียบร้อย`;
        }

        const modalStatus = document.getElementById('modal-save-status');
        if (modalStatus) {
            modalStatus.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> บันทึกคะแนนของ ${student.fullName || student.name} (เลขที่ ${student.no}) ลงระบบเรียบร้อย`;
        }
    } catch (err) {
        console.error("บันทึกคะแนนไม่สำเร็จ:", err);
        if (indicator) {
            indicator.className = "text-[11px] text-rose-400 flex items-center gap-1 font-medium";
            indicator.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> บันทึกคะแนนไม่สำเร็จ (เน็ตขัดข้อง)';
        }
    }
}

// เอฟเฟกต์เสียงผ่านด่าน (Web Audio API)
function playSuccessSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);         // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08);  // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16);  // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.start(now);
        osc.stop(now + 0.5);
    } catch (e) {}
}

// เอฟเฟกต์เสียงพิชิตครบ 5 ด่าน (Fanfare)
function playFanfareSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const t = ctx.currentTime + idx * 0.12;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

            osc.start(t);
            osc.stop(t + 0.45);
        });
    } catch (e) {}
}

// แสดงชื่อผู้เรียนมุมขวาบน
function checkCurrentUser() {
    const rawData = localStorage.getItem("currentStudent");
    const userText = document.getElementById('current-user-text');
    if (rawData && userText) {
        try {
            const student = JSON.parse(rawData);
            const studentName = student.fullName || student.name || "นักเรียน";
            userText.textContent = `${studentName} (เลขที่ ${student.no})`;
        } catch (e) {
            userText.textContent = "ยังไม่ได้เข้าสู่ระบบ";
        }
    } else if (userText) {
        userText.textContent = "ยังไม่ได้เข้าสู่ระบบ";
    }
}

// ระบบเข้าสู่ระบบนักเรียน
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        const errorMsg = document.getElementById('loginErrorMsg');
        if (errorMsg) errorMsg.classList.add('hidden');
        const inputNo = document.getElementById('inputNo');
        if (inputNo) {
            inputNo.value = '';
            setTimeout(() => inputNo.focus(), 100);
        }
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function handleProfileClick() {
    const currentStudent = localStorage.getItem("currentStudent");
    if (currentStudent) {
        try {
            const student = JSON.parse(currentStudent);
            const name = student.fullName || student.name || "นักเรียน";
            if (confirm(`ผู้เรียนปัจจุบัน: ${name} (เลขที่ ${student.no})\nต้องการออกจากระบบหรือไม่?`)) {
                localStorage.removeItem("currentStudent");
                checkCurrentUser();
                // รีเซ็ตความก้าวหน้าบนหน้าจอให้กลับเป็นของ Guest (0 คะแนน)
                renderTaskButtons();
                updateScoreboard();
                loadFlowTask('ex1');
            }
        } catch(e) {
            openLoginModal();
        }
    } else {
        openLoginModal();
    }
}

async function handleStudentLogin(event) {
    event.preventDefault();
    const no = document.getElementById('inputNo').value.trim();
    const errorMsg = document.getElementById('loginErrorMsg');
    const submitBtn = document.getElementById('submitLoginBtn');

    submitBtn.disabled = true;
    submitBtn.innerText = "กำลังตรวจสอบ...";
    errorMsg.classList.add('hidden');

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?no=${encodeURIComponent(no)}`);
        const result = await response.json();

        if (result.success) {
            localStorage.setItem("currentStudent", JSON.stringify(result.data));
            closeLoginModal();
            checkCurrentUser();
            // โหลดคะแนนและความก้าวหน้าเฉพาะของนักเรียนคนนี้ทันที
            renderTaskButtons();
            updateScoreboard();

            // นำไปยังด่านล่าสุดของนักเรียนคนนี้
            const studentLvl = getUnlockedLevel();
            const targetTask = (studentLvl <= 5) ? `q${studentLvl}` : 'q5';
            loadFlowTask(targetTask);
        } else {
            errorMsg.textContent = result.message || "ไม่พบข้อมูลนักเรียนเลขที่นี้";
            errorMsg.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Login error:", error);
        errorMsg.textContent = "เชื่อมต่อระบบฐานข้อมูลไม่สำเร็จ";
        errorMsg.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "เข้าสู่ระบบ";
    }
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
            const btnText = document.getElementById('unlock-btn-text');
            if (btnText) {
                btnText.textContent = `รับ +2 คะแนน และปลดล็อกด่านถัดไป! (ด่านที่ ${currentTask.qIndex})`;
            }
            playSuccessSound();
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

// บันทึกคะแนนและปลดล็อกด่านถัดไปเมื่อผู้เรียนผ่านภารกิจ
function unlockAndNextTask() {
    const currentTask = taskDatabase[currentTaskKey];
    if (currentTask.isExample) return;

    const currentQIdx = currentTask.qIndex;
    const passedMissions = getPassedMissions();

    // บันทึกว่าด่านนี้ผ่านแล้ว (ผูกกับเลขที่นักเรียน)
    const prefix = getStudentStorageKeyPrefix();
    passedMissions[currentTaskKey] = true;
    localStorage.setItem(prefix + 'flowgorithmPassedMissions', JSON.stringify(passedMissions));

    // ปลดล็อกเลเวลถัดไปของนักเรียนคนนี้
    let unlockedLevel = getUnlockedLevel();
    if (currentQIdx >= unlockedLevel && unlockedLevel < 6) {
        unlockedLevel = currentQIdx + 1;
        localStorage.setItem(prefix + 'flowgorithmUnlockedLevel', unlockedLevel.toString());
    }

    // คำนวณคะแนนใหม่ (ด่านละ 2 คะแนน รวม 10 คะแนน)
    const newScore = calculateScore();
    updateScoreboard();
    renderTaskButtons();

    // เช็คว่าผ่านครบทั้ง 5 ด่านหรือยัง
    const passedCount = Object.keys(passedMissions).length;
    const isFinal = (passedCount === 5 || currentQIdx === 5);

    // ยิงคะแนนเข้า Google Sheets
    syncScoreToGoogleSheets(newScore, currentQIdx, isFinal);

    if (isFinal) {
        playFanfareSound();
        openAllCompleteModal();
    } else {
        openLevelClearModal(currentQIdx, currentTask.title, newScore);
    }
}

// เปิด Modal แจ้งคะแนนผ่านด่าน
function openLevelClearModal(qIdx, title, totalScore) {
    const titleEl = document.getElementById('modal-clear-title');
    if (titleEl) titleEl.textContent = `ผ่านด่านที่ ${qIdx} สำเร็จ!`;

    const descEl = document.getElementById('modal-clear-desc');
    if (descEl) descEl.textContent = title;

    const totalEl = document.getElementById('modal-total-score');
    if (totalEl) totalEl.textContent = `${totalScore} / 10`;

    const modal = document.getElementById('levelClearModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

// ไปต่อด่านถัดไปจาก Modal
function continueToNextTask() {
    const modal = document.getElementById('levelClearModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    const currentTask = taskDatabase[currentTaskKey];
    if (currentTask && currentTask.qIndex < 5) {
        loadFlowTask(`q${currentTask.qIndex + 1}`);
    }
}

// เปิด Modal พิชิตครบ 5 ด่าน
function openAllCompleteModal() {
    const modal = document.getElementById('allCompleteModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeAllCompleteModal() {
    const modal = document.getElementById('allCompleteModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// เริ่มทำภารกิจใหม่ตั้งแต่ด่าน 1 (เฉพาะของนักเรียนคนนี้)
function resetFlowProgress() {
    const studentData = localStorage.getItem("currentStudent");
    let nameText = "ผู้เรียนปัจจุบัน";
    if (studentData) {
        try {
            const s = JSON.parse(studentData);
            nameText = `${s.fullName || s.name} (เลขที่ ${s.no})`;
        } catch(e) {}
    }

    if (confirm(`คุณต้องการรีเซ็ตคะแนนและด่านของ ${nameText} เพื่อเริ่มทำใหม่ตั้งแต่ด่าน 1 หรือไม่?`)) {
        const prefix = getStudentStorageKeyPrefix();
        localStorage.removeItem(prefix + 'flowgorithmPassedMissions');
        localStorage.setItem(prefix + 'flowgorithmUnlockedLevel', '1');
        // ล้างคีย์เก่าทิ้งด้วย
        localStorage.removeItem('flowgorithmPassedMissions');
        localStorage.setItem('flowgorithmUnlockedLevel', '1');
        renderTaskButtons();
        updateScoreboard();
        loadFlowTask('q1');
    }
}



// ฟังก์ชันเปิดดูภาพเต็มจอ
function openImageModal(imgSrc) {
  const modal = document.getElementById('imageLightboxModal');
  const targetImg = document.getElementById('lightboxImage');
  if (modal && targetImg) {
    targetImg.src = imgSrc;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // ป้องกันการเลื่อนหน้าจอด้านหลัง
  }
}

// ฟังก์ชันปิดภาพเต็มจอ
function closeImageModal() {
  const modal = document.getElementById('imageLightboxModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = ''; // คืนค่าการเลื่อนหน้าจอตามปกติ
  }
}

// ปิดเมื่อกดปุ่ม Escape (ESC) บนคีย์บอร์ด
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeImageModal();
  }
});