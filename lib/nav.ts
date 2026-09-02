export type NavLink = {
  title: string;
  href: string;
  description: string;
};

export type NavSection = {
  title: string;
  links: NavLink[];
};

export const docsNav: NavSection[] = [
  {
    title: 'Getting Started',
    links: [
      {
        title: 'Introduction',
        href: '/getting-started/introduction',
        description: 'What rznish chatbot is and how it is built.',
      },
      {
        title: 'Setup',
        href: '/getting-started/setup',
        description: 'Environment variables and local setup.',
      },
      {
        title: 'Deployment',
        href: '/getting-started/deployment',
        description: 'Deploying rznish chatbot to production.',
      },
    ],
  },
  {
    title: 'Ask AI',
    links: [
      {
        title: 'Overview',
        href: '/ask-ai/overview',
        description: 'A built-in AI assistant for these docs.',
      },
      {
        title: 'Configuration',
        href: '/ask-ai/configuration',
        description: 'Environment variables and options for Ask AI.',
      },
    ],
  },
];

export const allDocsLinks: NavLink[] = docsNav.flatMap((section) => section.links);

export const docsHomeHref = docsNav[0].links[0].href;
