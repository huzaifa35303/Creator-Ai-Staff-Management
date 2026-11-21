/**
 * Terminal logging utility for CreatorAI
 * Prints Discord-bot style formatted logs directly to the server terminal stdout/stderr.
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bgRed: '\x1b[41m',
};

export const logger = {
  info: (message: string, meta?: any) => {
    const time = new Date().toLocaleTimeString();
    console.log(`${colors.cyan}[CreatorAI INFO ${time}]${colors.reset} ${message}`);
    if (meta) console.log(colors.dim, meta, colors.reset);
  },

  success: (message: string, meta?: any) => {
    const time = new Date().toLocaleTimeString();
    console.log(`${colors.green}[CreatorAI SUCCESS ${time}]${colors.reset} ${message}`);
    if (meta) console.log(colors.dim, meta, colors.reset);
  },

  warn: (message: string, meta?: any) => {
    const time = new Date().toLocaleTimeString();
    console.warn(`${colors.yellow}⚠️ [CreatorAI WARN ${time}]${colors.reset} ${message}`);
    if (meta) console.warn(colors.dim, meta, colors.reset);
  },

  error: (message: string, error?: any) => {
    const time = new Date().toLocaleTimeString();
    console.error(`\n${colors.bgRed}${colors.bright} [CREATORAI ERROR ${time}] ${colors.reset} ${colors.red}${message}${colors.reset}`);
    if (error?.stack) {
      console.error(`${colors.red}${error.stack}${colors.reset}\n`);
    } else if (error) {
      console.error(error);
    }
  },
};
