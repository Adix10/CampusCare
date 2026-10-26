# CampusCare — Campus Complaint & Maintenance Management System

A responsive, frontend-only web application for reporting, tracking, and managing campus facility complaints at NMIMS Shirpur.

**Academic Project | Website Design & Development (WDD) | B.Tech CSE (Data Science) | 2026–27**

> CampusCare is an independent academic prototype developed for educational purposes. It is not an official NMIMS service.

## Overview

CampusCare provides a centralized interface for managing campus maintenance complaints. Students can submit facility issues, receive unique ticket IDs, track complaint progress, and view their complaint history. Maintenance staff can access assigned tickets and update their status, while administrators can manage assignments, priorities, and complaint reports.

Built using HTML5, CSS3, and vanilla JavaScript, the application runs directly in a web browser without a backend server, external database, or build tools.

## Features

- **Complaint Management:** Submit complaints with categories, subcategories, campus locations, priorities, and descriptions.
- **Unique Ticket IDs:** Generate sequential complaint identifiers for tracking individual issues.
- **Role-Based Dashboards:** Separate interfaces for students, maintenance staff, and administrators.
- **Live Search & Filtering:** Filter complaints by status, category, priority, and keywords without reloading the page.
- **Complaint Timeline:** Maintain a history of status changes, assignments, technician notes, and priority updates.
- **Workflow Management:** Enforce defined complaint status transitions for maintenance staff.
- **Staff Assignment:** Assign complaints to maintenance personnel and manage their work queues.
- **Administrative Analytics:** Display complaint statistics and category summaries.
- **CSV Export:** Export complaint records with protection against common spreadsheet formula injection.
- **Student Feedback:** Allow students to confirm resolution or reopen a resolved complaint with a reason.
- **Light & Dark Themes:** Switch between themes using a CSS variable-based design system.
- **Responsive Interface:** Support desktop, tablet, and mobile layouts.
- **Data Migration:** Upgrade stored browser data when the application schema changes.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and forms |
| CSS3 | Responsive layouts, styling, and themes |
| Vanilla JavaScript | Application logic, validation, and interactivity |
| LocalStorage | Persistent complaint and application data |
| SessionStorage | Browser-session data |
| Git & GitHub | Version control and project hosting |

**Dependencies:** No frameworks, packages, Node.js, npm, or build process are required.

## Project Structure

```text
CampusCare/
├── index.html
├── README.md
├── ARCHITECTURE.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── data.js
└── pages/
    ├── login.html
    ├── student-dashboard.html
    ├── submit-complaint.html
    ├── my-complaints.html
    ├── complaint-detail.html
    ├── staff-dashboard.html
    ├── admin-dashboard.html
    └── manage-complaints.html
```

## System Architecture

CampusCare uses a three-layer client-side architecture.

| Layer | Responsibility | Main Files |
|---|---|---|
| Presentation | Page structure, layout, themes, and responsive design | `index.html`, `pages/*.html`, `css/style.css` |
| Application Logic | Authentication checks, validation, filtering, rendering, and workflow rules | `js/app.js` |
| Data Management | Data structures, demonstration records, browser storage, and schema migration | `js/data.js` |

The browser's Web Storage APIs provide local persistence. JavaScript manages application logic and updates the interface dynamically.

For the detailed architecture and data flow, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Getting Started

### Prerequisites

- A modern web browser such as Google Chrome, Microsoft Edge, or Mozilla Firefox.
- A local copy of this repository.

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Adix10/CampusCare.git
   ```

2. Open the project directory:

   ```bash
   cd CampusCare
   ```

3. Open `index.html` in your web browser.
4. Navigate to the login page and select a demonstration account.

No installation, dependency setup, or compilation is required.

## Demonstration Accounts

The application includes fictional accounts for testing its three user roles.

| Role | User ID | Password |
|---|---|---|
| Student | `70012345678` | `student123` |
| Student | `70098765432` | `student123` |
| Maintenance Staff | `STAFF101` | `staff123` |
| Maintenance Staff | `STAFF102` | `staff123` |
| Maintenance Staff | `STAFF103` | `staff123` |
| Maintenance Staff | `STAFF104` | `staff123` |
| Administrator | `ADMIN001` | `admin123` |

On the login page, use the available **Use** buttons to autofill demonstration credentials.

**Security notice:** These credentials are intentionally included for demonstration. Authentication is simulated on the client side and is not suitable for production use.

## Complaint Lifecycle

The application supports the following complaint workflow:

`Submitted → Assigned → In Progress → Resolved → Closed`

A complaint may also move to **Waiting** when parts or access are pending. A resolved complaint can be reopened when the issue persists. Permitted status transitions depend on the user's role and the defined workflow.

## Testing & Validation

The project documentation records checks covering:

- Ticket ID generation and data migration.
- Complaint status workflow and staff assignment.
- Priority sorting and real-time filtering.
- Output escaping and CSV formula-injection protection.
- Role-specific dashboards and navigation.
- Form submission safeguards and browser-storage error handling.
- Stylesheet and JavaScript resource paths.

These checks relate to the academic prototype and do not constitute a production security audit.

## Known Limitations

- **No backend:** Data is stored locally in the browser and is not shared between users or devices.
- **Simulated authentication:** Credentials and role checks are handled client-side; they do not provide production-grade security.
- **No file attachments:** Complaint photo uploads are not implemented.
- **No external notifications:** Email, SMS, and push notifications are not sent.
- **Demonstration data:** Names, accounts, and complaint records are fictional.

## Future Scope

- Integrate a backend API and centralized database.
- Implement server-side authentication, password hashing, and authorization.
- Add image attachments and maintenance evidence.
- Introduce email and SMS notifications.
- Add analytics for complaint trends and resolution times.
- Develop a mobile application for easier campus access.

## Academic Context

**Course:** Website Design & Development (WDD)  
**Program:** B.Tech Computer Science and Engineering (Data Science)  
**Institution:** SVKM's NMIMS, Mukesh Patel School of Technology Management & Engineering, Shirpur Campus  
**Academic Session:** 2026–27

**Project Contributors**
- Aditya Sharma — D218
- Megh Tandel — D228

**Project Guide:** Dr. Naziya Hussain, Assistant Professor, Department of Computer Engineering

## Disclaimer

CampusCare is an independent academic project created for educational evaluation. It is not affiliated with, endorsed by, or operated as an official service of NMIMS University. It does not connect to institutional SAP systems, university servers, or official student databases. All demonstration accounts and records are fictional.

Official campus website: [shirpur.nmims.edu](https://shirpur.nmims.edu/)

---

*Developed as a Website Design & Development mini project, 2026–27.*
