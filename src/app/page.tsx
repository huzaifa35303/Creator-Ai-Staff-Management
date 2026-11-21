'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  UserPlus,
  Clock,
  CheckSquare,
  Award,
  AlertTriangle,
  Megaphone,
  Settings,
  Bell,
  Search,
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock3,
  HelpCircle,
  LogOut,
  FolderGit2,
  Layers,
  Lock,
  Eye,
  EyeOff,
  SlidersHorizontal,
  KeyRound,
  Check,
  Trash2,
  Cookie,
  Scale,
  GitBranch,
  BookOpen,
  Edit2,
  X,
  UserX,
  RefreshCw,
  Sliders,
  Shield,
  Briefcase,
  MessageSquarePlus,
  ThumbsUp,
  MessageCircle,
  Globe,
  Sparkles,
  Vote,
  Filter,
} from 'lucide-react';
import { EXACT_ROLE_NAMES, RoleDefinition } from '@/data/roles';

// Core Data Entities
export interface StaffEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  group: 'Executive' | 'Directors' | 'Managers' | 'Leads' | 'Specialists' | 'Partners';
  department: string;
  status: 'Active' | 'On Leave' | 'Probation' | 'Suspended';
  isAdmin: boolean;
  joinDate: string;
}

export interface DepartmentEntity {
  id: string;
  name: string;
  lead: string;
  color: string;
  description: string;
}

export interface TaskEntity {
  id: string;
  title: string;
  department: string;
  assignee: string;
  stage: 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Blocked' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
}

export interface ApplicantEntity {
  id: string;
  name: string;
  email: string;
  appliedRole: string;
  stage: 'New' | 'Under Review' | 'Interview' | 'Approved' | 'Rejected';
  score: number;
  date: string;
}

export interface DocEntity {
  id: string;
  title: string;
  category: 'SOP' | 'Policy' | 'Onboarding' | 'Guidelines';
  author: string;
  lastUpdated: string;
  content: string;
}

export interface AnnouncementEntity {
  id: string;
  title: string;
  author: string;
  date: string;
  category: 'System' | 'Operational' | 'Urgent';
  content: string;
}

// Global Report & Feature Request Entity
export interface ReportEntity {
  id: string;
  title: string;
  category: 'Feature Request' | 'Bug Report' | 'Improvement' | 'Tooling Need';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'Under Review' | 'Approved for Roadmap' | 'Implemented' | 'Closed';
  author: string;
  authorRole: string;
  authorEmail: string;
  createdAt: string;
  votes: number;
  voters: string[];
  description: string;
  adminResponse?: string;
}

// Global System Configuration
export interface SystemConfig {
  workspaceName: string;
  organizationTagline: string;
  primaryTimezone: string;
  mfaEnforced: boolean;
  dataRetentionDays: number;
  maintenanceMode: boolean;
}

// Initial Clean State
const INITIAL_ADMIN_MEMBER: StaffEntity = {
  id: 'STF-001',
  name: 'System Administrator (Owner)',
  email: 'admin@creatorai.team',
  password: 'CreatorAI2026!',
  role: 'CEO Of Creator AI',
  group: 'Executive',
  department: 'Executive Leadership',
  status: 'Active',
  isAdmin: true,
  joinDate: new Date().toISOString().split('T')[0],
};

const INITIAL_DEPARTMENTS: DepartmentEntity[] = [
  { id: 'dep-exec', name: 'Executive Leadership', lead: 'System Administrator', color: '#7057E8', description: 'Organisation direction and executive governance.' },
  { id: 'dep-ops', name: 'Operations & Governance', lead: 'Unassigned', color: '#0EA5E9', description: 'Internal workflow execution and process standards.' },
  { id: 'dep-comm', name: 'Community & Engagement', lead: 'Unassigned', color: '#EC4899', description: 'Platform community management and moderation.' },
  { id: 'dep-creative', name: 'Creative & Design', lead: 'Unassigned', color: '#F97316', description: 'Visual design, branding, and motion assets.' },
  { id: 'dep-edit', name: 'Editorial & Post-Production', lead: 'Unassigned', color: '#8B5CF6', description: 'Video editing, pacing, sound and final QC.' },
  { id: 'dep-tech', name: 'Technology & Bots', lead: 'Unassigned', color: '#3B82F6', description: 'Bot automations and AI tooling infrastructure.' },
  { id: 'dep-marketing', name: 'Marketing & Growth', lead: 'Unassigned', color: '#EAB308', description: 'Outreach campaigns and audience growth.' },
  { id: 'dep-partners', name: 'Partnerships & Creators', lead: 'Unassigned', color: '#159A72', description: 'Creator CRM and external brand collaborations.' },
];

const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  workspaceName: 'CreatorAI Staff Management',
  organizationTagline: 'Private team workspace for people, roles, tasks and internal operations.',
  primaryTimezone: 'UTC',
  mfaEnforced: true,
  dataRetentionDays: 90,
  maintenanceMode: false,
};

export default function CreatorAIPortal() {
  // Persistent State
  const [members, setMembers] = useState<StaffEntity[]>([INITIAL_ADMIN_MEMBER]);
  const [departments, setDepartments] = useState<DepartmentEntity[]>(INITIAL_DEPARTMENTS);
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [applicants, setApplicants] = useState<ApplicantEntity[]>([]);
  const [documents, setDocuments] = useState<DocEntity[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementEntity[]>([]);
  const [reports, setReports] = useState<ReportEntity[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);
  const [auditLogs, setAuditLogs] = useState<{ action: string; actor: string; target: string; time: string }[]>([
    { action: 'PORTAL_INITIALIZATION', actor: 'System Admin', target: 'Clean Portal Initialized', time: 'Just now' },
  ]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<StaffEntity | null>(INITIAL_ADMIN_MEMBER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Navigation
  const [activeTab, setActiveTab] = useState<'admin_center' | 'reports_hub' | 'members' | 'departments' | 'tasks' | 'recruitment' | 'knowledge' | 'roles' | 'settings'>('admin_center');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportFilter, setReportFilter] = useState<'All' | 'Feature Request' | 'Bug Report' | 'Improvement' | 'Tooling Need'>('All');

  // Modals
  const [activeModal, setActiveModal] = useState<
    'add_member' | 'edit_member' | 'add_dept' | 'edit_dept' | 'add_task' | 'add_applicant' | 'add_doc' | 'add_announcement' | 'submit_report' | 'edit_report' | 'edit_system_config' | null
  >(null);

  // Form states
  const [editingMember, setEditingMember] = useState<StaffEntity | null>(null);
  const [memberForm, setMemberForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: string;
    department: string;
    isAdmin: boolean;
    status: StaffEntity['status'];
  }>({
    name: '',
    email: '',
    password: '',
    role: EXACT_ROLE_NAMES[0].title,
    department: INITIAL_DEPARTMENTS[0].name,
    isAdmin: false,
    status: 'Active',
  });

  const [editingDept, setEditingDept] = useState<DepartmentEntity | null>(null);
  const [deptForm, setDeptForm] = useState({ name: '', lead: '', color: '#7057E8', description: '' });

  const [taskForm, setTaskForm] = useState({
    title: '',
    department: INITIAL_DEPARTMENTS[0].name,
    assignee: 'Unassigned',
    stage: 'To Do' as const,
    priority: 'Medium' as const,
    dueDate: '2026-11-30',
  });

  const [applicantForm, setApplicantForm] = useState({
    name: '',
    email: '',
    appliedRole: EXACT_ROLE_NAMES[0].title,
    score: 85,
  });

  const [docForm, setDocForm] = useState({
    title: '',
    category: 'SOP' as const,
    content: '',
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    category: 'Operational' as const,
    content: '',
  });

  const [reportForm, setReportForm] = useState({
    title: '',
    category: 'Feature Request' as const,
    priority: 'Medium' as const,
    description: '',
  });

  const [editingReport, setEditingReport] = useState<ReportEntity | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminReportStatus, setAdminReportStatus] = useState<ReportEntity['status']>('Under Review');

  const [configForm, setConfigForm] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);

  // LocalStorage initialization & persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem('creatorai_portal_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.members) setMembers(parsed.members);
        if (parsed.departments) setDepartments(parsed.departments);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.applicants) setApplicants(parsed.applicants);
        if (parsed.documents) setDocuments(parsed.documents);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.reports) setReports(parsed.reports);
        if (parsed.systemConfig) {
          setSystemConfig(parsed.systemConfig);
          setConfigForm(parsed.systemConfig);
        }
      }
    } catch (e) {}
  }, []);

  const saveToStorage = (updates: any) => {
    try {
      const current = {
        members,
        departments,
        tasks,
        applicants,
        documents,
        announcements,
        reports,
        systemConfig,
        ...updates,
      };
      localStorage.setItem('creatorai_portal_state', JSON.stringify(current));
    } catch (e) {}
  };

  const addAuditLog = (action: string, target: string) => {
    const newLog = {
      action,
      actor: currentUser?.name || 'Admin',
      target,
      time: new Date().toLocaleTimeString() + ' UTC',
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 40)]);
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: 'info', message: `[AUDIT] ${action}: ${target} by ${newLog.actor}` }),
    }).catch(() => {});
  };

  // --- CRUD ACTIONS ---

  // 1. Members
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    const roleDef = EXACT_ROLE_NAMES.find((r) => r.title === memberForm.role) || EXACT_ROLE_NAMES[0];

    if (editingMember) {
      const updated = members.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: memberForm.name,
              email: memberForm.email,
              password: memberForm.password || m.password,
              role: memberForm.role,
              group: roleDef.group,
              department: memberForm.department,
              isAdmin: memberForm.isAdmin,
              status: memberForm.status,
            }
          : m
      );
      setMembers(updated);
      saveToStorage({ members: updated });
      addAuditLog('STAFF_UPDATE', `Updated staff: ${memberForm.email} (${memberForm.role})`);
    } else {
      const newStaff: StaffEntity = {
        id: `STF-${Date.now().toString().slice(-4)}`,
        name: memberForm.name,
        email: memberForm.email.toLowerCase().trim(),
        password: memberForm.password || 'CreatorAI2026!',
        role: memberForm.role,
        group: roleDef.group,
        department: memberForm.department,
        status: memberForm.status,
        isAdmin: memberForm.isAdmin,
        joinDate: new Date().toISOString().split('T')[0],
      };
      const updated = [...members, newStaff];
      setMembers(updated);
      saveToStorage({ members: updated });
      addAuditLog('STAFF_PROVISION', `Provisioned access for: ${newStaff.email}`);
    }
    closeModal();
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Revoke and delete staff member "${name}"?`)) {
      const updated = members.filter((m) => m.id !== id);
      setMembers(updated);
      saveToStorage({ members: updated });
      addAuditLog('STAFF_DELETION', `Deleted staff member: ${name}`);
    }
  };

  // 2. Departments
  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      const updated = departments.map((d) => (d.id === editingDept.id ? { ...d, ...deptForm } : d));
      setDepartments(updated);
      saveToStorage({ departments: updated });
      addAuditLog('DEPT_UPDATE', `Updated department: ${deptForm.name}`);
    } else {
      const newDept: DepartmentEntity = { id: `dep-${Date.now().toString().slice(-4)}`, ...deptForm };
      const updated = [...departments, newDept];
      setDepartments(updated);
      saveToStorage({ departments: updated });
      addAuditLog('DEPT_CREATED', `Created department: ${newDept.name}`);
    }
    closeModal();
  };

  const handleDeleteDepartment = (id: string, name: string) => {
    if (confirm(`Delete department "${name}"?`)) {
      const updated = departments.filter((d) => d.id !== id);
      setDepartments(updated);
      saveToStorage({ departments: updated });
      addAuditLog('DEPT_DELETED', `Deleted department: ${name}`);
    }
  };

  // 3. Tasks
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: TaskEntity = { id: `TSK-${Date.now().toString().slice(-4)}`, ...taskForm };
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveToStorage({ tasks: updated });
    addAuditLog('TASK_CREATED', `Created task: "${newTask.title}"`);
    closeModal();
  };

  const handleUpdateTaskStage = (id: string, stage: TaskEntity['stage']) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, stage } : t));
    setTasks(updated);
    saveToStorage({ tasks: updated });
    addAuditLog('TASK_STAGE_CHANGE', `Moved task to ${stage}`);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveToStorage({ tasks: updated });
    addAuditLog('TASK_DELETED', `Deleted task ${id}`);
  };

  // 4. Recruitment
  const handleSaveApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: ApplicantEntity = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      ...applicantForm,
      stage: 'New',
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [...applicants, newApp];
    setApplicants(updated);
    saveToStorage({ applicants: updated });
    addAuditLog('APPLICANT_LOGGED', `Candidate: ${newApp.name} for ${newApp.appliedRole}`);
    closeModal();
  };

  const handleHireApplicant = (app: ApplicantEntity) => {
    const roleDef = EXACT_ROLE_NAMES.find((r) => r.title === app.appliedRole) || EXACT_ROLE_NAMES[0];
    const generatedPassword = 'Join' + Math.floor(1000 + Math.random() * 9000) + '!';

    const newStaff: StaffEntity = {
      id: `STF-${Date.now().toString().slice(-4)}`,
      name: app.name,
      email: app.email,
      password: generatedPassword,
      role: app.appliedRole,
      group: roleDef.group,
      department: roleDef.department,
      status: 'Active',
      isAdmin: false,
      joinDate: new Date().toISOString().split('T')[0],
    };

    const updatedMembers = [...members, newStaff];
    const updatedApps = applicants.map((a) => (a.id === app.id ? { ...a, stage: 'Approved' as const } : a));

    setMembers(updatedMembers);
    setApplicants(updatedApps);
    saveToStorage({ members: updatedMembers, applicants: updatedApps });
    addAuditLog('CANDIDATE_HIRED', `Candidate ${app.name} hired as ${newStaff.role}`);
    alert(`Candidate successfully hired! Provisioned account created for ${app.email} with password: ${generatedPassword}`);
  };

  // 5. Knowledge Docs
  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: DocEntity = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      title: docForm.title,
      category: docForm.category,
      author: currentUser?.name || 'Admin',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content: docForm.content,
    };
    const updated = [...documents, newDoc];
    setDocuments(updated);
    saveToStorage({ documents: updated });
    addAuditLog('DOC_PUBLISHED', `Created doc: ${newDoc.title}`);
    closeModal();
  };

  // 6. Announcements
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: AnnouncementEntity = {
      id: `ANN-${Date.now().toString().slice(-4)}`,
      title: announcementForm.title,
      category: announcementForm.category,
      author: currentUser?.name || 'Admin',
      date: new Date().toISOString().split('T')[0],
      content: announcementForm.content,
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    saveToStorage({ announcements: updated });
    addAuditLog('ANNOUNCEMENT_POSTED', `Broadcast: "${newAnn.title}"`);
    closeModal();
  };

  // 7. Global Reports & Feature Requests Hub
  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newRep: ReportEntity = {
      id: `REP-${Date.now().toString().slice(-4)}`,
      title: reportForm.title,
      category: reportForm.category,
      priority: reportForm.priority,
      status: 'Open',
      author: currentUser?.name || 'Team Member',
      authorRole: currentUser?.role || 'Staff',
      authorEmail: currentUser?.email || 'user@creatorai.team',
      createdAt: new Date().toISOString().split('T')[0],
      votes: 1,
      voters: [currentUser?.email || 'user@creatorai.team'],
      description: reportForm.description,
    };
    const updated = [newRep, ...reports];
    setReports(updated);
    saveToStorage({ reports: updated });
    addAuditLog('REPORT_SUBMITTED', `New report/feature request: "${newRep.title}" by ${newRep.author}`);
    closeModal();
  };

  const handleToggleVote = (reportId: string) => {
    if (!currentUser) return;
    const userEmail = currentUser.email;

    const updated = reports.map((r) => {
      if (r.id === reportId) {
        const hasVoted = r.voters.includes(userEmail);
        const newVoters = hasVoted ? r.voters.filter((e) => e !== userEmail) : [...r.voters, userEmail];
        return {
          ...r,
          votes: newVoters.length,
          voters: newVoters,
        };
      }
      return r;
    });

    setReports(updated);
    saveToStorage({ reports: updated });
  };

  const handleAdminUpdateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    const updated = reports.map((r) =>
      r.id === editingReport.id
        ? {
            ...r,
            status: adminReportStatus,
            adminResponse: adminReplyText,
          }
        : r
    );

    setReports(updated);
    saveToStorage({ reports: updated });
    addAuditLog('REPORT_MODERATION', `Admin updated report ${editingReport.id} to ${adminReportStatus}`);
    closeModal();
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm('Delete this report / feature request?')) {
      const updated = reports.filter((r) => r.id !== reportId);
      setReports(updated);
      saveToStorage({ reports: updated });
      addAuditLog('REPORT_DELETED', `Deleted report ${reportId}`);
    }
  };

  // 8. Global System Config
  const handleSaveSystemConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSystemConfig(configForm);
    saveToStorage({ systemConfig: configForm });
    addAuditLog('SYSTEM_CONFIG_UPDATED', `Admin updated global workspace settings`);
    closeModal();
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingMember(null);
    setEditingDept(null);
    setEditingReport(null);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const matched = members.find((m) => m.email.toLowerCase().trim() === loginEmail.toLowerCase().trim());
    if (!matched) {
      setLoginError('Access Denied: Email is not registered or provisioned in CreatorAI.');
      return;
    }
    if (matched.password !== loginPassword) {
      setLoginError('Invalid password. Please check your credentials.');
      return;
    }

    setCurrentUser(matched);
    setIsAuthenticated(true);
    setLoginEmail('');
    setLoginPassword('');
    addAuditLog('STAFF_LOGIN', `${matched.name} signed in`);
  };

  // Filtered reports
  const filteredReports = reports.filter(
    (r) => reportFilter === 'All' || r.category === reportFilter
  );

  // Filtered staff
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // SIGN IN GATEWAY (IF LOGGED OUT)
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-[#10131D] text-[#F7F8FC] flex flex-col justify-between selection:bg-[#7057E8] selection:text-white">
        <header className="h-16 px-8 flex items-center justify-between border-b border-[#343B4D] bg-[#171B28]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7057E8] flex items-center justify-center font-bold text-white shadow-md shadow-[#7057E8]/30">
              C
            </div>
            <div>
              <span className="font-semibold text-sm tracking-wide text-[#F7F8FC]">{systemConfig.workspaceName}</span>
              <span className="text-[11px] text-[#A6AEC0] ml-2 font-mono">STAFF ACCESS GATEWAY</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-[#1E2433] border border-[#343B4D] rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#7057E8]/10 border border-[#7057E8]/30 text-[#7057E8] mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-[#F7F8FC]">{systemConfig.workspaceName}</h1>
              <p className="text-xs text-[#A6AEC0] mt-1">
                Enter your admin-provisioned email and password to access the portal.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-[#D64545]/15 border border-[#D64545]/40 rounded-lg flex items-start gap-2 text-xs text-[#D64545]">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1.5">Authorized Email</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@creatorai.team"
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3.5 py-2.5 text-xs text-[#F7F8FC] placeholder-[#A6AEC0] outline-none focus:border-[#7057E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg pl-3.5 pr-10 py-2.5 text-xs text-[#F7F8FC] placeholder-[#A6AEC0] outline-none focus:border-[#7057E8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#A6AEC0] hover:text-[#F7F8FC]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#7057E8] text-white text-xs font-semibold rounded-lg shadow hover:bg-[#6045d8] transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#343B4D]">
              <p className="text-[10px] uppercase font-mono text-[#A6AEC0] mb-2">Master Admin Preset:</p>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('admin@creatorai.team');
                  setLoginPassword('CreatorAI2026!');
                }}
                className="w-full text-left p-2.5 rounded bg-[#10131D] hover:bg-[#171B28] border border-[#343B4D] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-[#F7F8FC]">Master Admin (Owner)</span>
                  <span className="text-[11px] text-[#A6AEC0] block">admin@creatorai.team</span>
                </div>
                <span className="px-2 py-0.5 text-[9px] bg-[#7057E8]/20 text-[#7057E8] border border-[#7057E8]/40 rounded font-mono">
                  Auto Fill
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // AUTHENTICATED REAL WORKSPACE
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#10131D] text-[#F7F8FC]">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 flex-shrink-0 bg-[#171B28] border-r border-[#343B4D] flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#343B4D]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7057E8] flex items-center justify-center font-bold text-white shadow-md shadow-[#7057E8]/30">
                C
              </div>
              <div>
                <span className="font-semibold tracking-wide text-sm text-[#F7F8FC] truncate max-w-[130px] block">
                  {systemConfig.workspaceName}
                </span>
                <span className="block text-[10px] font-medium text-[#A6AEC0] tracking-wider uppercase">Portal Engine</span>
              </div>
            </div>
            {currentUser.isAdmin && (
              <span className="px-2 py-0.5 text-[10px] bg-[#7057E8]/20 text-[#7057E8] border border-[#7057E8]/40 rounded font-mono font-bold">
                ADMIN
              </span>
            )}
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            <div className="text-[10px] font-semibold text-[#A6AEC0] px-3 pt-2 pb-1 uppercase tracking-wider">
              Management
            </div>

            {/* Admin Control Center */}
            <button
              onClick={() => setActiveTab('admin_center')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                activeTab === 'admin_center' ? 'bg-[#7057E8] text-white shadow-sm' : 'text-[#A6AEC0] hover:text-[#F7F8FC] hover:bg-[#1E2433]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-[#20B8CF]" />
                <span>Admin Control Panel</span>
              </div>
              <span className="text-[9px] bg-[#1E2433] px-1.5 py-0.5 rounded text-[#20B8CF] font-mono">MASTER</span>
            </button>

            {/* Global Reports & Feature Requests Hub */}
            <button
              onClick={() => setActiveTab('reports_hub')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                activeTab === 'reports_hub' ? 'bg-[#7057E8] text-white shadow-sm' : 'text-[#A6AEC0] hover:text-[#F7F8FC] hover:bg-[#1E2433]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-[#7057E8]" />
                <span>Reports & Features</span>
              </div>
              <span className="text-[10px] bg-[#7057E8]/20 text-[#7057E8] px-1.5 py-0.5 rounded font-mono">
                {reports.length}
              </span>
            </button>

            {/* Real Members */}
            <button
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                activeTab === 'members' ? 'bg-[#7057E8] text-white shadow-sm' : 'text-[#A6AEC0] hover:text-[#F7F8FC] hover:bg-[#1E2433]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Members & Staff</span>
              </div>
              <span className="text-[10px] bg-[#1E2433] px-1.5 py-0.5 rounded text-[#F7F8FC] font-mono">{members.length}</span>
            </button>

            {/* Real Departments */}
            <button
              onClick={() => setActiveTab('departments')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                activeTab === 'departments' ? 'bg-[#7057E8] text-white shadow-sm' : 'text-[#A6AEC0] hover:text-[#F7F8FC] hover:bg-[#1E2433]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-[#EAB308]" />
                <span>Departments</span>
              </div>
              <span className="text-[10px] bg-[#1E2433] px-1.5 py-0.5 rounded text-[#F7F8FC] font-mono">{departments.length}</span>
            </button>

            {/* Real Tasks */}
            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                activeTab === 'tasks' ? 'bg-[#7057E8] text-white shadow-sm' : 'text-[#A6AEC0] hover:text-[#F7F8FC] hover:bg-[#1E2433]'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 text-[#159A72]" />
                <span>Tasks & Projects</span>
              </div>
              <span className="text-[10px] bg-[#1E2433] px-1.5 py-0.5 rounded text-[#159A72] font-mono">{tasks.length}</span>
            </button>

            {/* Real Recruitment */}
            <button
              onClick={() => setActiveTab('recruitment')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                activeTab === 'recruitment' ? 'bg-[#7057E8] text-white shadow-sm' : 'text-[#A6AEC0] hover:text-[#F7F8FC] hover:bg-[#1E2433]'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserPlus className="w-4 h-4 text-[#20B8CF]" />
                <span>Recruitment Pipeline</span>
              </div>
              <span className="text-[10px] bg-[#1E2433] px-1.5 py-0.5 rounded text-[#20B8CF] font-mono">{applicants.length}</span>
            </button>

            {/* Knowledge Base */}
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                activeTab === 'knowledge' ? 'bg-[#7057E8] text-white shadow-sm' : 'text-[#A6AEC0] hover:text-[#F7F8FC] hover:bg-[#1E2433]'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-[#7057E8]" />
                <span>Knowledge & SOPs</span>
              </div>
              <span className="text-[10px] bg-[#1E2433] px-1.5 py-0.5 rounded text-[#A6AEC0] font-mono">{documents.length}</span>
            </button>

            <div className="text-[10px] font-semibold text-[#A6AEC0] px-3 pt-3 pb-1 uppercase tracking-wider">
              Governance
            </div>

            <button
              onClick={() => setActiveTab('roles')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition ${
                activeTab === 'roles' ? 'bg-[#7057E8] text-white shadow-sm' : 'text-[#A6AEC0] hover:text-[#F7F8FC] hover:bg-[#1E2433]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Roles & Hierarchy</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition ${
                activeTab === 'settings' ? 'bg-[#7057E8] text-white shadow-sm' : 'text-[#A6AEC0] hover:text-[#F7F8FC] hover:bg-[#1E2433]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Audit Logs & Security</span>
            </button>
          </nav>
        </div>

        {/* Current User Card & Logout */}
        <div className="p-3 border-t border-[#343B4D] bg-[#10131D]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#1E2433] border border-[#343B4D] flex items-center justify-center text-xs font-semibold text-[#20B8CF]">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-[#F7F8FC] truncate">{currentUser.name}</p>
                <p className="text-[10px] text-[#A6AEC0] truncate">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentUser(null);
                setIsAuthenticated(false);
              }}
              title="Sign Out"
              className="text-[#A6AEC0] hover:text-[#D64545] p-1.5 rounded transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-6 bg-[#171B28] border-b border-[#343B4D] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#A6AEC0]">{systemConfig.workspaceName}</span>
            <span className="text-xs text-[#343B4D]">/</span>
            <span className="text-xs font-medium text-[#F7F8FC] capitalize">{activeTab.replace('_', ' ')}</span>
            <span className="px-2 py-0.5 text-[10px] bg-[#1E2433] text-[#7057E8] border border-[#343B4D] rounded ml-2 font-mono">
              Live State
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Submit Report / Feature button visible to everyone */}
            <button
              onClick={() => {
                setReportForm({
                  title: '',
                  category: 'Feature Request',
                  priority: 'Medium',
                  description: '',
                });
                setActiveModal('submit_report');
              }}
              className="px-3 py-1.5 bg-[#1E2433] border border-[#343B4D] hover:border-[#7057E8] text-[#F7F8FC] rounded text-xs font-medium transition flex items-center gap-1.5"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#20B8CF]" />
              Submit Report / Feature
            </button>

            {/* Quick Action Button for Admin */}
            {currentUser.isAdmin && (
              <button
                onClick={() => {
                  setEditingMember(null);
                  setMemberForm({
                    name: '',
                    email: '',
                    password: '',
                    role: EXACT_ROLE_NAMES[0].title,
                    department: departments[0]?.name || 'Operations',
                    isAdmin: false,
                    status: 'Active',
                  });
                  setActiveModal('add_member');
                }}
                className="px-3 py-1.5 bg-[#7057E8] text-white rounded text-xs font-medium shadow hover:bg-[#6045d8] transition flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Member
              </button>
            )}

            <button
              onClick={() => {
                setCurrentUser(null);
                setIsAuthenticated(false);
              }}
              className="px-2.5 py-1.5 text-xs text-[#A6AEC0] hover:text-[#D64545] border border-[#343B4D] bg-[#1E2433] rounded flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#10131D]">
          {/* TAB 1: MASTER ADMIN CONTROL PANEL */}
          {activeTab === 'admin_center' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#343B4D]">
                <div>
                  <h1 className="text-xl font-bold text-[#F7F8FC] flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#20B8CF]" />
                    Admin Master Control Center
                  </h1>
                  <p className="text-xs text-[#A6AEC0] mt-0.5">
                    Full control to edit, configure, and customize everything across the entire workspace.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setConfigForm(systemConfig);
                      setActiveModal('edit_system_config');
                    }}
                    className="px-3 py-1.5 bg-[#1E2433] border border-[#343B4D] hover:border-[#7057E8] text-xs font-medium text-[#F7F8FC] rounded transition flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#7057E8]" />
                    Edit Workspace Settings
                  </button>
                </div>
              </div>

              {/* Workspace Config Card */}
              <div className="p-4 bg-[#171B28] border border-[#343B4D] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-sm font-bold text-[#F7F8FC]">{systemConfig.workspaceName}</h2>
                    <span className="px-2 py-0.5 text-[9px] font-mono bg-[#159A72]/20 text-[#159A72] rounded">LIVE</span>
                  </div>
                  <p className="text-xs text-[#A6AEC0]">{systemConfig.organizationTagline}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 bg-[#1E2433] border border-[#343B4D] rounded text-[#A6AEC0]">
                    Timezone: <strong className="text-[#F7F8FC]">{systemConfig.primaryTimezone}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-[#1E2433] border border-[#343B4D] rounded text-[#A6AEC0]">
                    MFA: <strong className={systemConfig.mfaEnforced ? 'text-[#159A72]' : 'text-[#D98A18]'}>{systemConfig.mfaEnforced ? 'Strict' : 'Optional'}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-[#1E2433] border border-[#343B4D] rounded text-[#A6AEC0]">
                    Retention: <strong className="text-[#F7F8FC]">{systemConfig.dataRetentionDays} Days</strong>
                  </span>
                </div>
              </div>

              {/* Real Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#1E2433] border border-[#343B4D] rounded-lg p-4">
                  <div className="flex items-center justify-between text-[#A6AEC0] mb-1">
                    <span className="text-xs uppercase font-medium">Provisioned Members</span>
                    <Users className="w-4 h-4 text-[#7057E8]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F7F8FC]">{members.length} Active</div>
                  <button
                    onClick={() => setActiveTab('members')}
                    className="text-[11px] text-[#7057E8] hover:underline mt-2 block"
                  >
                    Manage Members →
                  </button>
                </div>

                <div className="bg-[#1E2433] border border-[#343B4D] rounded-lg p-4">
                  <div className="flex items-center justify-between text-[#A6AEC0] mb-1">
                    <span className="text-xs uppercase font-medium">Global Reports & Features</span>
                    <Globe className="w-4 h-4 text-[#20B8CF]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F7F8FC]">{reports.length} Open</div>
                  <button
                    onClick={() => setActiveTab('reports_hub')}
                    className="text-[11px] text-[#20B8CF] hover:underline mt-2 block"
                  >
                    View Global Reports →
                  </button>
                </div>

                <div className="bg-[#1E2433] border border-[#343B4D] rounded-lg p-4">
                  <div className="flex items-center justify-between text-[#A6AEC0] mb-1">
                    <span className="text-xs uppercase font-medium">Active Tasks</span>
                    <CheckSquare className="w-4 h-4 text-[#159A72]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F7F8FC]">{tasks.length} Deliverables</div>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-[11px] text-[#159A72] hover:underline mt-2 block"
                  >
                    View Task Board →
                  </button>
                </div>

                <div className="bg-[#1E2433] border border-[#343B4D] rounded-lg p-4">
                  <div className="flex items-center justify-between text-[#A6AEC0] mb-1">
                    <span className="text-xs uppercase font-medium">Configured Departments</span>
                    <Building2 className="w-4 h-4 text-[#EAB308]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F7F8FC]">{departments.length} Units</div>
                  <button
                    onClick={() => setActiveTab('departments')}
                    className="text-[11px] text-[#EAB308] hover:underline mt-2 block"
                  >
                    Edit Departments →
                  </button>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="bg-[#171B28] border border-[#343B4D] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[#F7F8FC] mb-3 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#7057E8]" />
                  Administrative Command & Control
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setEditingMember(null);
                      setMemberForm({
                        name: '',
                        email: '',
                        password: '',
                        role: EXACT_ROLE_NAMES[0].title,
                        department: departments[0]?.name || 'Operations',
                        isAdmin: false,
                        status: 'Active',
                      });
                      setActiveModal('add_member');
                    }}
                    className="p-3.5 bg-[#1E2433] border border-[#343B4D] hover:border-[#7057E8] rounded-lg text-left transition"
                  >
                    <UserPlus className="w-5 h-5 text-[#7057E8] mb-2" />
                    <p className="font-semibold text-xs text-[#F7F8FC]">Provision New Staff</p>
                    <p className="text-[10px] text-[#A6AEC0] mt-0.5">Assign email, password & role</p>
                  </button>

                  <button
                    onClick={() => {
                      setEditingDept(null);
                      setDeptForm({ name: '', lead: 'Unassigned', color: '#7057E8', description: '' });
                      setActiveModal('add_dept');
                    }}
                    className="p-3.5 bg-[#1E2433] border border-[#343B4D] hover:border-[#EAB308] rounded-lg text-left transition"
                  >
                    <Building2 className="w-5 h-5 text-[#EAB308] mb-2" />
                    <p className="font-semibold text-xs text-[#F7F8FC]">Add Department</p>
                    <p className="text-[10px] text-[#A6AEC0] mt-0.5">Create operational unit</p>
                  </button>

                  <button
                    onClick={() => {
                      setTaskForm({
                        title: '',
                        department: departments[0]?.name || 'Operations',
                        assignee: members[0]?.name || 'Admin',
                        stage: 'To Do',
                        priority: 'Medium',
                        dueDate: '2026-11-30',
                      });
                      setActiveModal('add_task');
                    }}
                    className="p-3.5 bg-[#1E2433] border border-[#343B4D] hover:border-[#159A72] rounded-lg text-left transition"
                  >
                    <CheckSquare className="w-5 h-5 text-[#159A72] mb-2" />
                    <p className="font-semibold text-xs text-[#F7F8FC]">Dispatch Task</p>
                    <p className="text-[10px] text-[#A6AEC0] mt-0.5">Assign deliverable to member</p>
                  </button>

                  <button
                    onClick={() => {
                      setAnnouncementForm({ title: '', category: 'Operational', content: '' });
                      setActiveModal('add_announcement');
                    }}
                    className="p-3.5 bg-[#1E2433] border border-[#343B4D] hover:border-[#20B8CF] rounded-lg text-left transition"
                  >
                    <Megaphone className="w-5 h-5 text-[#20B8CF] mb-2" />
                    <p className="font-semibold text-xs text-[#F7F8FC]">Post Announcement</p>
                    <p className="text-[10px] text-[#A6AEC0] mt-0.5">Broadcast to team workspace</p>
                  </button>
                </div>
              </div>

              {/* Real Audit Trail */}
              <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[#F7F8FC] mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#7057E8]" />
                  Live Audit Activity Ledger (Real Changes)
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="p-2.5 bg-[#10131D] border border-[#343B4D] rounded flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#20B8CF] bg-[#1E2433] px-1.5 py-0.5 rounded">{log.action}</span>
                        <span className="text-[#F7F8FC] font-medium">{log.actor}</span>
                        <span className="text-[#A6AEC0]">→ {log.target}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#A6AEC0]">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: GLOBAL REPORTS & FEATURE REQUESTS (VISIBLE GLOBALLY TO EVERYONE) */}
          {activeTab === 'reports_hub' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#343B4D]">
                <div>
                  <h1 className="text-xl font-bold text-[#F7F8FC] flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#7057E8]" />
                    Global Reports, Suggestions & Feature Requests Hub
                  </h1>
                  <p className="text-xs text-[#A6AEC0] mt-0.5">
                    Publicly accessible to everyone on the team. Submit feedback, request features, report bugs, and vote on additions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setReportForm({
                      title: '',
                      category: 'Feature Request',
                      priority: 'Medium',
                      description: '',
                    });
                    setActiveModal('submit_report');
                  }}
                  className="px-3.5 py-2 bg-[#7057E8] text-white rounded text-xs font-semibold shadow hover:bg-[#6045d8] transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  + Submit Report / Request
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(['All', 'Feature Request', 'Bug Report', 'Improvement', 'Tooling Need'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setReportFilter(cat)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                      reportFilter === cat
                        ? 'bg-[#7057E8] text-white shadow'
                        : 'bg-[#1E2433] border border-[#343B4D] text-[#A6AEC0] hover:text-[#F7F8FC]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Reports Grid / Cards */}
              {filteredReports.length === 0 ? (
                <div className="p-12 text-center bg-[#1E2433] border border-[#343B4D] rounded-xl">
                  <Globe className="w-10 h-10 text-[#A6AEC0] mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-[#F7F8FC]">No Reports Submitted Yet</h3>
                  <p className="text-xs text-[#A6AEC0] max-w-sm mx-auto mt-1 mb-4">
                    This board is open to all staff members globally. Submit feature ideas, report issues, or suggest improvements!
                  </p>
                  <button
                    onClick={() => setActiveModal('submit_report')}
                    className="px-4 py-2 bg-[#7057E8] text-white rounded text-xs font-medium"
                  >
                    Submit First Report
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredReports.map((report) => {
                    const hasVoted = report.voters.includes(currentUser?.email || '');
                    return (
                      <div
                        key={report.id}
                        className="p-5 bg-[#1E2433] border border-[#343B4D] rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-[#7057E8]/60 transition"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          {/* Upvote Button */}
                          <button
                            onClick={() => handleToggleVote(report.id)}
                            className={`flex flex-col items-center justify-center w-12 h-14 rounded-lg border transition ${
                              hasVoted
                                ? 'bg-[#7057E8]/20 border-[#7057E8] text-[#7057E8]'
                                : 'bg-[#10131D] border-[#343B4D] text-[#A6AEC0] hover:border-[#7057E8] hover:text-[#F7F8FC]'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4 mb-1" />
                            <span className="text-xs font-bold font-mono">{report.votes}</span>
                          </button>

                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#10131D] border border-[#343B4D] text-[#20B8CF] rounded">
                                {report.category}
                              </span>
                              <span
                                className={`px-2 py-0.5 text-[10px] font-semibold rounded font-mono ${
                                  report.status === 'Implemented'
                                    ? 'bg-[#159A72]/20 text-[#159A72] border border-[#159A72]/40'
                                    : report.status === 'Approved for Roadmap'
                                    ? 'bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/40'
                                    : report.status === 'Under Review'
                                    ? 'bg-[#7057E8]/20 text-[#7057E8] border border-[#7057E8]/40'
                                    : 'bg-[#10131D] text-[#A6AEC0] border border-[#343B4D]'
                                }`}
                              >
                                {report.status}
                              </span>
                              <span className="text-[10px] text-[#A6AEC0]">
                                Priority: <strong className="text-[#F7F8FC]">{report.priority}</strong>
                              </span>
                            </div>

                            <h3 className="font-bold text-sm text-[#F7F8FC]">{report.title}</h3>
                            <p className="text-xs text-[#A6AEC0] leading-relaxed whitespace-pre-wrap">{report.description}</p>

                            <div className="pt-2 flex items-center gap-3 text-[11px] text-[#A6AEC0]">
                              <span>Submitted by: <strong className="text-[#F7F8FC]">{report.author}</strong> ({report.authorRole})</span>
                              <span>•</span>
                              <span>{report.createdAt}</span>
                            </div>

                            {/* Official Admin Response */}
                            {report.adminResponse && (
                              <div className="mt-3 p-3 bg-[#10131D] border-l-2 border-[#7057E8] rounded-r-lg">
                                <p className="text-[11px] font-semibold text-[#7057E8] flex items-center gap-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Official Admin Response:
                                </p>
                                <p className="text-xs text-[#F7F8FC] mt-0.5">{report.adminResponse}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Admin Action Controls */}
                        {currentUser?.isAdmin && (
                          <div className="flex md:flex-col items-center gap-2 pt-2 md:pt-0">
                            <button
                              onClick={() => {
                                setEditingReport(report);
                                setAdminReportStatus(report.status);
                                setAdminReplyText(report.adminResponse || '');
                                setActiveModal('edit_report');
                              }}
                              className="px-2.5 py-1 text-xs bg-[#10131D] border border-[#343B4D] text-[#20B8CF] hover:border-[#20B8CF] rounded transition"
                            >
                              Manage / Reply
                            </button>
                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="p-1 text-[#A6AEC0] hover:text-[#D64545]"
                              title="Delete Report"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: MEMBERS MANAGEMENT */}
          {activeTab === 'members' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#343B4D]">
                <div>
                  <h1 className="text-xl font-bold text-[#F7F8FC]">Staff & Member Access List</h1>
                  <p className="text-xs text-[#A6AEC0]">
                    Real accounts provisioned in the system. Edit access credentials, roles, and status directly.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setMemberForm({
                      name: '',
                      email: '',
                      password: '',
                      role: EXACT_ROLE_NAMES[0].title,
                      department: departments[0]?.name || 'Operations',
                      isAdmin: false,
                      status: 'Active',
                    });
                    setActiveModal('add_member');
                  }}
                  className="px-3.5 py-2 bg-[#7057E8] text-white rounded text-xs font-semibold shadow hover:bg-[#6045d8] transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  + Provision New Member
                </button>
              </div>

              {/* Members Table */}
              <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171B28] border-b border-[#343B4D] text-[#A6AEC0] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Member</th>
                      <th className="py-3 px-4">Role Title</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Password</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#343B4D]">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-[#10131D]/40 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#10131D] border border-[#343B4D] flex items-center justify-center font-bold text-[11px] text-[#20B8CF]">
                              {m.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[#F7F8FC]">{m.name}</span>
                                {m.isAdmin && (
                                  <span className="px-1 py-0.2 bg-[#7057E8]/20 text-[#7057E8] rounded text-[9px] font-mono">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#A6AEC0] font-mono">{m.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#F7F8FC]">{m.role}</td>
                        <td className="py-3 px-4 text-[#A6AEC0]">{m.department}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#159A72]/20 text-[#159A72] border border-[#159A72]/40">
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[#A6AEC0]">
                          •••••••• <span className="text-[9px] text-[#20B8CF]">({m.password})</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingMember(m);
                                setMemberForm({
                                  name: m.name,
                                  email: m.email,
                                  password: m.password,
                                  role: m.role,
                                  department: m.department,
                                  isAdmin: m.isAdmin,
                                  status: m.status,
                                });
                                setActiveModal('edit_member');
                              }}
                              className="p-1 text-[#A6AEC0] hover:text-[#7057E8]"
                              title="Edit Member"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {m.id !== 'STF-001' && (
                              <button
                                onClick={() => handleDeleteMember(m.id, m.name)}
                                className="p-1 text-[#A6AEC0] hover:text-[#D64545]"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#343B4D]">
                <div>
                  <h1 className="text-xl font-bold text-[#F7F8FC]">Departments & Divisions</h1>
                  <p className="text-xs text-[#A6AEC0]">Add, rename, or assign leads to operational departments</p>
                </div>
                <button
                  onClick={() => {
                    setEditingDept(null);
                    setDeptForm({ name: '', lead: 'Unassigned', color: '#7057E8', description: '' });
                    setActiveModal('add_dept');
                  }}
                  className="px-3 py-1.5 bg-[#7057E8] text-white rounded text-xs font-medium shadow hover:bg-[#6045d8] flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Add Department
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((d) => (
                  <div key={d.id} className="p-4 bg-[#1E2433] border border-[#343B4D] rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: d.color }}>
                          {d.name.slice(0, 1)}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingDept(d);
                              setDeptForm({ name: d.name, lead: d.lead, color: d.color, description: d.description });
                              setActiveModal('edit_dept');
                            }}
                            className="p-1 text-[#A6AEC0] hover:text-[#7057E8]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(d.id, d.name)}
                            className="p-1 text-[#A6AEC0] hover:text-[#D64545]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm text-[#F7F8FC]">{d.name}</h3>
                      <p className="text-xs text-[#A6AEC0] mt-1">{d.description}</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-[#343B4D] flex items-center justify-between text-[11px]">
                      <span className="text-[#A6AEC0]">Lead: <strong className="text-[#F7F8FC]">{d.lead}</strong></span>
                      <span className="text-[#20B8CF]">
                        {members.filter((m) => m.department === d.name).length} Staff
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#343B4D]">
                <div>
                  <h1 className="text-xl font-bold text-[#F7F8FC]">Tasks & Operations Board</h1>
                  <p className="text-xs text-[#A6AEC0]">Dispatch and track real tasks assigned to members</p>
                </div>
                <button
                  onClick={() => {
                    setTaskForm({
                      title: '',
                      department: departments[0]?.name || 'Operations',
                      assignee: members[0]?.name || 'Admin',
                      stage: 'To Do',
                      priority: 'Medium',
                      dueDate: '2026-11-30',
                    });
                    setActiveModal('add_task');
                  }}
                  className="px-3 py-1.5 bg-[#7057E8] text-white rounded text-xs font-medium shadow hover:bg-[#6045d8] flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Create Task
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="p-12 text-center bg-[#1E2433] border border-[#343B4D] rounded-xl">
                  <CheckSquare className="w-10 h-10 text-[#A6AEC0] mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-[#F7F8FC]">No Tasks Created Yet</h3>
                  <p className="text-xs text-[#A6AEC0] max-w-sm mx-auto mt-1 mb-4">
                    The task board starts clean. Click "Create Task" to assign your first operational deliverable.
                  </p>
                  <button
                    onClick={() => setActiveModal('add_task')}
                    className="px-4 py-2 bg-[#7057E8] text-white rounded text-xs font-medium"
                  >
                    Create First Task
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(['To Do', 'In Progress', 'In Review', 'Done'] as const).map((stage) => {
                    const stageTasks = tasks.filter((t) => t.stage === stage);
                    return (
                      <div key={stage} className="bg-[#171B28] border border-[#343B4D] rounded-xl p-3 min-w-[220px]">
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#343B4D]">
                          <span className="text-xs font-semibold text-[#F7F8FC]">{stage}</span>
                          <span className="px-1.5 py-0.5 text-[10px] rounded font-mono font-bold bg-[#1E2433] text-[#A6AEC0]">
                            {stageTasks.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {stageTasks.map((t) => (
                            <div key={t.id} className="p-3 bg-[#1E2433] border border-[#343B4D] rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono text-[#20B8CF]">{t.department}</span>
                                <button onClick={() => handleDeleteTask(t.id)} className="text-[#A6AEC0] hover:text-[#D64545]">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <h4 className="font-semibold text-xs text-[#F7F8FC]">{t.title}</h4>
                              <p className="text-[11px] text-[#A6AEC0] mt-1">Assignee: {t.assignee}</p>
                              <div className="mt-2 pt-2 border-t border-[#343B4D] flex items-center justify-between text-[10px]">
                                <span className="text-[#D98A18] font-medium">{t.priority}</span>
                                <select
                                  value={t.stage}
                                  onChange={(e) => handleUpdateTaskStage(t.id, e.target.value as any)}
                                  className="bg-[#10131D] text-[#A6AEC0] border border-[#343B4D] rounded px-1.5 py-0.5"
                                >
                                  <option value="To Do">To Do</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="In Review">In Review</option>
                                  <option value="Done">Done</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: RECRUITMENT */}
          {activeTab === 'recruitment' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#343B4D]">
                <div>
                  <h1 className="text-xl font-bold text-[#F7F8FC]">Recruitment Pipeline & Hiring</h1>
                  <p className="text-xs text-[#A6AEC0]">
                    Review applicants and hire candidates directly into the active staff directory
                  </p>
                </div>
                <button
                  onClick={() => {
                    setApplicantForm({ name: '', email: '', appliedRole: EXACT_ROLE_NAMES[0].title, score: 90 });
                    setActiveModal('add_applicant');
                  }}
                  className="px-3 py-1.5 bg-[#7057E8] text-white rounded text-xs font-medium shadow hover:bg-[#6045d8] flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Log Candidate
                </button>
              </div>

              {applicants.length === 0 ? (
                <div className="p-12 text-center bg-[#1E2433] border border-[#343B4D] rounded-xl">
                  <UserPlus className="w-10 h-10 text-[#A6AEC0] mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-[#F7F8FC]">No Applicants In Pipeline</h3>
                  <p className="text-xs text-[#A6AEC0] max-w-sm mx-auto mt-1 mb-4">
                    Log candidate applications to evaluate them, score interviews, and automatically hire them into staff.
                  </p>
                  <button
                    onClick={() => setActiveModal('add_applicant')}
                    className="px-4 py-2 bg-[#7057E8] text-white rounded text-xs font-medium"
                  >
                    Add Candidate
                  </button>
                </div>
              ) : (
                <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#171B28] border-b border-[#343B4D] text-[#A6AEC0] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Candidate Name</th>
                        <th className="py-3 px-4">Applied Role</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Stage</th>
                        <th className="py-3 px-4 text-right">Hiring Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#343B4D]">
                      {applicants.map((a) => (
                        <tr key={a.id} className="hover:bg-[#10131D]/40">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-[#F7F8FC]">{a.name}</p>
                            <p className="text-[10px] text-[#A6AEC0] font-mono">{a.email}</p>
                          </td>
                          <td className="py-3 px-4 font-medium text-[#F7F8FC]">{a.appliedRole}</td>
                          <td className="py-3 px-4 font-mono text-[#20B8CF]">{a.score}%</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#7057E8]/20 text-[#7057E8]">
                              {a.stage}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {a.stage !== 'Approved' ? (
                              <button
                                onClick={() => handleHireApplicant(a)}
                                className="px-3 py-1 bg-[#159A72] text-white rounded text-xs font-medium hover:bg-[#128360]"
                              >
                                Hire & Create Account
                              </button>
                            ) : (
                              <span className="text-xs text-[#159A72] font-semibold">Account Active ✓</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: KNOWLEDGE BASE */}
          {activeTab === 'knowledge' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#343B4D]">
                <div>
                  <h1 className="text-xl font-bold text-[#F7F8FC]">Knowledge Base & SOP Wiki</h1>
                  <p className="text-xs text-[#A6AEC0]">Author and maintain team operating policies and guidelines</p>
                </div>
                <button
                  onClick={() => {
                    setDocForm({ title: '', category: 'SOP', content: '' });
                    setActiveModal('add_doc');
                  }}
                  className="px-3 py-1.5 bg-[#7057E8] text-white rounded text-xs font-medium shadow hover:bg-[#6045d8] flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Create Document
                </button>
              </div>

              {documents.length === 0 ? (
                <div className="p-12 text-center bg-[#1E2433] border border-[#343B4D] rounded-xl">
                  <BookOpen className="w-10 h-10 text-[#A6AEC0] mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-[#F7F8FC]">Knowledge Base is Ready</h3>
                  <p className="text-xs text-[#A6AEC0] max-w-sm mx-auto mt-1 mb-4">
                    Document SOPs, internal processes, and team guides for your staff.
                  </p>
                  <button
                    onClick={() => setActiveModal('add_doc')}
                    className="px-4 py-2 bg-[#7057E8] text-white rounded text-xs font-medium"
                  >
                    Add First Document
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-5 bg-[#1E2433] border border-[#343B4D] rounded-xl">
                      <div className="flex items-center justify-between text-[11px] text-[#A6AEC0] mb-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#7057E8]/20 text-[#7057E8] rounded">
                          {doc.category}
                        </span>
                        <span>{doc.lastUpdated}</span>
                      </div>
                      <h3 className="font-bold text-sm text-[#F7F8FC] mb-2">{doc.title}</h3>
                      <p className="text-xs text-[#A6AEC0] leading-relaxed whitespace-pre-wrap">{doc.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ROLES & PERMISSIONS */}
          {activeTab === 'roles' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#343B4D]">
                <div>
                  <h1 className="text-xl font-bold text-[#F7F8FC]">Exact Role Hierarchy ({EXACT_ROLE_NAMES.length} Roles)</h1>
                  <p className="text-xs text-[#A6AEC0]">
                    Configured roles from the blueprint. Assignable to any staff member by Admin.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {EXACT_ROLE_NAMES.map((r) => {
                  const assignedCount = members.filter((m) => m.role === r.title).length;
                  return (
                    <div key={r.id} className="p-3 bg-[#1E2433] border border-[#343B4D] rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-[#F7F8FC]">{r.title}</span>
                        <span className="text-[9px] font-mono text-[#20B8CF] bg-[#10131D] px-1.5 py-0.5 rounded">
                          {r.group}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A6AEC0]">{r.description}</p>
                      <div className="mt-2 pt-2 border-t border-[#343B4D] flex justify-between text-[10px]">
                        <span className="text-[#A6AEC0]">Dept: {r.department}</span>
                        <span className="text-[#7057E8] font-semibold">{assignedCount} Assigned</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS & AUDIT LOGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#343B4D]">
                <div>
                  <h1 className="text-xl font-bold text-[#F7F8FC]">Audit Logs & Security Governance</h1>
                  <p className="text-xs text-[#A6AEC0]">Tamper-resistant append-only record of all administrative operations</p>
                </div>
              </div>

              <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[#F7F8FC] mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#7057E8]" />
                  Full System Audit Trail
                </h3>
                <div className="space-y-2">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="p-3 bg-[#10131D] border border-[#343B4D] rounded flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-[#20B8CF] bg-[#1E2433] px-1.5 py-0.5 rounded">{log.action}</span>
                        <span className="text-[#F7F8FC] font-semibold">{log.actor}</span>
                        <span className="text-[#A6AEC0]">→ {log.target}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#A6AEC0]">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL 1: ADD / EDIT STAFF MEMBER --- */}
      {(activeModal === 'add_member' || activeModal === 'edit_member') && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#343B4D] mb-4">
              <h3 className="font-bold text-sm text-[#F7F8FC] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#7057E8]" />
                {editingMember ? 'Edit Staff Member' : 'Provision Staff Member'}
              </h3>
              <button onClick={closeModal} className="text-[#A6AEC0] hover:text-[#F7F8FC]">✕</button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Authorized Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@creatorai.team"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#A6AEC0]">Password</label>
                  <button
                    type="button"
                    onClick={() => setMemberForm({ ...memberForm, password: 'Pass' + Math.floor(1000 + Math.random() * 9000) + '!' })}
                    className="text-[10px] text-[#20B8CF] hover:underline"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  required={!editingMember}
                  placeholder={editingMember ? 'Leave empty to keep unchanged' : 'Choose password'}
                  value={memberForm.password}
                  onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] font-mono outline-none focus:border-[#7057E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Role Title</label>
                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                  >
                    {EXACT_ROLE_NAMES.map((r) => (
                      <option key={r.id} value={r.title}>{r.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Department</label>
                  <select
                    value={memberForm.department}
                    onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                    className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Account Status</label>
                <select
                  value={memberForm.status}
                  onChange={(e) => setMemberForm({ ...memberForm, status: e.target.value as any })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={memberForm.isAdmin}
                    onChange={(e) => setMemberForm({ ...memberForm, isAdmin: e.target.checked })}
                    className="rounded border-[#343B4D] text-[#7057E8]"
                  />
                  <span className="text-xs text-[#F7F8FC]">Grant Administrator & Full Edit Rights</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#343B4D] flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs bg-[#171B28] border border-[#343B4D] rounded text-[#A6AEC0]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-[#7057E8] text-white rounded font-medium hover:bg-[#6045d8]">
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT DEPARTMENT --- */}
      {(activeModal === 'add_dept' || activeModal === 'edit_dept') && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#343B4D] mb-4">
              <h3 className="font-bold text-sm text-[#F7F8FC]">
                {editingDept ? 'Edit Department' : 'Create Department'}
              </h3>
              <button onClick={closeModal} className="text-[#A6AEC0] hover:text-[#F7F8FC]">✕</button>
            </div>
            <form onSubmit={handleSaveDepartment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Media Production"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Lead Name / Assignee</label>
                <input
                  type="text"
                  placeholder="e.g. Director of Operations"
                  value={deptForm.lead}
                  onChange={(e) => setDeptForm({ ...deptForm, lead: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>
              <div className="pt-3 border-t border-[#343B4D] flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs bg-[#171B28] border border-[#343B4D] rounded text-[#A6AEC0]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-[#7057E8] text-white rounded font-medium hover:bg-[#6045d8]">
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: CREATE TASK --- */}
      {activeModal === 'add_task' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#343B4D] mb-4">
              <h3 className="font-bold text-sm text-[#F7F8FC]">Create Operational Task</h3>
              <button onClick={closeModal} className="text-[#A6AEC0] hover:text-[#F7F8FC]">✕</button>
            </div>
            <form onSubmit={handleSaveTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Refresh YouTube Brand Package"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Department</label>
                  <select
                    value={taskForm.department}
                    onChange={(e) => setTaskForm({ ...taskForm, department: e.target.value })}
                    className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC]"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Assignee</label>
                  <select
                    value={taskForm.assignee}
                    onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                    className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC]"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-3 border-t border-[#343B4D] flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs bg-[#171B28] border border-[#343B4D] rounded text-[#A6AEC0]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-[#7057E8] text-white rounded font-medium hover:bg-[#6045d8]">
                  Dispatch Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: LOG APPLICANT --- */}
      {activeModal === 'add_applicant' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#343B4D] mb-4">
              <h3 className="font-bold text-sm text-[#F7F8FC]">Log Recruitment Candidate</h3>
              <button onClick={closeModal} className="text-[#A6AEC0] hover:text-[#F7F8FC]">✕</button>
            </div>
            <form onSubmit={handleSaveApplicant} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tyler Vance"
                  value={applicantForm.name}
                  onChange={(e) => setApplicantForm({ ...applicantForm, name: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="tyler@example.com"
                  value={applicantForm.email}
                  onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Applied Role</label>
                <select
                  value={applicantForm.appliedRole}
                  onChange={(e) => setApplicantForm({ ...applicantForm, appliedRole: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC]"
                >
                  {EXACT_ROLE_NAMES.map((r) => (
                    <option key={r.id} value={r.title}>{r.title}</option>
                  ))}
                </select>
              </div>
              <div className="pt-3 border-t border-[#343B4D] flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs bg-[#171B28] border border-[#343B4D] rounded text-[#A6AEC0]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-[#7057E8] text-white rounded font-medium hover:bg-[#6045d8]">
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: SUBMIT GLOBAL REPORT / FEATURE REQUEST --- */}
      {activeModal === 'submit_report' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#343B4D] mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#20B8CF]" />
                <div>
                  <h3 className="font-bold text-sm text-[#F7F8FC]">Submit Global Report / Request</h3>
                  <p className="text-[10px] text-[#A6AEC0]">Visible to the entire team and leadership</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-[#A6AEC0] hover:text-[#F7F8FC]">✕</button>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Title / Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Add automated Discord webhook alerts for new tasks"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Category</label>
                  <select
                    value={reportForm.category}
                    onChange={(e) => setReportForm({ ...reportForm, category: e.target.value as any })}
                    className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC]"
                  >
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Improvement">Improvement</option>
                    <option value="Tooling Need">Tooling Need</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Priority</label>
                  <select
                    value={reportForm.priority}
                    onChange={(e) => setReportForm({ ...reportForm, priority: e.target.value as any })}
                    className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Details & Rationale</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain why this feature or fix is needed, what problem it solves, and how it should work..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>

              <div className="pt-3 border-t border-[#343B4D] flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs bg-[#171B28] border border-[#343B4D] rounded text-[#A6AEC0]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-[#7057E8] text-white rounded font-medium hover:bg-[#6045d8]">
                  Submit Globally
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 6: ADMIN MODERATE REPORT --- */}
      {activeModal === 'edit_report' && editingReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#343B4D] mb-4">
              <h3 className="font-bold text-sm text-[#F7F8FC]">Admin Review: {editingReport.title}</h3>
              <button onClick={closeModal} className="text-[#A6AEC0] hover:text-[#F7F8FC]">✕</button>
            </div>

            <form onSubmit={handleAdminUpdateReport} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Update Status</label>
                <select
                  value={adminReportStatus}
                  onChange={(e) => setAdminReportStatus(e.target.value as any)}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC]"
                >
                  <option value="Open">Open</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved for Roadmap">Approved for Roadmap</option>
                  <option value="Implemented">Implemented / Live</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Official Leadership Response</label>
                <textarea
                  rows={3}
                  placeholder="Provide feedback, next steps, or release timing for the team..."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC]"
                />
              </div>

              <div className="pt-3 border-t border-[#343B4D] flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs bg-[#171B28] border border-[#343B4D] rounded text-[#A6AEC0]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-[#7057E8] text-white rounded font-medium hover:bg-[#6045d8]">
                  Save Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 7: EDIT SYSTEM CONFIG --- */}
      {activeModal === 'edit_system_config' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#343B4D] mb-4">
              <h3 className="font-bold text-sm text-[#F7F8FC]">Edit Global Workspace Configuration</h3>
              <button onClick={closeModal} className="text-[#A6AEC0] hover:text-[#F7F8FC]">✕</button>
            </div>

            <form onSubmit={handleSaveSystemConfig} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Workspace / Brand Name</label>
                <input
                  type="text"
                  required
                  value={configForm.workspaceName}
                  onChange={(e) => setConfigForm({ ...configForm, workspaceName: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Organization Tagline</label>
                <input
                  type="text"
                  value={configForm.organizationTagline}
                  onChange={(e) => setConfigForm({ ...configForm, organizationTagline: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Primary Timezone</label>
                  <select
                    value={configForm.primaryTimezone}
                    onChange={(e) => setConfigForm({ ...configForm, primaryTimezone: e.target.value })}
                    className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC]"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                    <option value="PKT">Pakistan Standard Time (PKT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Data Retention (Days)</label>
                  <input
                    type="number"
                    value={configForm.dataRetentionDays}
                    onChange={(e) => setConfigForm({ ...configForm, dataRetentionDays: Number(e.target.value) })}
                    className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC]"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configForm.mfaEnforced}
                    onChange={(e) => setConfigForm({ ...configForm, mfaEnforced: e.target.checked })}
                    className="rounded border-[#343B4D] text-[#7057E8]"
                  />
                  <span className="text-xs text-[#F7F8FC]">Enforce Multi-Factor Authentication (MFA) Globally</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#343B4D] flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs bg-[#171B28] border border-[#343B4D] rounded text-[#A6AEC0]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-[#7057E8] text-white rounded font-medium hover:bg-[#6045d8]">
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 8: CREATE KNOWLEDGE DOC --- */}
      {activeModal === 'add_doc' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#343B4D] mb-4">
              <h3 className="font-bold text-sm text-[#F7F8FC]">Author SOP / Knowledge Document</h3>
              <button onClick={closeModal} className="text-[#A6AEC0] hover:text-[#F7F8FC]">✕</button>
            </div>
            <form onSubmit={handleSaveDoc} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Video Ingestion Pipeline Standard"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Category</label>
                <select
                  value={docForm.category}
                  onChange={(e) => setDocForm({ ...docForm, category: e.target.value as any })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC]"
                >
                  <option value="SOP">Standard Operating Procedure (SOP)</option>
                  <option value="Policy">Security & Compliance Policy</option>
                  <option value="Onboarding">Staff Onboarding Guide</option>
                  <option value="Guidelines">Media & Design Guidelines</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Content / Markdown</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Document procedure and instructions here..."
                  value={docForm.content}
                  onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>
              <div className="pt-3 border-t border-[#343B4D] flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs bg-[#171B28] border border-[#343B4D] rounded text-[#A6AEC0]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-[#7057E8] text-white rounded font-medium hover:bg-[#6045d8]">
                  Publish Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 9: CREATE ANNOUNCEMENT --- */}
      {activeModal === 'add_announcement' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#343B4D] mb-4">
              <h3 className="font-bold text-sm text-[#F7F8FC]">Broadcast Announcement</h3>
              <button onClick={closeModal} className="text-[#A6AEC0] hover:text-[#F7F8FC]">✕</button>
            </div>
            <form onSubmit={handleSaveAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly All-Hands Scheduling"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Category</label>
                <select
                  value={announcementForm.category}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value as any })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-2.5 py-2 text-xs text-[#F7F8FC]"
                >
                  <option value="Operational">Operational</option>
                  <option value="System">System / Security</option>
                  <option value="Urgent">Urgent Notice</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Announcement Body</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write message to staff..."
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#7057E8]"
                />
              </div>
              <div className="pt-3 border-t border-[#343B4D] flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-3 py-1.5 text-xs bg-[#171B28] border border-[#343B4D] rounded text-[#A6AEC0]">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-[#7057E8] text-white rounded font-medium hover:bg-[#6045d8]">
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
