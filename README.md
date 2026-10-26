# CampusCare — NMIMS Shirpur Campus

> **Academic Prototype** · B.Tech CSE (Data Science) · Website Design & Development (WDD) · 2026  
> *NMIMS Shirpur Campus Complaint & Maintenance Management System*  
> *This is an independent academic project and is not an official NMIMS service.*

---

## Project Overview

CampusCare is a frontend-only campus complaint and maintenance management portal tailored for NMIMS Shirpur students. It provides a structured, responsive platform where students can report campus facility issues, track progress with unique ticket IDs, and view a complete resolution timeline. Demonstration portals for maintenance staff and administrators showcase workflow triage, technician work queues, priority escalations, and CSV report exports.

---

## System Architecture

CampusCare follows a clean, decoupled three-layer architecture designed for maintainability and extensibility. Complete architectural documentation is available in [ARCHITECTURE.md](ARCHITECTURE.md).

| Layer | Technology | Primary Responsibility | Files Involved |
|-------|------------|------------------------|----------------|
| **Frontend** | HTML5, CSS3, Vanilla JS (ES5) | Structure, interactive views, user navigation | `index.html`, `pages/*.html` |
| **UI / Presentation** | CSS3 (Variables, Grid, Flexbox) | Navy & Teal design system, typography, responsive breakpoints, dark mode | `css/style.css` |
| **Logic** | Vanilla JavaScript | Session auth, filtering engine, sidebar rendering, validation, escaping, CSV sanitizing | `js/app.js` |
| **Data** | Plain JavaScript Arrays + Web Storage | Data schemas, demo fixtures, CRUD persistence, data version migration | `js/data.js`, `localStorage`, `sessionStorage` |
| **Output** | Dynamic DOM Injection | Array-to-HTML rendering, card grids, data tables, reactive status badges | `renderList()`, `renderStats()`, `.innerHTML` |

---

## Project Structure

```
CampusCare/
├── index.html                  ← Landing page (features, how it works, theme toggle)
├── README.md                   ← Project overview, setup, and credentials
├── ARCHITECTURE.md             ← Technical architecture and data flow specification
├── css/
│   └── style.css               ← Complete presentation design system (light/dark mode)
├── js/
│   ├── data.js                 ← Data layer: schemas, seed arrays, Web Storage helpers
│   └── app.js                  ← Logic layer: auth, filtering, rendering, utilities
└── pages/
    ├── login.html              ← Unified role-based login with quick-fill demo buttons
    ├── student-dashboard.html  ← Student dashboard & live KPI metrics from complaint arrays
    ├── submit-complaint.html   ← Complaint submission form with cascading categories
    ├── my-complaints.html      ← Student complaint history with multi-criteria filters
    ├── complaint-detail.html   ← Detail view with URL parameter (?id=...), timeline & update panel
    ├── staff-dashboard.html    ← Maintenance staff work queue (filtered by assignedToId)
    ├── admin-dashboard.html    ← System-wide overview, category breakdown & demo reset
    └── manage-complaints.html  ← Admin triage table, staff assignment modal & CSV export
```

---

## Demo Credentials

All authentication is simulated for academic demonstration purposes. Click the **"Use"** button next to any credential on `pages/login.html` to auto-fill.

| Role | User ID | Password | Name | Department / Branch |
|------|---------|----------|------|---------------------|
| **Student** | `70012345678` | `student123` | Aarav Sharma | CSE-DS (Year 2) |
| **Student** | `70098765432` | `student123` | Priya Patel | CSE (Year 3) |
| **Staff** | `STAFF101` | `staff123` | Rajesh Verma | Maintenance |
| **Staff** | `STAFF102` | `staff123` | Suresh Kumar | Maintenance |
| **Staff** | `STAFF103` | `staff123` | Meena Joshi | Maintenance |
| **Staff** | `STAFF104` | `staff123` | Prakash Singh | Maintenance |
| **Admin** | `ADMIN001` | `admin123` | Dr. S. K. Mehta | Administration |

> **Security Note:** Authentication is simulated client-side with plaintext demo credentials. A real deployment needs server-side authentication, hashed passwords and server-side role checks.

---

## How to Run

1. Navigate to the `CampusCare` folder on your computer.
2. Double-click `index.html` to open it in any web browser (Chrome, Edge, Firefox, Safari).
3. Click **"Student Login"** or **"Login & Report"** to open the login page.
4. Click **"Use"** on any demo account, then click **"Sign In"**.

*Zero dependencies · No node/npm required · No build step · Fully functional via `file://` protocol.*

---

## Core Features

- **Sequential Ticket IDs:** IDs are generated from the highest existing ticket number + 1 (e.g. `CC-2026-00001`), ensuring unique, chronological identifiers.
- **Cascading Facility Categories:** Six campus facility types (Electrical, Plumbing, Civil, IT/Network, Housekeeping, Hostel) with dynamic sub-category population.
- **Client-Side Real-Time Filtering:** Instant multi-parameter filtering by status, category, priority, and free-text search across titles, locations, IDs, and descriptions without page reload.
- **Audit Timeline:** Every status change, assignment, technician note, and priority update is logged with an ISO timestamp and user identity in an append-only timeline.
- **Workflow State Management:** Maintenance staff follow verified status progression (`STATUS_FLOW`), while administrators have complete status and priority override authority.
- **Deep-Linkable Detail Page:** The complaint detail page reads IDs via URL query parameters (`complaint-detail.html?id=CC-2026-00001`), supporting direct linking and new browser tabs.
- **Student Resolution Feedback:** When a ticket is marked `Resolved`, the reporting student can directly confirm closure or reopen the complaint with a reason.
- **Accessible Modal & Dialogs:** WAI-ARIA compliant assignment modal (`role="dialog"`, `aria-modal="true"`) with Escape key handling, initial input focus, and focus restoration.
- **Sanitized CSV Export:** Neutralizes spreadsheet formula injection risks (`=`, `+`, `-`, `@`) and embeds a UTF-8 BOM for Microsoft Excel compatibility.
- **Light & Dark Theme Toggle:** CSS Variable-based theme switching persisted in `localStorage`.
- **Schema Migration & Demo Reset:** Automatically upgrades existing browser storage to schema version 2; includes an admin-only one-click demo data reset button.

---

## Known Limitations

- **Browser-Local Storage:** Data is persisted in `localStorage` and `sessionStorage`. Data is local to each browser profile and does not sync across different computers or browsers.
- **Simulated Authentication:** Intended for academic demonstration without server-side validation or password hashing.
- **No File Uploads:** Photo attachments are excluded in the prototype to prevent browser `localStorage` quota exhaustion.
- **No Push Notifications:** Email and push notifications are simulated in the timeline rather than dispatched over SMTP/SMS.

---

## Changelog

- **Task 1 — Navigation Redirects:** Added `rootPath()` to resolve correct relative pathing between root and sub-pages.
- **Task 2 — Shared Role-Aware Sidebar:** Implemented `buildSidebar(user, activePage)` with role-isolated navigation items and user profile chip.
- **Task 3 — Priority Sorting:** Fixed priority sorting bug in `manage-complaints.html` so `Urgent` complaints consistently appear at the top.
- **Task 4 — Staff Assignment:** Expanded staff demo accounts (STAFF101-STAFF104), integrated `getStaffList()`, added `assignedToId`, and replaced free-text inputs with dropdown selects.
- **Task 5 — Workflow State Rules:** Added `STATUS_FLOW` rules enforcing valid staff progression, combined timeline logging for status and notes, and eliminated page reloads on update.
- **Task 6 — URL Parameter Navigation:** Converted complaint details to `complaint-detail.html?id=...` with `URLSearchParams`, added `openComplaint()`, and eliminated inline ID handlers.
- **Task 7 — Priority Control:** Restricted student submission to Low, Normal, and High; granted administrators exclusive priority escalation controls (`Urgent`).
- **Task 8 — Duplicate Submission Guard:** Added submit button disabling and boolean submission lock on complaint submission.
- **Task 9 — Data Versioning & Migration:** Added `DATA_VERSION = 2` schema migration in `loadComplaints()` and implemented `resetDemoData()` with an admin confirmation trigger.
- **Task 10 — Theme Toggle Integrity:** Fixed `initTheme()` to preserve icon markup and added theme toggle buttons to landing and login pages.
- **Task 11 — Security Hardening:** Updated `esc()` with single-quote escaping (`&#39;`), sanitized CSV export cells against formula injection, and wrapped all JSON parsing in `try/catch`.
- **Task 12 — Accessibility Enhancements:** Added `role="status"` and `aria-live="polite"` to toast elements, added ARIA dialog attributes and keyboard focus traps to the modal, and ensured all form labels have matching `for` targets.
- **Task 13 — Honest Documentation:** Updated landing page and documentation to accurately describe implemented prototype features.
- **Task 14 — Architecture Alignment:** Formalized 3-layer architecture, authored `ARCHITECTURE.md`, eliminated DOM manipulation from `data.js`, and added shared helpers (`wireFilters`, `renderStats`).
- **Optional Feature — Student Feedback:** Allowed students to directly accept closure or reopen resolved complaints with timeline logging.

---

## Disclaimer

This website is an **independent academic prototype** developed for educational evaluation in the B.Tech Computer Science and Engineering (Data Science) Website Designing and Development (WDD) course at NMIMS Shirpur.

It is not an official portal of SVKM's NMIMS University and does not connect to NMIMS SAP, portal servers, or institutional databases. All data, names, and tickets are fictional demonstration records.

Official campus website: [shirpur.nmims.edu](https://shirpur.nmims.edu/)
