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

function displayStudentHeader() {
    const rawData = localStorage.getItem("currentStudent");
    if (!rawData) return;

    try {
        const student = JSON.parse(rawData);
        
        // ตรวจสอบชื่อ: ดึง fullName ก่อน ถ้าไม่มีให้ใช้ name ถ้าไม่มีให้ใช้ข้อความสำรอง
        const studentName = student.fullName || student.name || "นักเรียน";
        const studentNo = student.no || "";

        // ค้นหาตำแหน่ง element ที่แสดงชื่อมุมขวาบน
        const userDisplay = document.getElementById("student-info-display") 
                         || document.getElementById("current-user-text")
                         || document.getElementById("user-display-name");

        if (userDisplay) {
            userDisplay.textContent = `${studentName} (เลขที่ ${studentNo})`;
        }
    } catch (e) {
        console.error("Error displaying student name:", e);
    }
}

document.addEventListener("DOMContentLoaded", displayStudentHeader);