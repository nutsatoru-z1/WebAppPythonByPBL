// โหลดข้อมูลผู้ใช้เมื่อเริ่มหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    checkCurrentUser();
});

// ตรวจสอบข้อมูลผู้เรียนปัจจุบันที่บันทึกไว้ในระบบ
function checkCurrentUser() {
    const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || 'null'); // ดึงข้อมูลผู้เรียนปัจจุบันจาก localStorage
    const userText = document.getElementById('current-user-text'); // ดึง element สำหรับแสดงข้อมูลผู้ใช้
    if (currentStudent && userText) {
        userText.textContent = `${currentStudent.name} (เลขที่ ${currentStudent.no})`;
    }
}


// ค้นหาฟังก์ชันที่ดึงข้อมูลนักเรียนมาแสดง (เช่น checkLoginStatus หรือ loadStudentInfo)
function updateStudentDisplay() {
    const savedData = localStorage.getItem("currentStudent");
    if (!savedData) return;

    try {
        const student = JSON.parse(savedData);
        
        // กำหนดให้เช็ค fullName ก่อน ถ้าไม่มีให้ใช้ name ถ้าไม่มีอีกให้ขึ้นว่า "นักเรียน"
        const studentName = student.fullName || student.name || "นักเรียน";
        const studentNo = student.no || "";

        // จุดที่นำไปแสดงผลบนแถบ Header
        const displayElement = document.getElementById("student-info-display") 
                            || document.getElementById("current-user-text")
                            || document.querySelector(".user-display-name"); // ปรับตาม id หรือ class ที่ใช้จริง

        if (displayElement) {
            displayElement.textContent = `${studentName} (เลขที่ ${studentNo})`;
        }
    } catch (e) {
        console.error("Error reading student data:", e);
    }
}

// เรียกทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener("DOMContentLoaded", updateStudentDisplay);