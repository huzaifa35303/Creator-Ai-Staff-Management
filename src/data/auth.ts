export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string; // Plaintext or simulated hash for demo
  name: string;
  role: string;
  group: 'Executive' | 'Directors' | 'Managers' | 'Leads' | 'Specialists' | 'Partners';
  department: string;
  isAdmin: boolean;
  status: 'Active' | 'Invited' | 'Suspended';
  createdAt: string;
}

// Default initial accounts
export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'USR-ADMIN',
    email: 'admin@creatorai.team',
    passwordHash: 'CreatorAI2026!',
    name: 'System Administrator (Owner)',
    role: 'CEO Of Creator AI',
    group: 'Executive',
    department: 'Executive',
    isAdmin: true,
    status: 'Active',
    createdAt: '2026-01-01',
  },
  {
    id: 'USR-102',
    email: 'e.rostova@creatorai.team',
    passwordHash: 'CreatorAI2026!',
    name: 'Elena Rostova',
    role: 'COO Of Creator AI',
    group: 'Executive',
    department: 'Executive',
    isAdmin: true,
    status: 'Active',
    createdAt: '2026-02-15',
  },
  {
    id: 'USR-103',
    email: 'm.vance@creatorai.team',
    passwordHash: 'Operations2026!',
    name: 'Marcus Vance',
    role: 'Director of Operations',
    group: 'Directors',
    department: 'Operations',
    isAdmin: false,
    status: 'Active',
    createdAt: '2026-03-01',
  },
  {
    id: 'USR-110',
    email: 'l.sterling@creatorai.team',
    passwordHash: 'Editor2026!',
    name: 'Lucas Sterling',
    role: 'Senior Editor',
    group: 'Specialists',
    department: 'Editorial',
    isAdmin: false,
    status: 'Active',
    createdAt: '2026-07-10',
  },
];
