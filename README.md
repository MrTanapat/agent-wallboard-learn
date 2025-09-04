## 🏆 LAB Completion Checklist

### ✅ Hour 1 Completion:
- [x] เข้าใจ Agent Wallboard business concepts
- [x] สร้าง Express server พื้นฐานได้
- [x] ทดสอบ routes ใน browser สำเร็จ
- [x] มี health check endpoint

### ✅ Hour 2 Completion:
- [x] ออกแบบ agent data structure
- [x] สร้าง GET /api/agents สำเร็จ
- [x] ใช้ Postman ทดสอบได้
- [x] เข้าใจ RESTful API concepts

### ✅ Hour 3 Completion:
- [x] เข้าใจ agent status workflow
- [x] สร้าง PATCH /api/agents/:code/status สำเร็จ
- [x] ทดสอบ success และ error cases ครบ
- [x] มี proper error handling
      
    Status Management
    - AVAILABLE  = พร้อมรับสาย
    - ACTIVE     = กำลังคุยกับลูกค้า
    - WRAP_UP    = บันทึกหลังจบสาย
    - NOT_READY  = ไม่พร้อมรับสาย (พัก/ประชุม)
    - OFFLINE    = ออฟไลน์
    
    Status transitions
    ``` LOGIN -> AVAILABLE -> ACTIVE -> WRAP_UP -> AVAILABLE -> NOT_READY -> OFFLINE ```
    
    transitions ที่ไม่ควรอนุญาต
    - LOGIN -> ACTIVE
    - ACTIVE -> OFFLINE
    - WRAP_UP -> ACTIVE
    - NOT_READT -> ACTIVE
    
    Edge Case
    - Agent force OFFLINE -> ACTIVE = Dropped
    - Agent close browser -> wait timeout -> auto OFFLINE
    - Agent WRAP_UP longer -> wait timeoit -> auto stop WRAP_UP

### ✅ Hour 4 Completion:
- [x] สร้าง dashboard statistics API
- [x] ตั้งค่า CORS สำเร็จ
- [x] ทำ mini project (login/logout) เสร็จ
- [x] มี complete Postman collection

### ✅ Final Submission:
- [x] ทดสอบ full workflow: login → status change → logout สำเร็จ
- [x] ส่งภาพหน้าจอ Postman collection
- [x] อธิบายความแตกต่าง LAB vs Workshop ได้
- [x] เตรียมตัวสำหรับ Workshop assignment

---
#### 🧪 Final Testing Workflow:
1. Login Agent: `POST /api/agents/A004/login`
<img src="https://drive.google.com/uc?export=view&id=11xDkKXeI5h_9lUyAETx_a5RX4dGbgDwL" alt="Login Agent" width="1000" height="400">

2. Check Status: `GET /api/agents` (เห็น A004 status = Available)
<img src="https://drive.google.com/uc?export=view&id=13Wgl27vUlxZog463SiKcqUTXaUK1q8ZE" alt="Check Status" width="1000" height="400">

3. Change Status: `PATCH /api/agents/A004/status` (เป็น Active)
<img src="https://drive.google.com/uc?export=view&id=1giQ1JJz_v1hPytbUskXvdQSANGZ7gl_C" alt="Change Status" width="1000" height="400">

4. Check Dashboard:`GET /api/dashboard/stats` (เลขเปลี่ยน)
<img src="https://drive.google.com/uc?export=view&id=101FrXSgcUpACRPWNVsw-BY0zeszCosIN" alt="Check Dashboard" width="1000" height="400">

5. Logout: `POST /api/agents/A004/logout` (status เป็น Offline)
<img src="https://drive.google.com/uc?export=view&id=10_O6ofUlOar8R6RJRHEZa386hYNnoB-0" alt="Your Description" width="1000" height="400">
