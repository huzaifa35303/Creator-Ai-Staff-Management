export interface RoleDefinition {
  id: string;
  title: string;
  group: 'Executive' | 'Directors' | 'Managers' | 'Leads' | 'Specialists' | 'Partners';
  department: string;
  defaultScope: 'organisation' | 'department' | 'team' | 'own' | 'external';
  description: string;
}

export const EXACT_ROLE_NAMES: RoleDefinition[] = [
  { id: 'ceo', title: 'CEO Of Creator AI', group: 'Executive', department: 'Executive', defaultScope: 'organisation', description: 'Overall vision, executive strategy and organisation direction.' },
  { id: 'coo', title: 'COO Of Creator AI', group: 'Executive', department: 'Executive', defaultScope: 'organisation', description: 'Operational leadership across all functional units.' },
  { id: 'md', title: 'Managing Director', group: 'Executive', department: 'Executive', defaultScope: 'organisation', description: 'Business strategy execution and cross-department governance.' },
  { id: 'cso', title: 'Chief Strategy Officer', group: 'Executive', department: 'Executive', defaultScope: 'organisation', description: 'Strategic partnerships, long-range roadmaps and innovation.' },
  { id: 'exec-dir', title: 'Executive Director', group: 'Executive', department: 'Executive', defaultScope: 'organisation', description: 'Executive oversight and high-level initiative coordination.' },
  { id: 'dir-ops', title: 'Director of Operations', group: 'Directors', department: 'Operations', defaultScope: 'department', description: 'Operations governance, resource deployment and internal processes.' },
  { id: 'dir-comm', title: 'Director of Community', group: 'Directors', department: 'Community', defaultScope: 'department', description: 'Global community strategy, growth, and member engagement.' },
  { id: 'dir-creative', title: 'Director of Creative Team', group: 'Directors', department: 'Creative', defaultScope: 'department', description: 'Creative direction, brand visuals, production standards.' },
  { id: 'dir-social', title: 'Director of Social Media', group: 'Directors', department: 'Marketing', defaultScope: 'department', description: 'Social media strategy, omnichannel outreach and content distribution.' },
  { id: 'dir-marketing', title: 'Director of Marketing', group: 'Directors', department: 'Marketing', defaultScope: 'department', description: 'Acquisition strategy, campaigns and brand communication.' },
  { id: 'dir-bots', title: 'Director Of Bots', group: 'Directors', department: 'Technology', defaultScope: 'department', description: 'Bot systems, automation pipelines and AI tooling.' },
  { id: 'dir-editor', title: 'Director Of Editor Team', group: 'Directors', department: 'Editorial', defaultScope: 'department', description: 'Video and media post-production leadership.' },
  { id: 'mgr-ops', title: 'Operations Manager', group: 'Managers', department: 'Operations', defaultScope: 'team', description: 'Day-to-day operations planning, logistics and workflow execution.' },
  { id: 'mgr-comm', title: 'Community Manager', group: 'Managers', department: 'Community', defaultScope: 'team', description: 'Community moderation, event orchestration and support.' },
  { id: 'mgr-sr-comm', title: 'Senior Community Manager', group: 'Managers', department: 'Community', defaultScope: 'team', description: 'Advanced community initiatives, escalations and lead mentorship.' },
  { id: 'mgr-creative', title: 'Creative Manager', group: 'Managers', department: 'Creative', defaultScope: 'team', description: 'Asset deliverables, design team sprints and creative reviews.' },
  { id: 'mgr-social', title: 'Social Media Manager', group: 'Managers', department: 'Marketing', defaultScope: 'team', description: 'Campaign scheduling, analytics and cross-platform management.' },
  { id: 'mgr-marketing', title: 'Marketing Manager', group: 'Managers', department: 'Marketing', defaultScope: 'team', description: 'Funnel optimization, outreach campaigns and advertising performance.' },
  { id: 'mgr-partnership', title: 'Partnership Manager', group: 'Managers', department: 'Partnerships', defaultScope: 'team', description: 'Partner onboarding, collaboration lifecycles and creator liaison.' },
  { id: 'lead-comm', title: 'Community Lead', group: 'Leads', department: 'Community', defaultScope: 'team', description: 'Coordination of frontline community executive staff and schedules.' },
  { id: 'lead-creative', title: 'Creative Lead', group: 'Leads', department: 'Creative', defaultScope: 'team', description: 'Design reviews, visual quality gates and task assignments.' },
  { id: 'lead-social', title: 'Social Media Lead', group: 'Leads', department: 'Marketing', defaultScope: 'team', description: 'Social posting calendar execution and engagement oversight.' },
  { id: 'lead-marketing', title: 'Marketing Lead', group: 'Leads', department: 'Marketing', defaultScope: 'team', description: 'Campaign task distribution and growth experiments.' },
  { id: 'lead-support', title: 'Support Lead', group: 'Leads', department: 'Operations', defaultScope: 'team', description: 'Staff and member support resolution, escalation routing.' },
  { id: 'spec-sr-comm-exec', title: 'Senior Community Executive', group: 'Specialists', department: 'Community', defaultScope: 'own', description: 'Senior moderation, member relations and dispute mediation.' },
  { id: 'spec-comm-exec', title: 'Community Executive', group: 'Specialists', department: 'Community', defaultScope: 'own', description: 'Active community engagement, chat moderation and reporting.' },
  { id: 'spec-comm-expert', title: 'Community Expert', group: 'Specialists', department: 'Community', defaultScope: 'own', description: 'Subject matter advisory, FAQs and community knowledge authoring.' },
  { id: 'spec-sr-editor', title: 'Senior Editor', group: 'Specialists', department: 'Editorial', defaultScope: 'own', description: 'High-production media editing, pacing, sound design and VFX.' },
  { id: 'spec-editor', title: 'Editor', group: 'Specialists', department: 'Editorial', defaultScope: 'own', description: 'Daily video and multimedia editing against project specs.' },
  { id: 'spec-asst-editor', title: 'Assistant Editor', group: 'Specialists', department: 'Editorial', defaultScope: 'own', description: 'Asset organization, rough cuts, syncing and subtitle creation.' },
  { id: 'spec-editor-expert', title: 'Editor Expert', group: 'Specialists', department: 'Editorial', defaultScope: 'own', description: 'Color grading, sound mastering and technical quality control.' },
  { id: 'part-ambassador', title: 'Server Ambassador', group: 'Partners', department: 'Partnerships', defaultScope: 'external', description: 'Platform evangelism, creator outreach and representation.' },
  { id: 'part-partner', title: 'CreatorAI Partner', group: 'Partners', department: 'Partnerships', defaultScope: 'external', description: 'Affiliated organization or agency partner with scoped workspace access.' },
  { id: 'part-verified-creator', title: 'Verified Creator', group: 'Partners', department: 'Partnerships', defaultScope: 'external', description: 'Verified talent collaborate on brand briefs and campaigns.' },
];
