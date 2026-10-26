# CampusCare — Target Architecture & Technical Design

> **Academic Prototype** · B.Tech CSE (Data Science) · Website Design & Development (WDD) · 2026  
> *NMIMS Shirpur Campus Complaint & Maintenance Management System*

---

## 1. Overview

CampusCare is built on a **pure client-only, three-layer architecture**. There is no backend server, no database daemon, and no build pipeline. The application runs immediately upon opening `index.html` in any standard web browser (`file://` or HTTP). Browser `localStorage` acts as the persistent database, and `sessionStorage` maintains the active authentication session.

---

## 2. System Architecture Diagram

```
+-------------------------------------------------------------------------+
|                                  USER                                   |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                    PRESENTATION LAYER (HTML5 + CSS3)                    |
|  - Semantic HTML pages (thin controller pages: index.html & /pages/*.html)
|  - css/style.css: Design system, CSS variables, dark/light themes, media |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                         LOGIC LAYER (js/app.js)                         |
|  - Authentication & Route Guards (requireAuth, rootPath, login, logout) |
|  - Workflow rules & role access permissions                             |
|  - Multi-criteria real-time filtering engine (filterComplaints)          |
|  - Shared layout & component builders (buildSidebar, renderStats)       |
|  - Security & formatting utilities (esc, fmtDate, sanitizeCsvCell)      |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                         DATA LAYER (js/data.js)                         |
|  - Static reference arrays (DEMO_USERS, CATEGORIES, LOCATIONS)          |
|  - State transition rules (STATUS_FLOW)                                 |
|  - Initial seed data (SEED_COMPLAINTS with assignedToId)                |
|  - Schema versioning & data migration (DATA_VERSION = 2)                |
|  - Storage abstractions (loadComplaints, saveComplaints, loadSession)   |
|  - Web Storage: localStorage ("cc_complaints") & sessionStorage ("cc_user")
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                             DYNAMIC OUTPUT                              |
|  - Plain JS Arrays ──> HTML String Generation ──> DOM (.innerHTML)     |
|  - Zero full-page reloads for filtering, updates, and assignments       |
+-------------------------------------------------------------------------+
```

---

## 3. Layer Breakdown

| Layer | Technology | Primary Responsibility | Files Involved |
|-------|------------|------------------------|----------------|
| **Frontend** | HTML5, CSS3, Vanilla JS (ES5) | Structure, interactive views, user navigation | `index.html`, `pages/*.html` |
| **UI / Presentation** | CSS3 (Variables, Grid, Flexbox) | Navy & Teal design system, typography, responsive breakpoints, dark mode | `css/style.css` |
| **Logic** | Vanilla JavaScript | Session auth, filtering engine, sidebar rendering, validation, escaping, CSV sanitizing | `js/app.js` |
| **Data** | Plain JavaScript Arrays + Web Storage | Data schemas, demo fixtures, CRUD persistence, data version migration | `js/data.js`, `localStorage`, `sessionStorage` |
| **Output** | Dynamic DOM Injection | Array-to-HTML rendering, card grids, data tables, reactive status badges | `renderList()`, `renderStats()`, `.innerHTML` |

---

## 4. Data-Flow Walkthroughs

### Walkthrough A: A Student Filters Complaints
1. Student navigates to `pages/my-complaints.html`.
2. `requireAuth(["student"])` ensures valid session; `buildSidebar(user, "my-complaints")` injects navigation.
3. Category options populate dynamically from `CATEGORIES` array in `data.js`.
4. `loadComplaints()` retrieves array from `localStorage.getItem("cc_complaints")`.
5. User types in `#fSearch` or selects `#fStatus`, `#fCategory`, or `#fPriority`.
6. Event listener wired via `wireFilters()` calls `applyFilters()`.
7. `filterComplaints(complaints, filters)` evaluates predicates (user isolation `c.userId === user.id`, exact status, category, priority, and case-insensitive keyword match across title, ID, location, and description).
8. `renderList(container, filtered)` transforms matching complaint objects into HTML card markup via `complaintCard(c)`.
9. The resulting string is assigned to `complaintsGrid.innerHTML`. No network call or page reload occurs.
10. Clicking any card invokes `openComplaint(id)` which redirects to `complaint-detail.html?id=...`.

### Walkthrough B: Complaint Lifecycle Workflow
1. **Submission (`Submitted`):**
   - Student submits `pages/submit-complaint.html`.
   - Client validation runs; submit button disables to prevent duplicate submissions.
   - `nextId(complaints)` generates sequential ID based on `max(existing_ids) + 1` (e.g., `CC-2026-00006`).
   - New complaint pushed to array with `status: "Submitted"`, `assignedTo: ""`, `assignedToId: ""`, and initial timeline entry.
   - Saved to `localStorage` via `saveComplaints()`; user redirected to detail page via URL query parameter.
2. **Triage & Assignment (`Assigned`):**
   - Administrator opens `pages/manage-complaints.html` or `pages/complaint-detail.html?id=...`.
   - Admin selects a staff member from `getStaffList()`.
   - `assignedTo` (name) and `assignedToId` (e.g. `STAFF101`) are updated.
   - Status transitions to `"Assigned"`. Timeline appends assignment event.
3. **Work In Progress (`In Progress`):**
   - Assigned technician logs into `pages/staff-dashboard.html`.
   - Queue filters strictly by `c.assignedToId === user.id`.
   - Staff member clicks card, opens detail page, selects `"In Progress"`, enters work notes.
   - Guarded by `STATUS_FLOW["Assigned"] -> ["In Progress", "Waiting"]`.
   - Single timeline entry logs status transition and notes. Detail page re-renders immediately.
4. **Resolution (`Resolved`):**
   - Technician completes work, sets status to `"Resolved"`, logs resolution note.
   - Guarded by `STATUS_FLOW["In Progress"] -> ["Waiting", "Resolved"]`.
5. **Closure (`Closed`):**
   - Administrator can close ticket directly from manage table or detail panel.
   - Alternatively, student reviews resolved ticket on `complaint-detail.html` and clicks `"Accept & Close Ticket"`.
   - If issue persists, student clicks `"Reopen Issue"` which resets status to `"In Progress"` and appends reason to timeline.

---

## 5. Roles & Access Control Table

| Role | Access Scope | Allowed Status Actions | Enforcement Mechanism |
|------|--------------|------------------------|-----------------------|
| **Student** | Own complaints only (`c.userId === user.id`) | Submit complaints; view own complaints & details; close or reopen own `Resolved` complaints | `requireAuth(["student"])`; detail page checks `c.userId === user.id` (returns "Access denied" otherwise) |
| **Maintenance Staff** | Assigned complaints only (`c.assignedToId === user.id`) | Transition status according to `STATUS_FLOW` rules; add technician notes | `requireAuth(["staff"])`; work queue filters by `c.assignedToId === user.id`; detail update panel only active if assigned to current staff |
| **Administrator** | All system complaints across all categories | Full status override; staff assignment via `getStaffList()`; priority escalation (`Urgent`); CSV export; demo reset | `requireAuth(["admin"])`; unrestricted status options; assignment modal & priority edit controls active |

---

## 6. Storage Map

All client storage items used in the application:

| Key | Storage Type | Data Type | Purpose |
|-----|--------------|-----------|---------|
| `cc_complaints` | `localStorage` | JSON Array of Complaint Objects | Primary persistent complaint store |
| `cc_data_version` | `localStorage` | String (`"2"`) | Schema migration version indicator |
| `cc_theme` | `localStorage` | String (`"light"` or `"dark"`) | Persisted user visual theme preference |
| `cc_user` | `sessionStorage` | JSON User Object | Active authenticated session profile |

*Note: Navigation to complaint details uses URL query parameters (`complaint-detail.html?id=CC-2026-00001`). `cc_detail_id` is completely removed to allow deep-linking and browser tab opening.*

---

## 7. Key Architectural Decisions

1. **No Backend by Design:** The project strictly complies with academic constraints (frontend-only WDD). Demonstrates complete client-side architecture using modern Web APIs without backend dependencies.
2. **Strict Layer Separation:**
   - `data.js` contains zero DOM manipulation (pure data structures and storage handlers).
   - `app.js` houses all business logic, authorization, filtering, and HTML generation.
   - Individual HTML pages are thin orchestrators that only bind UI elements to logic functions.
3. **Single Reusable Filtering Engine:** All views (student list, staff queue, admin management) pass custom filter criteria into the shared `filterComplaints()` function, eliminating logic duplication.
4. **Append-Only Audit Timeline:** Status changes, assignments, notes, and priority updates are recorded with ISO timestamps and actor names in an append-only timeline array.
5. **Output Escaping & Defense-in-Depth:** All user-supplied inputs and identifiers are escaped via `esc()` before HTML injection, neutralizing XSS. CSV exports escape formula triggers (`=`, `+`, `-`, `@`) and include a UTF-8 BOM.
6. **Data Versioning & Seamless Migration:** Schema updates automatically upgrade existing `localStorage` payloads through `DATA_VERSION` checks in `loadComplaints()` without corrupting user entries.

---

## 8. Limitations & Future Scope

| Current Prototype State | Production Migration Path |
|-------------------------|---------------------------|
| **Client-side Web Storage:** Data is stored locally per browser instance. | Replace `js/data.js` storage methods with REST / GraphQL API calls (`fetch()`) to a backend (e.g. Node.js + Express). |
| **Simulated Authentication:** Plaintext demo credentials stored in array. | Implement secure session cookies / JWT tokens with bcrypt-hashed passwords in a database (MySQL, PostgreSQL, or MongoDB). |
| **Single-device Data:** Other users cannot see updates made on another browser. | Centralized database synchronization via WebSockets or polling for real-time status updates. |
| **Attachment Handling:** Prototype excludes file attachments to avoid localStorage quota exhaustion. | Connect multipart file uploads to S3 / cloud object storage. |

Because the logic and data layers are cleanly decoupled, upgrading CampusCare to a full-stack system requires replacing **only the data layer (`data.js`)** while keeping the presentation and logic layers intact.
