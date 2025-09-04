const express = require("express");
const app = express();

const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Hello Agent Wallboard!");
});

// Status Management
// AVAILABLE  = พร้อมรับสาย
// ACTIVE     = กำลังคุยกับลูกค้า
// WRAP_UP    = บันทึกหลังจบสาย
// NOT_READY  = ไม่พร้อมรับสาย (พัก/ประชุม)
// OFFLINE    = ออฟไลน์

// Status transitions
// LOGIN -> AVAILABLE -> ACTIVE -> WRAP_UP -> NOT_READY -> OFFLINE

// transitions ที่ไม่ควรอนุญาต
// LOGIN -> ACTIVE
// ACTIVE -> OFFLINE
// WRAP_UP -> ACTIVE
// NOT_READT -> ACTIVE

// Edge Case
// Agent force OFFLINE -> ACTIVE = Dropped
// Agent close browser -> wait timeout -> auto OFFLINE
// Agent WRAP_UP longer -> wait timeoit -> auto stop WRAP_UP

let agents = [
  {
    code: "A001", // รหัส Agent
    name: "Tomson", // เติมคิดเอง
    status: "AVAILABLE", // เติมคิดเอง
    timestamp: new Date().toISOString(),
    Tasks: "49",
  },
  {
    code: "A002", // รหัส Agent
    name: "Adam", // เติมคิดเอง
    status: "ACTIVE", // เติมคิดเอง
    timestamp: new Date().toISOString(),
    Tasks: "52",
  },
  {
    code: "A003", // รหัส Agent
    name: "Kevin", // เติมคิดเอง
    status: "WRAP_UP", // เติมคิดเอง
    timestamp: new Date().toISOString(),
    Tasks: "54",
  },
];

app.use(express.json());
app.patch("/api/agents/:code/status", (req, res) => {
  // Step 1: ดึง agent code จาก URL
  const agentCode = req.params.code; // เติม
  // Step 2: ดึง status ใหม่จาก body
  const newStatus = req.body.status; // เติม
  // find Agent
  const agent = agents.find((a) => a.code === agentCode);
  if (!agent) {
    return res.status(404).json({
      success: false,
      message: "Agent not found",
    });
  }

  // Valid statuses
  const validStatuses = [
    "Available",
    "Active",
    "Wrap Up",
    "Not Ready",
    "Offline",
  ];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status provided",
    });
  }

  // Save old status
  const oldStatus = agent.status;
  agent.status = newStatus;
  console.log(
    `[${new Date().toISOString()}] Agent ${agentCode}: ${oldStatus} -> ${newStatus}`
  );
  res.status(200).json({
    success: true,
    message: `Status of agent ${agentCode} updated`,
    data: {
      oldStatus: oldStatus,
      newStatus: newStatus,
      agent: agent,
    },
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/agents", (req, res) => {
  // ควร return อะไร?
  res.json({
    success: true, // เติม true/false
    data: agents, // เติม agents หรือไม่?
    count: agents.length, // เติมจำนวน agents
    timestamp: new Date().toISOString(), // เติมเวลาปัจจุบัน
  });
});

app.get("/api/agents/count", (req, res) => {
  res.json({
    success: true,
    count: 3,
    timestamp: new Date().toISOString(),
  });
});

app.get("/hello", (req, res) => {
  res.send("คัมซามิดาห์");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
