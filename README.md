# CreatorAI — Complete Staff Management Portal

> **A start-to-finish operations blueprint for the CreatorAI Staff Management Portal.**  
> Built for managing people, exact role hierarchies, departments, tasks, recruitment, global feature requests, and internal team operations.

---

## 🚀 Key Features

* **Master Admin Control Center**: Full administrative power to edit and configure workspace settings, members, roles, departments, tasks, knowledge documents, and announcements.
* **Global Reports & Feature Requests Hub**: Open globally to every team member to submit feature requests, bug reports, and operational improvements, with live upvoting and leadership response tracking.
* **Exact Role Hierarchy**: Configured with 28 exact titles across 6 role groups (Executive, Directors, Managers, Leads, Specialists, and Partners).
* **People & Staff Directory**: Granular access provisioning (email, password, role, department, admin rights, and account status).
* **Multi-View Task & Project Board**: Real operational task dispatching with stages (`To Do` → `In Progress` → `In Review` → `Done`).
* **Recruitment & Hiring Pipeline**: Applicant tracking from application intake to one-click hiring into active staff accounts.
* **Knowledge Base & SOP Wiki**: Standard operating procedures, security policies, onboarding roadmaps, and guidelines.
* **Tamper-Resistant Audit Trail**: Append-only logging of all administrative actions with real-time terminal stdout streaming.

---

## 🎨 Visual Design System (Dark SaaS)

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **App Background** | `#10131D` | Main page canvas background |
| **Sidebar / Topbar** | `#171B28` | Navigation surfaces |
| **Card Surface** | `#1E2433` | Cards, panels, modals |
| **Borders** | `#343B4D` | Subtle separators and outlines |
| **Primary Accent** | `#7057E8` | Royal violet for primary actions & focus |
| **Secondary Accent** | `#20B8CF` | Cyan for highlights, charts & badges |
| **Success** | `#159A72` | Active status, approved items |
| **Warning** | `#D98A18` | Due soon, under review |
| **Danger** | `#D64545` | Critical alerts, destructive actions |
| **Main Text** | `#F7F8FC` | Headings & primary typography |
| **Muted Text** | `#A6AEC0` | Metadata & secondary typography |

---

## 💻 Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Logging**: Discord-bot style color-coded terminal stdout logger

---

## 🛠 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3008](http://localhost:3008) in your browser.

### 3. Default Master Admin Credentials
* **Email**: `admin@creatorai.team`
* **Password**: `CreatorAI2026!`

---

## 📜 Compliance & Safeguards
* Data minimization & privacy retention controls (90-day recruitment auto-purge).
* Essential session cookies only — zero third-party ad tracking.
* Server-side rate limiting and append-only audit trail.
* WCAG 2.1 AA contrast ratio (`#F7F8FC` on `#10131D`).

---

## 📄 License
Private & Confidential — CreatorAI Platform Ltd. Registration #CR-2026-991.
