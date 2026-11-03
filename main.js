/**
 * Computing Science Grade 8 - Application Logic (system.js)
 */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwoX6QMNNWi6THvdH-7SH7TZJPBIOC3lwQxAmA8p2R7YySFVzv4R69iIfZhDftaxnAzKg/exec";

// 1. ฟังก์ชันเปิด Modal จัดกึ่งกลางจอ
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex'); // บังคับ flex เพื่อให้ items-center justify-center ทำงาน
    const errorMsg = document.getElementById('loginErrorMsg');
    if (errorMsg) errorMsg.classList.add('hidden');
    const inputNo = document.getElementById('inputNo');
    if (inputNo) {
      inputNo.value = '';
      setTimeout(() => inputNo.focus(), 100);
    }
  }
}

// 2. ฟังก์ชันปิด Modal
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// 3. กดที่แท็บไอคอนโปรไฟล์บน Header
function handleProfileClick() {
  const currentStudent = localStorage.getItem("currentStudent");
  if (currentStudent) {
    const student = JSON.parse(currentStudent);
    const name = student.fullName || student.name || "นักเรียน";
    if (confirm(`ผู้เรียนปัจจุบัน: ${name} (เลขที่ ${student.no})\nต้องการออกจากระบบหรือไม่?`)) {
      logoutStudent();
    }
  } else {
    openLoginModal();
  }
}

// 4. เข้าสู่ระบบด้วยเลขที่เพียงอย่างเดียว และดึงชื่อมาแสดง
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
      // บันทึกข้อมูลนักเรียนลง localStorage
      localStorage.setItem("currentStudent", JSON.stringify(result.data));
      closeLoginModal();
      checkLoginStatus(); // อัปเดตชื่อขึ้นแถบด้านบนขวาทันที
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

// 5. แสดงชื่อ-นามสกุล และเลขที่บนแถบด้านบน
function checkLoginStatus() {
  const savedStudent = localStorage.getItem("currentStudent");
  const userText = document.getElementById('current-user-text');
  const statusDot = document.getElementById('user-status-dot');

  if (savedStudent) {
    const student = JSON.parse(savedStudent);
    // ดึงชื่อสกุล (คอลัมน์ C จาก Google Sheets)
    const displayName = student.fullName || student.name || "นักเรียน";
    if (userText) {
      userText.textContent = `${displayName} (เลขที่ ${student.no})`;
    }
    if (statusDot) {
      statusDot.className = "absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white";
    }
  } else {
    if (userText) {
      userText.textContent = "ยังไม่ได้เข้าสู่ระบบ";
    }
    if (statusDot) {
      statusDot.className = "absolute top-1 right-1 w-2.5 h-2.5 bg-slate-400 rounded-full border-2 border-white";
    }
  }
}

// 6. ออกจากระบบ
function logoutStudent() {
  localStorage.removeItem("currentStudent");
  checkLoginStatus();
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