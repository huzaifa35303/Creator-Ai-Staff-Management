export interface OrgNode {
  id: string;
  name: string;
  role: string;
  group: 'Executive' | 'Directors' | 'Managers' | 'Leads' | 'Specialists' | 'Partners';
  department: string;
  avatar: string;
  reportsTo?: string;
  children?: OrgNode[];
}

// Hierarchical Graph structure inspired by Graphify & CreatorAI Section 6 & 16
export const CREATORAI_ORG_TREE: OrgNode = {
  id: 'AW',
  name: 'Alexander Wright',
  role: 'CEO Of Creator AI',
  group: 'Executive',
  department: 'Executive',
  avatar: 'AW',
  children: [
    {
      id: 'ER',
      name: 'Elena Rostova',
      role: 'COO Of Creator AI',
      group: 'Executive',
      department: 'Executive',
      avatar: 'ER',
      reportsTo: 'AW',
      children: [
        {
          id: 'MV',
          name: 'Marcus Vance',
          role: 'Director of Operations',
          group: 'Directors',
          department: 'Operations',
          avatar: 'MV',
          reportsTo: 'ER',
          children: [
            {
              id: 'OM',
              name: 'Sarah Jenkins',
              role: 'Operations Manager',
              group: 'Managers',
              department: 'Operations',
              avatar: 'SJ',
              reportsTo: 'MV',
              children: [
                { id: 'SL', name: 'Chris Evans', role: 'Support Lead', group: 'Leads', department: 'Operations', avatar: 'CE', reportsTo: 'OM' }
              ]
            }
          ]
        },
        {
          id: 'DM',
          name: 'Devon Miller',
          role: 'Director Of Bots',
          group: 'Directors',
          department: 'Technology',
          avatar: 'DM',
          reportsTo: 'ER',
          children: [
            { id: 'BE', name: 'David Oh', role: 'Bot Systems Engineer', group: 'Specialists', department: 'Technology', avatar: 'DO', reportsTo: 'DM' }
          ]
        }
      ]
    },
    {
      id: 'SC',
      name: 'Sophia Chen',
      role: 'Director of Community',
      group: 'Directors',
      department: 'Community',
      avatar: 'SC',
      reportsTo: 'AW',
      children: [
        {
          id: 'AO',
          name: 'Amara Okafor',
          role: 'Community Manager',
          group: 'Managers',
          department: 'Community',
          avatar: 'AO',
          reportsTo: 'SC',
          children: [
            { id: 'CL', name: 'Zack Taylor', role: 'Community Lead', group: 'Leads', department: 'Community', avatar: 'ZT', reportsTo: 'AO' },
            { id: 'CE', name: 'Nadia Fox', role: 'Senior Community Executive', group: 'Specialists', department: 'Community', avatar: 'NF', reportsTo: 'AO' }
          ]
        }
      ]
    },
    {
      id: 'JH',
      name: 'Julian Hayes',
      role: 'Director of Creative Team',
      group: 'Directors',
      department: 'Creative',
      avatar: 'JH',
      reportsTo: 'AW',
      children: [
        {
          id: 'GC',
          name: 'Gabriel Cole',
          role: 'Director Of Editor Team',
          group: 'Directors',
          department: 'Editorial',
          avatar: 'GC',
          reportsTo: 'JH',
          children: [
            { id: 'LS', name: 'Lucas Sterling', role: 'Senior Editor', group: 'Specialists', department: 'Editorial', avatar: 'LS', reportsTo: 'GC' },
            { id: 'ED', name: 'Maria Gomez', role: 'Editor', group: 'Specialists', department: 'Editorial', avatar: 'MG', reportsTo: 'GC' }
          ]
        },
        {
          id: 'ML',
          name: 'Maya Lin',
          role: 'Creative Lead',
          group: 'Leads',
          department: 'Creative',
          avatar: 'ML',
          reportsTo: 'JH'
        }
      ]
    },
    {
      id: 'NT',
      name: 'Nadia Thorne',
      role: 'Director of Marketing',
      group: 'Directors',
      department: 'Marketing',
      avatar: 'NT',
      reportsTo: 'AW',
      children: [
        {
          id: 'SMM',
          name: 'Rachel Bloom',
          role: 'Social Media Manager',
          group: 'Managers',
          department: 'Marketing',
          avatar: 'RB',
          reportsTo: 'NT',
          children: [
            { id: 'SML', name: 'Ethan Hunt', role: 'Social Media Lead', group: 'Leads', department: 'Marketing', avatar: 'EH', reportsTo: 'SMM' }
          ]
        }
      ]
    }
  ]
};

// Department metadata integrated with Agency-Agents division taxonomy
export const CREATORAI_DEPARTMENTS = [
  { id: 'exec', name: 'Executive Leadership', lead: 'Alexander Wright', color: '#7057E8', members: 4, openTasks: 3, icon: 'ShieldCheck' },
  { id: 'ops', name: 'Operations & Governance', lead: 'Marcus Vance', color: '#0EA5E9', members: 6, openTasks: 8, icon: 'ClipboardList' },
  { id: 'comm', name: 'Community & Member Engagement', lead: 'Sophia Chen', color: '#EC4899', members: 8, openTasks: 12, icon: 'Users' },
  { id: 'creative', name: 'Creative Design & Visuals', lead: 'Julian Hayes', color: '#F97316', members: 7, openTasks: 9, icon: 'PenTool' },
  { id: 'editorial', name: 'Editorial & Media Post-Production', lead: 'Gabriel Cole', color: '#8B5CF6', members: 9, openTasks: 14, icon: 'Layers' },
  { id: 'tech', name: 'Technology & Bot Automations', lead: 'Devon Miller', color: '#3B82F6', members: 5, openTasks: 7, icon: 'Code' },
  { id: 'marketing', name: 'Marketing & Omnichannel Growth', lead: 'Nadia Thorne', color: '#EAB308', members: 6, openTasks: 11, icon: 'Megaphone' },
  { id: 'partners', name: 'Partnerships & Creator Relations', lead: 'Partnership Manager', color: '#159A72', members: 12, openTasks: 5, icon: 'Briefcase' },
];

// Knowledge Base Documents inspired by AppFlowy document architecture
export interface KnowledgeDoc {
  id: string;
  category: 'SOPs' | 'Security Policies' | 'Onboarding' | 'Media Guidelines';
  title: string;
  lastUpdated: string;
  accessLevel: 'All Staff' | 'Leads & Above' | 'Executive Only';
  summary: string;
  content: string;
}

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'DOC-01',
    category: 'SOPs',
    title: 'Standard Operating Procedure: Video Media Ingestion & Color Pipeline',
    lastUpdated: 'Nov 18, 2026',
    accessLevel: 'All Staff',
    summary: 'Standardized workflow for receiving raw creator footage, LUT application, and final QC rendering.',
    content: 'All raw rushes must be stored in the designated S3 cold bucket within 2 hours of upload. Editors must utilize CreatorAI Color Pipeline v3.2 before client presentation.',
  },
  {
    id: 'DOC-02',
    category: 'Security Policies',
    title: 'Zero-Trust Credential Management & Audit Trail Compliance',
    lastUpdated: 'Nov 15, 2026',
    accessLevel: 'All Staff',
    summary: 'Mandatory password rotation, MFA policies, and guidelines for revoking compromised API tokens.',
    content: 'Passwords must contain a minimum of 12 characters. All administrative role modifications require a 2-person approval audit trail.',
  },
  {
    id: 'DOC-03',
    category: 'Onboarding',
    title: 'New Staff First 7 Days Orientation Roadmap',
    lastUpdated: 'Nov 10, 2026',
    accessLevel: 'All Staff',
    summary: 'Step-by-step checklist for new personnel from workspace setup to first project delivery.',
    content: 'Day 1: Account activation & MFA setup. Day 2: Department overview with reporting director. Day 3: SOP review. Day 4-5: Shadowing.',
  },
  {
    id: 'DOC-04',
    category: 'Media Guidelines',
    title: 'CreatorAI Brand Craft & Visual Identity Standards (Hallmark Compliance)',
    lastUpdated: 'Nov 12, 2026',
    accessLevel: 'All Staff',
    summary: 'Design grammar, 8px layout rhythm, typography, and contrast rules to ensure non-generic UI output.',
    content: 'Always utilize the 8px spacing rhythm. Maintain high contrast with #F7F8FC on #10131D. Avoid unnecessary gradients or generic card clutter.',
  },
];
