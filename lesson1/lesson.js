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
