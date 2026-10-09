/**
 * Computing Science Grade 8 - Application Logic (main.js)
 */

// ฐานข้อมูลจำลองรายชื่อนักเรียนในห้อง
const studentDatabase = [
    { no: 1, name: "เด็กชายกิตติศักดิ์ มีสุข", class: "ม.2/1" },
    { no: 2, name: "เด็กชายชินวัฒน์ วงศ์ดี", class: "ม.2/1" },
    { no: 3, name: "เด็กหญิงณิชาภัทร สุขเจริญ", class: "ม.2/1" },
    { no: 15, name: "เด็กชายสิทธิชนะชัย ชินสกุลกานต์", class: "ม.2/1" }
];

let tempSelectedStudent = null;

// เปิด / ปิด Modal
function toggleProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;

    modal.classList.toggle('hidden');
    
    if (!modal.classList.contains('hidden')) {
        // ซ่อนข้อความแจ้งเตือนสีแดงเมื่อเปิด Modal ใหม่
        const errorEl = document.getElementById('search-error-msg');
        if (errorEl) errorEl.classList.add('hidden');

        const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || 'null');
        if (currentStudent) {
            showState('logged-in-state');
            const avatar = document.getElementById('logged-avatar');
            const name = document.getElementById('logged-name');
            const info = document.getElementById('logged-info');
            
            if (avatar) avatar.textContent = currentStudent.no;
            if (name) name.textContent = currentStudent.name;
            if (info) info.textContent = `เลขที่ ${currentStudent.no} | ${currentStudent.class}`;
        } else {
            showState('login-form-state');
        }
    }
}

// สลับหน้าใน Modal
function showState(stateId) {
    const states = ['login-form-state', 'confirm-student-state', 'logged-in-state'];
    states.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(stateId);
    if (target) target.classList.remove('hidden');
}

// ค้นหานักเรียนจากเลขที่
function searchStudent(event) {
    if (event) event.preventDefault();
    
    const inputEl = document.getElementById('student-no-input');
    const errorEl = document.getElementById('search-error-msg');

    if (!inputEl || !inputEl.value) {
        if (errorEl) {
            errorEl.textContent = 'กรุณากรอกเลขที่ก่อนกดค้นหา';
            errorEl.classList.remove('hidden');
        }
        return;
    }

    const noInput = parseInt(inputEl.value, 10);
    const found = studentDatabase.find(s => s.no === noInput);

    if (found) {
        if (errorEl) errorEl.classList.add('hidden');
        tempSelectedStudent = found;
        
        const avatarEl = document.getElementById('confirm-avatar');
        const badgeEl = document.getElementById('confirm-no-badge');
        const nameEl = document.getElementById('confirm-name');
        const classEl = document.getElementById('confirm-class');

        if (avatarEl) avatarEl.textContent = found.no;
        if (badgeEl) badgeEl.textContent = `เลขที่ ${found.no}`;
        if (nameEl) nameEl.textContent = found.name;
        if (classEl) classEl.textContent = `ชั้น ${found.class}`;

        showState('confirm-student-state');
    } else {
        if (errorEl) {
            errorEl.textContent = `ไม่พบข้อมูลเลขที่ ${noInput} (ลองเลขที่ 1, 2, 3 หรือ 15)`;
            errorEl.classList.remove('hidden');
        }
    }
}

// ย้อนกลับไปค้นหาใหม่
function backToSearch() {
    tempSelectedStudent = null;
    showState('login-form-state');
}

// ยืนยันเข้าสู่ระบบ (ไม่มี alert)
function confirmLogin() {
    if (!tempSelectedStudent) return;

    localStorage.setItem('currentStudent', JSON.stringify(tempSelectedStudent));
    checkLoginStatus();
    toggleProfileModal(); // ปิด Modal ทันที
}

// ออกจากระบบ
function logoutStudent() {
    localStorage.removeItem('currentStudent');
    checkLoginStatus();
    showState('login-form-state');
}

// เช็กสถานะและอัปเดตชื่อผู้เรียนบน Header
function checkLoginStatus() {
    const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || 'null');
    const statusDot = document.getElementById('user-status-dot');
    const userText = document.getElementById('current-user-text');

    if (currentStudent) {
        if (statusDot) statusDot.className = "absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white";
        if (userText) userText.textContent = `${currentStudent.name} (เลขที่ ${currentStudent.no})`; // แสดงชื่อผู้เรียนและเลขที่
    } else {
        if (statusDot) statusDot.className = "absolute top-1 right-1 w-2.5 h-2.5 bg-slate-400 rounded-full border-2 border-white";
        if (userText) userText.textContent = "ยังไม่ได้เข้าสู่ระบบ"; // แสดงข้อความเมื่อยังไม่ได้เข้าสู่ระบบ
    }
}

// Smooth Scroll ไปยังส่วนที่เลือก
function scrollToSection(event, sectionId) {
    if (event) event.preventDefault();
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const headerHeight = 80;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}


// นำทางไปยังบทเรียนย่อยจากหน้า starter.html
function startLesson(lessonNumber) {
    switch (lessonNumber) {
        case 1:
            // ถอยออกจาก Main (../) แล้วเข้าโฟลเดอร์ lesson1
            window.location.href = 'lesson1/lesson1.html';
            break;
        case 2:
            // ถอยออกจาก Main (../) แล้วเข้าโฟลเดอร์ lesson2
            window.location.href = 'lesson2/lesson2.html';
            break;
        case 3:
            // ถอยออกจาก Main (../) แล้วเข้าโฟลเดอร์ lesson3
            window.location.href = 'lesson3/lesson3.html';
            break;
        default:
            console.error('ไม่พบบทเรียน:', lessonNumber);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});