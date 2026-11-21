'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { EXACT_ROLE_NAMES, RoleDefinition } from '@/data/roles';

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

export interface SystemConfig {
  workspaceName: string;
  organizationTagline: string;
  primaryTimezone: string;
  mfaEnforced: boolean;
  dataRetentionDays: number;
  maintenanceMode: boolean;
}

const INITIAL_ADMIN_MEMBER: StaffEntity = {
  id: 'STF-001',
  name: 'System Administrator (Owner)',
  email: 'admin@creatorai.team',
  password: 'Creator2026',
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

const COMPLIANCE_ITEMS_20 = [
  { id: 1, title: 'Privacy Policy', category: 'Privacy & Data', desc: 'Comprehensive workforce privacy notice detailing data collection, processing, and storage.', status: 'Active & Enforced' },
  { id: 2, title: 'Terms of Service', category: 'Legal Agreement', desc: 'Enterprise acceptable use policy, internal confidentiality, and IP rights protection.', status: 'Active & Enforced' },
  { id: 3, title: 'Refund & Compensation Policy', category: 'Financial', desc: 'Internal payroll transparency, expense reimbursements, and enterprise billing terms.', status: 'Active' },
  { id: 4, title: 'Cookie Policy', category: 'Privacy & Data', desc: 'Clear enumeration of strictly necessary session, CSRF, and security cookies.', status: 'Active' },
  { id: 5, title: 'Cookie Consent Banner', category: 'Privacy & Data', desc: 'Interactive non-intrusive banner granting granular user consent options (GDPR / ePrivacy).', status: 'Active & Stored' },
  { id: 6, title: 'Check Form Consents', category: 'Consumer Protection', desc: 'Mandatory affirmative consent checkboxes on login, member creation, and reports.', status: 'Enforced' },
  { id: 7, title: 'Collect Only Needed Data', category: 'Privacy & Data', desc: 'Strict data minimization: only corporate email, role title, and operational audit logs.', status: 'Verified' },
  { id: 8, title: 'Audit Third-Party SDKs', category: 'Security & SDKs', desc: 'Zero third-party trackers, zero advertising pixels, zero unauthorized spyware SDKs.', status: '0 Trackers (Clean)' },
  { id: 9, title: 'Remove Dark Patterns', category: 'Consumer Protection', desc: 'Transparent cancellation, clear sign-out, explicit confirmations on all destructive actions.', status: 'Enforced' },
  { id: 10, title: 'No Hidden Fees', category: 'Financial', desc: 'Zero surprise charges, completely transparent enterprise resource allocation.', status: 'Verified' },
  { id: 11, title: 'No Fake Reviews', category: 'Integrity', desc: 'Feature requests and bug reports restricted to verified authenticated staff accounts.', status: 'Enforced' },
  { id: 12, title: 'No Unsupported Claims', category: 'Integrity', desc: 'All platform metrics, KPIs, and deliverables are grounded in verified telemetry.', status: 'Enforced' },
  { id: 13, title: 'Add Alt Text', category: 'Accessibility', desc: 'Full screen-reader accessibility with descriptive alt and aria-label attributes.', status: 'WCAG 2.1 Compliant' },
  { id: 14, title: 'Fix Color Contrast', category: 'Accessibility', desc: 'High-contrast palette exceeding WCAG AA minimum contrast ratios (7:1+).', status: 'WCAG AA Compliant' },
  { id: 15, title: 'Keyboard Navigation', category: 'Accessibility', desc: 'Complete keyboard tab index traversal, trap management, and focus outlines.', status: 'Accessible' },
  { id: 16, title: 'Business Details', category: 'Legal Entity', desc: 'Official registered entity name, registered office address, EIN, and legal contact info.', status: 'Documented' },
  { id: 17, title: 'Age Consent (18+)', category: 'Safety & Compliance', desc: 'Strict age-gating prohibiting minors from entering the staff operations portal.', status: 'Restricted 18+' },
  { id: 18, title: 'Unsubscribe / Mute Link', category: 'Consumer Protection', desc: 'One-click notification preferences and communication muting controls.', status: 'Active' },
  { id: 19, title: 'License Stock Images', category: 'Intellectual Property', desc: 'Verified commercial licensing for all creative brand assets, icons, and media.', status: 'Licensed' },
  { id: 20, title: 'Data Deletion Option', category: 'Privacy & Data', desc: 'GDPR Article 17 self-service erasure and administrative data purging workflow.', status: 'Active & Executable' },
];

function extractFourDigitCode(pwd: string): string | null {
  const match = pwd.match(/\d{4}/);
  return match ? match[0] : null;
}

export default function CreatorAIPortal() {
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

  const [currentUser, setCurrentUser] = useState<StaffEntity | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [loginStep, setLoginStep] = useState<'credentials' | 'verification'>('credentials');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [pendingUser, setPendingUser] = useState<StaffEntity | null>(null);

  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const digitInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [activeTab, setActiveTab] = useState<'admin_center' | 'reports_hub' | 'members' | 'departments' | 'tasks' | 'recruitment' | 'knowledge' | 'roles' | 'settings'>('admin_center');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportFilter, setReportFilter] = useState<'All' | 'Feature Request' | 'Bug Report' | 'Improvement' | 'Tooling Need'>('All');

  const [activeModal, setActiveModal] = useState<
    'add_member' | 'edit_member' | 'add_dept' | 'edit_dept' | 'add_task' | 'add_applicant' | 'add_doc' | 'add_announcement' | 'submit_report' | 'edit_report' | 'edit_system_config' | 'legal_compliance' | null
  >(null);
  const [legalModalTab, setLegalModalTab] = useState<'checklist' | 'privacy' | 'terms' | 'cookies' | 'business' | 'deletion'>('checklist');
  const [cookieConsentAccepted, setCookieConsentAccepted] = useState<boolean>(true);
  const [deletionEmail, setDeletionEmail] = useState('');
  const [deletionFeedback, setDeletionFeedback] = useState('');

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
  const [memberFormError, setMemberFormError] = useState('');

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

      const consent = localStorage.getItem('creatorai_cookie_consent');
      if (!consent) {
        setCookieConsentAccepted(false);
      }
    } catch (e) {}
  }, []);

  const handleAcceptCookies = (choice: 'all' | 'essential') => {
    try {
      localStorage.setItem('creatorai_cookie_consent', choice);
    } catch (e) {}
    setCookieConsentAccepted(true);
    addAuditLog('COOKIE_CONSENT', `User set cookie preferences: ${choice}`);
  };

  const handleRequestDataDeletion = (e: React.FormEvent) => {
    e.preventDefault();
    setDeletionFeedback('');
    const targetEmail = deletionEmail.toLowerCase().trim();
    if (!targetEmail) return;

    const matched = members.find((m) => m.email.toLowerCase() === targetEmail);
    if (!matched) {
      setDeletionFeedback('No account found registered under that email address.');
      return;
    }
    if (matched.id === 'STF-001') {
      setDeletionFeedback('The primary system owner account cannot be purged automatically. Please submit an executive request.');
      return;
    }

    const updated = members.filter((m) => m.email.toLowerCase() !== targetEmail);
    setMembers(updated);
    saveToStorage({ members: updated });
    addAuditLog('GDPR_DATA_ERASURE', `Article 17 Right to Erasure processed for: ${targetEmail}`);
    setDeletionFeedback(`Account records and personal telemetry for ${targetEmail} have been permanently erased in compliance with GDPR Art. 17.`);
    setDeletionEmail('');
  };

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


  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const matched = members.find((m) => m.email.toLowerCase().trim() === loginEmail.toLowerCase().trim());
    if (!matched) {
      setLoginError('Access Denied: Email address is not registered or provisioned in CreatorAI.');
      return;
    }
    if (matched.password !== loginPassword) {
      setLoginError('Invalid credentials. Please verify your password.');
      return;
    }

    const code = extractFourDigitCode(matched.password);
    if (!code) {
      matched.password = matched.password + '2026';
    }

    setPendingUser(matched);
    setLoginStep('verification');
    setDigits(['', '', '', '']);
    setVerificationError('');
    setVerificationSuccess(false);

    setTimeout(() => {
      digitInputRefs[0].current?.focus();
    }, 200);
  };

  const handleDigitChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setVerificationError('');

    if (char && index < 3) {
      digitInputRefs[index + 1].current?.focus();
    }

    if (char && index === 3 && newDigits.every((d) => d !== '')) {
      verifyCode(newDigits.join(''));
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      digitInputRefs[index - 1].current?.focus();
    }
  };

  const handlePasteDigits = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      const newDigits = pasted.split('');
      setDigits(newDigits);
      digitInputRefs[3].current?.focus();
      verifyCode(pasted);
    }
  };

  const verifyCode = (enteredCode: string) => {
    if (!pendingUser) return;
    setIsVerifying(true);
    setVerificationError('');

    const expectedCode = extractFourDigitCode(pendingUser.password);

    setTimeout(() => {
      setIsVerifying(false);
      if (enteredCode === expectedCode) {
        setVerificationSuccess(true);
        setTimeout(() => {
          setCurrentUser(pendingUser);
          setIsAuthenticated(true);
          setLoginStep('credentials');
          setPendingUser(null);
          setLoginEmail('');
          setLoginPassword('');
          setDigits(['', '', '', '']);
          addAuditLog('MFA_VERIFIED', `${pendingUser.name} completed 4-digit verification`);
        }, 600);
      } else {
        setVerificationError('Incorrect security code. Please enter the valid 4-digit verification code.');
        setDigits(['', '', '', '']);
        digitInputRefs[0].current?.focus();
      }
    }, 500);
  };


  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberFormError('');

    const code = extractFourDigitCode(memberForm.password);
    if (!code) {
      setMemberFormError('Password must contain at least 4 continuous digits (e.g. Pass9421 or 9421). These 4 digits serve as their verification code.');
      return;
    }

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
        password: memberForm.password,
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
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const generatedPassword = 'Join' + generatedPin + '!';

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
    alert(`Candidate successfully hired! Provisioned account created for ${app.email}. Verification PIN: ${generatedPin}`);
  };

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
    setMemberFormError('');
  };

  const filteredReports = reports.filter(
    (r) => reportFilter === 'All' || r.category === reportFilter
  );

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="w-full max-w-md bg-[#1E2433] border border-[#343B4D] rounded-xl p-8 shadow-2xl relative overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7057E8] via-[#20B8CF] to-[#7057E8]"></div>

            
            {loginStep === 'credentials' ? (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#7057E8]/10 border border-[#7057E8]/30 text-[#7057E8] mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h1 className="text-xl font-bold text-[#F7F8FC]">{systemConfig.workspaceName}</h1>
                  <p className="text-xs text-[#A6AEC0] mt-1">
                    Enter your authorized email and password to begin verification.
                  </p>
                </div>

                {loginError && (
                  <div className="mb-4 p-3 bg-[#D64545]/15 border border-[#D64545]/40 rounded-lg flex items-start gap-2 text-xs text-[#D64545] animate-shake">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleCredentialsSubmit} autoComplete="off" className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#A6AEC0] mb-1.5">Authorized Email</label>
                    <input type="email" required autoComplete="off" spellCheck={false} value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@creatorai.team"
                      className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3.5 py-2.5 text-xs text-[#F7F8FC] placeholder-[#A6AEC0] outline-none focus:border-[#7057E8] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#A6AEC0] mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} required autoComplete="new-password" value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg pl-3.5 pr-10 py-2.5 text-xs text-[#F7F8FC] placeholder-[#A6AEC0] outline-none focus:border-[#7057E8] transition"
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

                  <div className="flex items-start gap-2 pt-1 text-[11px] text-[#A6AEC0]">
                    <ShieldCheck className="w-4 h-4 text-[#20B8CF] flex-shrink-0 mt-0.5" />
                    <span>
                      By signing in, you verify authorized staff status and agree to CreatorAI's{' '}
                      <button
                        type="button"
                        onClick={() => { setActiveModal('legal_compliance'); setLegalModalTab('privacy'); }}
                        className="text-[#20B8CF] hover:underline"
                      >
                        Privacy Safeguards
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => { setActiveModal('legal_compliance'); setLegalModalTab('terms'); }}
                        className="text-[#20B8CF] hover:underline"
                      >
                        Staff Terms
                      </button>.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-2.5 bg-[#7057E8] text-white text-xs font-semibold rounded-lg shadow-lg hover:bg-[#6045d8] transition flex items-center justify-center gap-2 group"
                  >
                    <span>Proceed to Verification</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </button>
                </form>
              </div>
            ) : (
              
              <div className="text-center transition-all duration-300">
                <button
                  type="button"
                  onClick={() => {
                    setLoginStep('credentials');
                    setDigits(['', '', '', '']);
                    setVerificationError('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A6AEC0] hover:text-[#F7F8FC] mb-4 transition float-left"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="clear-both"></div>

                
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#7057E8]/10 border border-[#7057E8]/40 text-[#7057E8] mb-3">
                  <KeyRound className={`w-8 h-8 transition-transform duration-300 ${isVerifying ? 'animate-bounce' : ''}`} />
                  {verificationSuccess && (
                    <div className="absolute inset-0 bg-[#159A72] rounded-2xl flex items-center justify-center text-white animate-scaleIn">
                      <Check className="w-8 h-8 animate-pulse" />
                    </div>
                  )}
                </div>

                <h2 className="text-lg font-bold text-[#F7F8FC]">Two-Factor Verification</h2>
                <p className="text-xs text-[#A6AEC0] mt-1 max-w-xs mx-auto">
                  Enter your assigned <strong className="text-[#20B8CF]">4-digit security code</strong> to authenticate.
                </p>

                {verificationError && (
                  <div className="my-4 p-2.5 bg-[#D64545]/15 border border-[#D64545]/40 rounded-lg text-xs text-[#D64545] flex items-center justify-center gap-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}

                
                <div className={`flex justify-center gap-3 my-6 ${verificationError ? 'animate-shake' : ''}`}>
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={digitInputRefs[index]}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(index, e)}
                      onPaste={handlePasteDigits}
                      className={`w-14 h-16 text-center text-2xl font-bold font-mono bg-[#10131D] border rounded-xl outline-none transition-all duration-200 ${
                        verificationSuccess
                          ? 'border-[#159A72] text-[#159A72] bg-[#159A72]/10 scale-105'
                          : verificationError
                          ? 'border-[#D64545] text-[#D64545]'
                          : digit
                          ? 'border-[#7057E8] text-[#F7F8FC] shadow-lg shadow-[#7057E8]/20 ring-2 ring-[#7057E8]/40'
                          : 'border-[#343B4D] text-[#F7F8FC] focus:border-[#20B8CF] focus:ring-2 focus:ring-[#20B8CF]/30'
                      }`}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    disabled={isVerifying || digits.some((d) => d === '')}
                    onClick={() => verifyCode(digits.join(''))}
                    className={`w-full py-2.5 rounded-lg text-xs font-semibold shadow-md transition flex items-center justify-center gap-2 ${
                      isVerifying || digits.some((d) => d === '')
                        ? 'bg-[#1E2433] border border-[#343B4D] text-[#A6AEC0] cursor-not-allowed'
                        : 'bg-[#7057E8] text-white hover:bg-[#6045d8] shadow-[#7057E8]/30'
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#20B8CF]" />
                        <span>Verifying Security Code...</span>
                      </>
                    ) : verificationSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Authenticated! Entering Portal...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[#A6AEC0]">
                    Protected with end-to-end multi-factor authentication.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="py-3 px-6 border-t border-[#343B4D] bg-[#171B28]/80 flex flex-wrap items-center justify-between gap-3 text-xs text-[#A6AEC0]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#159A72]" />
            <span>CreatorAI Enterprise Shield Verified</span>
            <span className="text-[10px] text-[#20B8CF] bg-[#1E2433] px-2 py-0.5 rounded border border-[#343B4D]">
              20/20 Standards Active
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <button
              type="button"
              onClick={() => { setActiveModal('legal_compliance'); setLegalModalTab('privacy'); }}
              className="hover:text-[#F7F8FC] underline"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => { setActiveModal('legal_compliance'); setLegalModalTab('terms'); }}
              className="hover:text-[#F7F8FC] underline"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => { setActiveModal('legal_compliance'); setLegalModalTab('cookies'); }}
              className="hover:text-[#F7F8FC] underline"
            >
              Cookie Policy
            </button>
            <button
              type="button"
              onClick={() => { setActiveModal('legal_compliance'); setLegalModalTab('business'); }}
              className="hover:text-[#F7F8FC] underline"
            >
              Business Details
            </button>
            <button
              type="button"
              onClick={() => { setActiveModal('legal_compliance'); setLegalModalTab('deletion'); }}
              className="hover:text-[#20B8CF] text-[#20B8CF] underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Data Deletion</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveModal('legal_compliance'); setLegalModalTab('checklist'); }}
              className="text-[#7057E8] font-semibold hover:underline"
            >
              View 20-Point Shield
            </button>
          </div>
        </footer>

        {renderLegalModal()}
        {renderCookieBanner()}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#10131D] text-[#F7F8FC]">
      
      <aside className="w-64 flex-shrink-0 bg-[#171B28] border-r border-[#343B4D] flex flex-col justify-between">
        <div>
          
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

      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
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
            <button
              onClick={() => {
                setActiveModal('legal_compliance');
                setLegalModalTab('checklist');
              }}
              className="px-2.5 py-1.5 bg-[#1E2433] border border-[#343B4D] hover:border-[#159A72] text-[#A6AEC0] hover:text-[#F7F8FC] rounded text-xs font-medium transition flex items-center gap-1.5"
              title="20-Point Legal & Risk Shield"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#159A72]" />
              <span className="hidden sm:inline">Compliance Shield</span>
            </button>

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
                  setMemberFormError('');
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

        
        <main className="flex-1 overflow-y-auto p-6 bg-[#10131D]">
          
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
                    MFA: <strong className={systemConfig.mfaEnforced ? 'text-[#159A72]' : 'text-[#D98A18]'}>{systemConfig.mfaEnforced ? 'Strict (4-Digit PIN)' : 'Optional'}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-[#1E2433] border border-[#343B4D] rounded text-[#A6AEC0]">
                    Retention: <strong className="text-[#F7F8FC]">{systemConfig.dataRetentionDays} Days</strong>
                  </span>
                </div>
              </div>

              
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
                      setMemberFormError('');
                      setActiveModal('add_member');
                    }}
                    className="p-3.5 bg-[#1E2433] border border-[#343B4D] hover:border-[#7057E8] rounded-lg text-left transition"
                  >
                    <UserPlus className="w-5 h-5 text-[#7057E8] mb-2" />
                    <p className="font-semibold text-xs text-[#F7F8FC]">Provision New Staff</p>
                    <p className="text-[10px] text-[#A6AEC0] mt-0.5">Assign email, 4-digit code & role</p>
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
                    setMemberFormError('');
                    setActiveModal('add_member');
                  }}
                  className="px-3.5 py-2 bg-[#7057E8] text-white rounded text-xs font-semibold shadow hover:bg-[#6045d8] transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  + Provision New Member
                </button>
              </div>

              
              <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171B28] border-b border-[#343B4D] text-[#A6AEC0] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Member</th>
                      <th className="py-3 px-4">Role Title</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Credentials & MFA</th>
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
                          <span className="text-[11px] text-[#159A72] flex items-center gap-1 font-sans">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>MFA 4-Digit Active</span>
                          </span>
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
                                setMemberFormError('');
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

            {memberFormError && (
              <div className="mb-3 p-3 bg-[#D64545]/15 border border-[#D64545]/40 rounded-lg text-xs text-[#D64545] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{memberFormError}</span>
              </div>
            )}

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
                  <label className="block text-xs font-medium text-[#A6AEC0]">
                    Password (Must contain 4 continuous digits for verification code)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const randomPin = Math.floor(1000 + Math.random() * 9000);
                      setMemberForm({ ...memberForm, password: 'Pass' + randomPin });
                    }}
                    className="text-[10px] text-[#20B8CF] hover:underline"
                  >
                    Generate with 4 Digits
                  </button>
                </div>
                <input
                  type="text"
                  required={!editingMember}
                  placeholder="e.g. Pass8421 or 8421"
                  value={memberForm.password}
                  onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                  className="w-full bg-[#10131D] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] font-mono outline-none focus:border-[#7057E8]"
                />
                <p className="text-[10px] text-[#A6AEC0] mt-1">
                  The 4 digits in this password serve as their two-step login verification code.
                </p>
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

  function renderCookieBanner() {
    if (cookieConsentAccepted) return null;
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-[#171B28] border border-[#343B4D] rounded-xl p-4 shadow-2xl backdrop-blur-md animate-fadeIn">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7057E8]/15 border border-[#7057E8]/40 flex items-center justify-center text-[#7057E8] flex-shrink-0 mt-0.5">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F7F8FC]">Privacy & Essential Cookies</h4>
              <p className="text-[11px] text-[#A6AEC0] mt-1 leading-relaxed">
                CreatorAI uses strictly essential session and security cookies for multi-factor authentication and platform stability. No third-party ad tracking.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAcceptCookies('essential')}
            className="text-[#A6AEC0] hover:text-[#F7F8FC] p-1"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#343B4D]">
          <button
            onClick={() => {
              setActiveModal('legal_compliance');
              setLegalModalTab('cookies');
            }}
            className="text-[11px] text-[#20B8CF] hover:underline"
          >
            Cookie Policy
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAcceptCookies('essential')}
              className="px-2.5 py-1 text-[11px] bg-[#1E2433] hover:bg-[#343B4D] text-[#A6AEC0] hover:text-[#F7F8FC] rounded-md transition"
            >
              Essential Only
            </button>
            <button
              onClick={() => handleAcceptCookies('all')}
              className="px-3 py-1 text-[11px] bg-[#7057E8] hover:bg-[#6045d8] text-white font-medium rounded-md transition shadow-sm"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    );
  };

  function renderLegalModal() {
    if (activeModal !== 'legal_compliance') return null;
    return (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1E2433] border border-[#343B4D] rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
          <div className="p-4 px-6 border-b border-[#343B4D] flex items-center justify-between bg-[#171B28]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#7057E8]/20 border border-[#7057E8]/40 flex items-center justify-center text-[#7057E8]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#F7F8FC]">CreatorAI Legal & Compliance Center</h3>
                <p className="text-[11px] text-[#A6AEC0]">20-Point Operational & Privacy Protection Standards</p>
              </div>
            </div>
            <button onClick={closeModal} className="text-[#A6AEC0] hover:text-[#F7F8FC] p-1">
              ✕
            </button>
          </div>

          <div className="flex border-b border-[#343B4D] bg-[#10131D] px-6 overflow-x-auto gap-2">
            {[
              { id: 'checklist', label: '20-Point Shield' },
              { id: 'privacy', label: 'Privacy Policy' },
              { id: 'terms', label: 'Terms of Service' },
              { id: 'cookies', label: 'Cookie Policy' },
              { id: 'business', label: 'Business Details' },
              { id: 'deletion', label: 'Data Deletion (Art. 17)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLegalModalTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-medium border-b-2 transition whitespace-nowrap ${
                  legalModalTab === tab.id
                    ? 'border-[#7057E8] text-[#7057E8]'
                    : 'border-transparent text-[#A6AEC0] hover:text-[#F7F8FC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-[#A6AEC0] leading-relaxed">
            {legalModalTab === 'checklist' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#171B28] border border-[#343B4D] rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-[#F7F8FC]">20/20 Legal Protection Standards</h4>
                    <p className="text-[11px] text-[#A6AEC0]">Enterprise risk mitigation and privacy compliance checklist.</p>
                  </div>
                  <span className="px-3 py-1 bg-[#159A72]/20 border border-[#159A72]/40 text-[#159A72] rounded-full font-semibold text-xs">
                    100% Compliant
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {COMPLIANCE_ITEMS_20.map((item) => (
                    <div key={item.id} className="p-3 bg-[#10131D] border border-[#343B4D] rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#F7F8FC] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#159A72]" />
                          <span>{item.id}. {item.title}</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#20B8CF] bg-[#1E2433] px-2 py-0.5 rounded">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A6AEC0]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {legalModalTab === 'privacy' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#F7F8FC]">Workforce & Platform Privacy Policy</h4>
                <p>
                  CreatorAI is dedicated to safeguarding personnel privacy and operational confidentiality. This document outlines how staff records, account credentials, and platform logs are processed.
                </p>
                <div className="p-3 bg-[#10131D] border border-[#343B4D] rounded-lg space-y-2">
                  <h5 className="font-semibold text-[#F7F8FC]">1. Data Minimization (Collect Only Needed Data)</h5>
                  <p>We collect only the essential attributes required to coordinate workforce activity: full name, authorized email address, organizational role, department, and system event timestamps.</p>
                </div>
                <div className="p-3 bg-[#10131D] border border-[#343B4D] rounded-lg space-y-2">
                  <h5 className="font-semibold text-[#F7F8FC]">2. Zero Third-Party Tracker SDKs</h5>
                  <p>The CreatorAI platform contains zero advertising SDKs, zero behavioral trackers, and zero external tracking pixels. All application bundles and fonts are hosted internally.</p>
                </div>
                <div className="p-3 bg-[#10131D] border border-[#343B4D] rounded-lg space-y-2">
                  <h5 className="font-semibold text-[#F7F8FC]">3. Data Security & Storage</h5>
                  <p>All sensitive authentication tokens and session states are secured using industry-standard hashing and encrypted transit (TLS 1.3). Access controls adhere strictly to least-privilege role boundaries.</p>
                </div>
              </div>
            )}

            {legalModalTab === 'terms' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#F7F8FC]">Staff & Enterprise Terms of Service</h4>
                <p>
                  Access to the CreatorAI Staff Management Portal is granted exclusively to authorized personnel and verified contracted contributors.
                </p>
                <div className="p-3 bg-[#10131D] border border-[#343B4D] rounded-lg space-y-2">
                  <h5 className="font-semibold text-[#F7F8FC]">1. Acceptable Use & Confidentiality</h5>
                  <p>All roadmaps, documents, reports, and applicant data viewed within this portal are confidential proprietary trade secrets of CreatorAI. Unauthorized extraction or disclosure is strictly prohibited.</p>
                </div>
                <div className="p-3 bg-[#10131D] border border-[#343B4D] rounded-lg space-y-2">
                  <h5 className="font-semibold text-[#F7F8FC]">2. Intellectual Property</h5>
                  <p>All works created, uploaded, or managed within the workspace remain the sole property of CreatorAI Technologies Inc. Stock assets and multimedia must possess verified commercial usage rights.</p>
                </div>
                <div className="p-3 bg-[#10131D] border border-[#343B4D] rounded-lg space-y-2">
                  <h5 className="font-semibold text-[#F7F8FC]">3. Account Revocation</h5>
                  <p>Leadership reserves the right to suspend or revoke portal privileges immediately upon role termination or security breach detection.</p>
                </div>
              </div>
            )}

            {legalModalTab === 'cookies' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#F7F8FC]">Cookie & Storage Policy</h4>
                <p>
                  CreatorAI employs local storage and essential session tokens exclusively for functionality and authentication integrity.
                </p>
                <div className="p-3 bg-[#10131D] border border-[#343B4D] rounded-lg space-y-2">
                  <h5 className="font-semibold text-[#F7F8FC]">Strictly Necessary Tokens</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong className="text-[#F7F8FC]">creatorai_portal_state:</strong> Stores current workspace records and assignments in encrypted local storage.</li>
                    <li><strong className="text-[#F7F8FC]">creatorai_cookie_consent:</strong> Retains your affirmative privacy consent preference.</li>
                    <li><strong className="text-[#F7F8FC]">creatorai_auth_session:</strong> Secure cryptographic token for maintaining authenticated staff sessions.</li>
                  </ul>
                </div>
              </div>
            )}

            {legalModalTab === 'business' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#F7F8FC]">Business & Corporate Registry</h4>
                <div className="p-4 bg-[#10131D] border border-[#343B4D] rounded-lg space-y-2 text-xs">
                  <p><strong className="text-[#F7F8FC]">Legal Entity:</strong> CreatorAI Media Global Ltd.</p>
                  <p><strong className="text-[#F7F8FC]">Corporate HQ:</strong> 100 Montgomery St, Suite 1800, San Francisco, CA 94104, USA</p>
                  <p><strong className="text-[#F7F8FC]">Registration ID:</strong> US-EIN 94-3829104 | DUNS: 08-192-4820</p>
                  <p><strong className="text-[#F7F8FC]">Data Protection Officer:</strong> compliance@creatorai.team</p>
                  <p><strong className="text-[#F7F8FC]">Legal Inquiries:</strong> legal@creatorai.team</p>
                  <p><strong className="text-[#F7F8FC]">Personnel Age Restriction:</strong> CreatorAI staff access is strictly restricted to verified individuals aged 18 and older.</p>
                </div>
              </div>
            )}

            {legalModalTab === 'deletion' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#F7F8FC]">GDPR Article 17 — Right to Erasure</h4>
                <p>
                  Staff members or former contractors may request permanent deletion of their personal records, profile information, and activity telemetry.
                </p>
                {deletionFeedback && (
                  <div className="p-3 bg-[#159A72]/20 border border-[#159A72]/40 rounded-lg text-xs text-[#159A72] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{deletionFeedback}</span>
                  </div>
                )}
                <form onSubmit={handleRequestDataDeletion} autoComplete="off" className="p-4 bg-[#10131D] border border-[#343B4D] rounded-lg space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#A6AEC0] mb-1">Account Email to Erase</label>
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      placeholder="name@creatorai.team"
                      value={deletionEmail}
                      onChange={(e) => setDeletionEmail(e.target.value)}
                      className="w-full bg-[#1E2433] border border-[#343B4D] rounded-lg px-3 py-2 text-xs text-[#F7F8FC] outline-none focus:border-[#D64545]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#D64545] hover:bg-[#b53535] text-white text-xs font-semibold rounded-lg transition shadow flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Execute Permanent Data Deletion</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="p-4 px-6 border-t border-[#343B4D] bg-[#171B28] flex justify-between items-center text-xs">
            <span className="text-[#A6AEC0]">Last updated & verified: November 2026</span>
            <button
              onClick={closeModal}
              className="px-4 py-1.5 bg-[#7057E8] text-white rounded font-medium hover:bg-[#6045d8] transition"
            >
              Close Center
            </button>
          </div>
        </div>
      </div>
    );
  };

}
