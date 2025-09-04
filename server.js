const express = require("express");
const app = express();

const PORT = 3001;

const cors = require("cors");
app.use(cors());

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

app.post("/api/agents/:code/login", (req, res) => {
  const agentCode = req.params.code;
  const { name } = req.body;

  // 1. หา agent หรือสร้างใหม่ถ้าไม่มี
  let agent = agents.find((a) => a.code === agentCode);
  const isNewAgent = !agent;

  if (isNewAgent) {
    // สร้าง agent ใหม่
    agent = {
      code: agentCode,
      name: name,
      Tasks: "0",
      // 2. เซ็ต status เป็น "Available"
      status: "Available",
      timestamp: new Date().toISOString(),
    };
    agents.push(agent);
  } else {
    agent.status = "Available";
    timestamp: new Date().toISOString();
  }

  // 3. บันทึก loginTime
  const oldStatus = agent.status;
  agent.status = "AVAILABLE";
  agent.timestamp = new Date().toISOString();

  console.log(
    `[${agent.timestamp}] Agent ${agent.code} logged in. Status: ${oldStatus} -> ${agent.status}`
  );

  // 4. ส่ง response
  res.status(200).json({
    success: true,
    message: `Agent ${agent.code} logged in successfully.`,
    data: agent,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/agents/:code/logout", (req, res) => {
  const agentCode = req.params.code;

  const agent = agents.find((a) => a.code === agentCode);

  if (!agent) {
    return res.status(404).json({ success: false, message: "Agent not found" });
  }

  const oldStatus = agent.status;
  agent.status = "Offline";
  delete agent.loginTime;
  res.status(200).json({
    success: true,
    message: `Agent ${agent.code} logged out successfully.`,
    data: {
      oldStatus: oldStatus,
      newStatus: agent.status,
    },
    timestamp: new Date().toISOString(),
  });
});

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

app.get("/api/dashboard/stats", (req, res) => {
  // ขั้นที่ 1: นับจำนวนรวม
  const totalAgents = agents.length; // เติม

  // ขั้นที่ 2: นับ Available agents
  const available = agents.filter((a) => a.status === "Available").length; // เติม
  const active = agents.filter((a) => a.status === "Active").length;
  const wrapUp = agents.filter((a) => a.status === "Wrap_Up").length;
  const notReady = agents.filter((a) => a.status === "Not_Ready").length;
  const offline = agents.filter((a) => a.status === "Offline").length;

  // ให้นักศึกษาเขียน active, wrapUp, notReady, offline เอง

  // ขั้นที่ 3: คำนวณเปอร์เซ็นต์
  const availablePercent =
    totalAgents > 0 ? Math.round((available / totalAgents) * 100) : 0;
  const activePercent =
    totalAgents > 0 ? Math.round((active / totalAgents) * 100) : 0;
  const wrapUpPercent =
    totalAgents > 0 ? Math.round((wrapUp / totalAgents) * 100) : 0;
  const notReadyPercent =
    totalAgents > 0 ? Math.round((notReady / totalAgents) * 100) : 0;
  const offlinePercent =
    totalAgents > 0 ? Math.round((offline / totalAgents) * 100) : 0;

  res.json({
    success: true,
    data: {
      total: totalAgents,
      statusBreakdown: {
        available: { count: available, percent: availablePercent },
        active: { count: active, percent: activePercent },
        wrapUp: { count: wrapUp, percent: wrapUpPercent },
        notReady: { count: notReady, percent: notReadyPercent },
        offline: { count: offline, percent: offlinePercent },
      },
      timestamp: new Date().toISOString(),
    },
  });

  // ให้นักศึกษาทำส่วนอื่นเอง...
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
