// ============================================================
// CampusCare — NMIMS Shirpur  |  data.js
// Data layer: plain arrays and Web Storage helpers
// ============================================================

var DATA_VERSION = 2;

// ── Demo user accounts ──────────────────────────────────────
var DEMO_USERS = [
  { id: "70012345678", password: "student123", role: "student", name: "Aarav Sharma",   branch: "CSE-DS", year: 2 },
  { id: "70098765432", password: "student123", role: "student", name: "Priya Patel",    branch: "CSE",    year: 3 },
  { id: "STAFF101",    password: "staff123",   role: "staff",   name: "Rajesh Verma",   dept: "Maintenance" },
  { id: "STAFF102",    password: "staff123",   role: "staff",   name: "Suresh Kumar",   dept: "Maintenance" },
  { id: "STAFF103",    password: "staff123",   role: "staff",   name: "Meena Joshi",    dept: "Maintenance" },
  { id: "STAFF104",    password: "staff123",   role: "staff",   name: "Prakash Singh",  dept: "Maintenance" },
  { id: "ADMIN001",    password: "admin123",   role: "admin",   name: "Dr. S. K. Mehta",dept: "Administration" }
];

// ── Complaint categories & sub-categories ───────────────────
var CATEGORIES = {
  "Electrical":   ["Lighting / Bulbs", "Power Outlets", "AC / Fan", "UPS / Generator"],
  "Plumbing":     ["Tap / Pipe Leak", "Washroom", "Water Supply", "Drainage"],
  "Civil":        ["Doors / Windows", "Flooring", "Walls / Ceiling", "Furniture"],
  "IT / Network": ["Wi-Fi Connectivity", "LAN Port", "Computer / Lab", "Projector"],
  "Housekeeping": ["Cleanliness", "Garbage Bin", "Pest Control", "Odour"],
  "Hostel":       ["Room Issue", "Common Area", "Mess / Canteen", "Laundry"]
};

// ── Campus locations ─────────────────────────────────────────
var LOCATIONS = [
  "Academic Block A", "Academic Block B", "Computer Lab 1", "Computer Lab 2",
  "Library", "Hostel Block 1", "Hostel Block 2", "Hostel Block 3",
  "Canteen / Food Court", "Sports Complex", "Admin Block",
  "Lecture Hall Complex", "Boys Common Room", "Girls Common Room"
];

// ── Status workflow transitions ─────────────────────────────
var STATUS_FLOW = {
  "Submitted":   ["Assigned"],
  "Assigned":    ["In Progress", "Waiting"],
  "In Progress": ["Waiting", "Resolved"],
  "Waiting":     ["In Progress", "Resolved"],
  "Resolved":    ["Closed", "In Progress"],
  "Closed":      []
};

// ── Seed complaints (shown by default) ──────────────────────
var SEED_COMPLAINTS = [
  {
    id: "CC-2026-00001", userId: "70012345678", title: "AC not working in Lab 2",
    category: "Electrical", sub: "AC / Fan", location: "Computer Lab 2",
    priority: "High", description: "Air conditioner in CL-2 has stopped cooling. Room temperature very high during afternoon sessions.",
    status: "In Progress", assignedTo: "Rajesh Verma", assignedToId: "STAFF101",
    createdAt: "2026-10-20T09:15:00", updatedAt: "2026-10-21T14:30:00",
    timeline: [
      { date: "2026-10-20T09:15:00", action: "Complaint submitted",         by: "Aarav Sharma" },
      { date: "2026-10-21T10:00:00", action: "Assigned to Rajesh Verma",    by: "Admin" },
      { date: "2026-10-21T14:30:00", action: "Technician visited site",      by: "Rajesh Verma" }
    ]
  },
  {
    id: "CC-2026-00002", userId: "70012345678", title: "Tap leaking in hostel washroom",
    category: "Plumbing", sub: "Tap / Pipe Leak", location: "Hostel Block 1",
    priority: "Normal", description: "One tap in the ground-floor washroom is continuously leaking.",
    status: "Resolved", assignedTo: "Rajesh Verma", assignedToId: "STAFF101",
    createdAt: "2026-10-18T08:00:00", updatedAt: "2026-10-19T17:00:00",
    timeline: [
      { date: "2026-10-18T08:00:00", action: "Complaint submitted",       by: "Aarav Sharma" },
      { date: "2026-10-18T11:00:00", action: "Assigned to Rajesh Verma", by: "Admin" },
      { date: "2026-10-19T17:00:00", action: "Tap replaced. Resolved.",  by: "Rajesh Verma" }
    ]
  },
  {
    id: "CC-2026-00003", userId: "70098765432", title: "Wi-Fi not available in Library",
    category: "IT / Network", sub: "Wi-Fi Connectivity", location: "Library",
    priority: "Urgent", description: "Library Wi-Fi router appears to be down since yesterday morning.",
    status: "Submitted", assignedTo: "", assignedToId: "",
    createdAt: "2026-10-22T11:30:00", updatedAt: "2026-10-22T11:30:00",
    timeline: [
      { date: "2026-10-22T11:30:00", action: "Complaint submitted", by: "Priya Patel" }
    ]
  },
  {
    id: "CC-2026-00004", userId: "70098765432", title: "Broken chair in Lecture Hall B",
    category: "Civil", sub: "Furniture", location: "Lecture Hall Complex",
    priority: "Low", description: "Chair in row 3, seat 7 has a broken leg — safety hazard.",
    status: "Assigned", assignedTo: "Rajesh Verma", assignedToId: "STAFF101",
    createdAt: "2026-10-21T13:45:00", updatedAt: "2026-10-22T09:00:00",
    timeline: [
      { date: "2026-10-21T13:45:00", action: "Complaint submitted",       by: "Priya Patel" },
      { date: "2026-10-22T09:00:00", action: "Assigned to Rajesh Verma", by: "Admin" }
    ]
  },
  {
    id: "CC-2026-00005", userId: "70012345678", title: "Garbage bins overflowing near canteen",
    category: "Housekeeping", sub: "Garbage Bin", location: "Canteen / Food Court",
    priority: "Normal", description: "Both dustbins near the canteen entrance are full and smell bad.",
    status: "Submitted", assignedTo: "", assignedToId: "",
    createdAt: "2026-10-23T07:45:00", updatedAt: "2026-10-23T07:45:00",
    timeline: [
      { date: "2026-10-23T07:45:00", action: "Complaint submitted", by: "Aarav Sharma" }
    ]
  }
];

// ── Staff helper ─────────────────────────────────────────────
function getStaffList() {
  return DEMO_USERS.filter(function(u) {
    return u.role === "staff";
  });
}

// ── Storage helpers ──────────────────────────────────────────
function loadComplaints() {
  var raw = localStorage.getItem("cc_complaints");
  var version = localStorage.getItem("cc_data_version");
  var list = null;

  if (raw) {
    try {
      list = JSON.parse(raw);
      if (!Array.isArray(list)) list = null;
    } catch (e) {
      list = null;
    }
  }

  // First run or parse failure -> seed default complaints
  if (!list) {
    list = SEED_COMPLAINTS.slice();
    saveComplaints(list);
    localStorage.setItem("cc_data_version", String(DATA_VERSION));
    return list;
  }

  // Version check and migration
  if (version !== String(DATA_VERSION)) {
    var staffList = getStaffList();
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (!item.assignedToId) {
        if (item.assignedTo) {
          var matched = null;
          for (var j = 0; j < staffList.length; j++) {
            if (staffList[j].name === item.assignedTo) {
              matched = staffList[j];
              break;
            }
          }
          item.assignedToId = matched ? matched.id : "";
        } else {
          item.assignedToId = "";
        }
      }
    }
    saveComplaints(list);
    localStorage.setItem("cc_data_version", String(DATA_VERSION));
  }

  return list;
}

function saveComplaints(arr) {
  localStorage.setItem("cc_complaints", JSON.stringify(arr));
}

function loadSession() {
  var raw = sessionStorage.getItem("cc_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveSession(user) {
  sessionStorage.setItem("cc_user", JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem("cc_user");
}

function resetDemoData() {
  localStorage.removeItem("cc_complaints");
  localStorage.removeItem("cc_data_version");
  loadComplaints();
  window.location.reload();
}

// ── Complaint ID generator ───────────────────────────────────
function nextId(complaints) {
  var max = 0;
  if (complaints && complaints.length) {
    complaints.forEach(function(c) {
      if (c && c.id) {
        var parts = c.id.split("-");
        if (parts.length >= 3) {
          var n = parseInt(parts[2], 10) || 0;
          if (n > max) max = n;
        }
      }
    });
  }
  var nextNum = String(max + 1);
  while (nextNum.length < 5) nextNum = "0" + nextNum;
  return "CC-2026-" + nextNum;
}
