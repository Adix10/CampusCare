// ============================================================
// CampusCare — NMIMS Shirpur  |  app.js
// Logic layer: authentication, filtering, validation, rendering, utilities
// ============================================================

// ============================================================
// 1. AUTHENTICATION & ACCESS CONTROL
// ============================================================

function rootPath() {
  return (window.location.pathname && window.location.pathname.indexOf("/pages/") !== -1)
    ? "../index.html"
    : "index.html";
}

function login(id, password) {
  var user = DEMO_USERS.find(function(u) {
    return u.id === id.trim() && u.password === password;
  });
  if (!user) return null;
  saveSession(user);
  return user;
}

function logout() {
  clearSession();
  window.location.href = rootPath();
}

function requireAuth(allowedRoles) {
  var user = loadSession();
  if (!user) {
    window.location.href = rootPath();
    return null;
  }
  if (allowedRoles && allowedRoles.indexOf(user.role) === -1) {
    window.location.href = rootPath();
    return null;
  }
  return user;
}

// ============================================================
// 2. STATUS & PRIORITY HELPERS
// ============================================================

var STATUS_CLASS = {
  "Submitted":   "badge-blue",
  "Assigned":    "badge-orange",
  "In Progress": "badge-yellow",
  "Waiting":     "badge-purple",
  "Resolved":    "badge-green",
  "Closed":      "badge-gray"
};

var PRIORITY_CLASS = {
  "Urgent": "pri-urgent",
  "High":   "pri-high",
  "Normal": "pri-normal",
  "Low":    "pri-low"
};

function countByStatus(complaints, status) {
  if (status === "all") return complaints.length;
  return complaints.filter(function(c) { return c.status === status; }).length;
}

// ============================================================
// 3. UTILITIES
// ============================================================

function fmtDate(iso) {
  if (!iso) return "—";
  var d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
         " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toast(msg, type) {
  var t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.className = "toast show " + (type || "success");
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.className = "toast"; }, 3500);
}

function sanitizeCsvCell(val) {
  var str = String(val === null || val === undefined ? "" : val);
  if (str.length > 0) {
    var firstChar = str.charAt(0);
    if (firstChar === "=" || firstChar === "+" || firstChar === "-" || firstChar === "@") {
      str = "'" + str;
    }
  }
  return '"' + str.replace(/"/g, '""') + '"';
}

// ============================================================
// 4. FILTERING ENGINE
// ============================================================

function filterComplaints(complaints, filters) {
  return complaints.filter(function(c) {
    if (filters.userId && c.userId !== filters.userId) return false;
    if (filters.assignedToId && c.assignedToId !== filters.assignedToId) return false;
    if (filters.status && filters.status !== "all" && c.status !== filters.status) return false;
    if (filters.category && filters.category !== "all" && c.category !== filters.category) return false;
    if (filters.priority && filters.priority !== "all" && c.priority !== filters.priority) return false;
    if (filters.search) {
      var q = filters.search.toLowerCase();
      var inTitle = c.title && c.title.toLowerCase().indexOf(q) !== -1;
      var inId = c.id && c.id.toLowerCase().indexOf(q) !== -1;
      var inLoc = c.location && c.location.toLowerCase().indexOf(q) !== -1;
      var inDesc = c.description && c.description.toLowerCase().indexOf(q) !== -1;
      if (!inTitle && !inId && !inLoc && !inDesc) return false;
    }
    return true;
  });
}

function wireFilters(ids, callback) {
  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) {
      el.addEventListener("input", callback);
      el.addEventListener("change", callback);
    }
  }
}

// ============================================================
// 5. RENDERING
// ============================================================

function complaintCard(c) {
  return '<div class="card complaint-card" data-id="' + esc(c.id) + '">' +
    '<div class="card-header">' +
      '<span class="complaint-id">' + esc(c.id) + '</span>' +
      '<span class="badge ' + (STATUS_CLASS[c.status] || "badge-gray") + '">' + esc(c.status) + '</span>' +
    '</div>' +
    '<h3 class="card-title">' + esc(c.title) + '</h3>' +
    '<div class="card-meta">' +
      '<span>' + esc(c.category) + ' › ' + esc(c.sub) + '</span>' +
      '<span>' + esc(c.location) + '</span>' +
    '</div>' +
    '<div class="card-footer">' +
      '<span class="priority-dot ' + (PRIORITY_CLASS[c.priority] || "pri-normal") + '">' + esc(c.priority) + '</span>' +
      '<span class="card-date">' + fmtDate(c.createdAt) + '</span>' +
    '</div>' +
  '</div>';
}

function renderList(container, items, emptyMsg) {
  if (!items || !items.length) {
    container.innerHTML = '<div class="empty-state"><p>' + (emptyMsg || "No complaints found.") + '</p></div>';
    return;
  }
  container.innerHTML = items.map(complaintCard).join("");
  container.querySelectorAll(".complaint-card").forEach(function(card) {
    card.addEventListener("click", function() {
      var id = this.getAttribute("data-id");
      if (id) openComplaint(id);
    });
  });
}

function renderStats(container, complaints, statuses) {
  if (!container) return;
  var html = '<div class="stat-card"><div class="stat-num">' + complaints.length + '</div><div class="stat-label">Total</div></div>';
  for (var i = 0; i < statuses.length; i++) {
    var s = statuses[i];
    html += '<div class="stat-card"><div class="stat-num">' + countByStatus(complaints, s) + '</div><div class="stat-label">' + esc(s) + '</div></div>';
  }
  container.innerHTML = html;
}

function buildSidebar(user, activePage) {
  var sidebar = document.getElementById("sidebar");
  if (!sidebar || !user) return;

  var role = user.role;
  var roleLabel = "Student";
  if (role === "staff") roleLabel = "Staff";
  else if (role === "admin") roleLabel = "Admin";

  var navItems = [];
  if (role === "student") {
    navItems = [
      { id: "dashboard", href: "student-dashboard.html", icon: "🏠", label: "Dashboard" },
      { id: "submit", href: "submit-complaint.html", icon: "➕", label: "New Complaint" },
      { id: "my-complaints", href: "my-complaints.html", icon: "📋", label: "My Complaints" }
    ];
  } else if (role === "staff") {
    navItems = [
      { id: "staff-queue", href: "staff-dashboard.html", icon: "🔧", label: "My Work Queue" }
    ];
  } else if (role === "admin") {
    navItems = [
      { id: "admin-dashboard", href: "admin-dashboard.html", icon: "🏠", label: "Dashboard" },
      { id: "manage-complaints", href: "manage-complaints.html", icon: "📋", label: "Manage Complaints" }
    ];
  }

  var navLinksHtml = "";
  for (var i = 0; i < navItems.length; i++) {
    var item = navItems[i];
    var isActive = (activePage === item.id || activePage === item.href) ? " active" : "";
    navLinksHtml += '<a href="' + item.href + '" class="nav-link' + isActive + '">' +
      '<span class="nav-icon">' + item.icon + '</span>' + esc(item.label) +
    '</a>';
  }

  var initial = (user.name && user.name.length > 0) ? user.name.charAt(0).toUpperCase() : "?";
  var roleSubtitle = roleLabel;
  if (role === "student" && user.branch) {
    roleSubtitle += " · " + user.branch;
  } else if (user.dept) {
    roleSubtitle += " · " + user.dept;
  }

  sidebar.innerHTML =
    '<div class="sidebar-brand">' +
      '<div class="brand-icon">🏫</div>' +
      '<div>' +
        '<div class="brand-name">CampusCare</div>' +
        '<div class="brand-sub">NMIMS Shirpur</div>' +
      '</div>' +
    '</div>' +
    '<nav class="sidebar-nav">' +
      '<div class="nav-section">' + esc(roleLabel) + '</div>' +
      navLinksHtml +
      '<div class="nav-section">Account</div>' +
      '<a href="#" class="nav-link" id="themeToggle"><span class="nav-icon">🌙</span><span class="theme-label">Dark Mode</span></a>' +
      '<a href="#" class="nav-link" id="sidebarLogout"><span class="nav-icon">🚪</span>Logout</a>' +
    '</nav>' +
    '<div class="sidebar-footer">' +
      '<div class="user-chip">' +
        '<div class="user-avatar">' + esc(initial) + '</div>' +
        '<div class="user-info">' +
          '<div class="user-name">' + esc(user.name) + '</div>' +
          '<div class="user-role">' + esc(roleSubtitle) + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  initTheme();

  var logoutBtn = document.getElementById("sidebarLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function(e) {
      e.preventDefault();
      logout();
    });
  }
}

// ============================================================
// 6. THEME & MOBILE NAVIGATION
// ============================================================

function updateThemeToggleUI(btn, theme) {
  var isDark = theme === "dark";
  var iconSpan = btn.querySelector(".nav-icon");
  var labelSpan = btn.querySelector(".theme-label");
  if (iconSpan && labelSpan) {
    iconSpan.textContent = isDark ? "☀" : "🌙";
    labelSpan.textContent = isDark ? "Light Mode" : "Dark Mode";
  } else {
    btn.textContent = isDark ? "☀ Light" : "☾ Dark";
  }
}

function initTheme() {
  var saved = localStorage.getItem("cc_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  var btn = document.getElementById("themeToggle");
  if (btn) {
    updateThemeToggleUI(btn, saved);
    if (!btn._themeInitialized) {
      btn._themeInitialized = true;
      btn.addEventListener("click", function(e) {
        if (e && e.preventDefault) e.preventDefault();
        var current = document.documentElement.getAttribute("data-theme");
        var next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("cc_theme", next);
        updateThemeToggleUI(btn, next);
      });
    }
  }
}

function initMobileNav() {
  var toggle = document.getElementById("navToggle");
  var sidebar = document.getElementById("sidebar");
  if (toggle && sidebar && !toggle._navInitialized) {
    toggle._navInitialized = true;
    toggle.addEventListener("click", function() {
      sidebar.classList.toggle("open");
    });
    document.addEventListener("click", function(e) {
      if (!sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove("open");
      }
    });
  }
}

// ============================================================
// 7. NAVIGATION
// ============================================================

function openComplaint(id) {
  window.location.href = "complaint-detail.html?id=" + encodeURIComponent(id);
}
