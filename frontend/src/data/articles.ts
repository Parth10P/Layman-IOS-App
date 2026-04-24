import type { Article } from '../types';

export const articles: Article[] = [
  {
    id: '1',
    category: 'Business',
    title: 'Big banks are quietly betting on AI tools',
    subtitle: 'Why this matters',
    headline: 'Banks want AI to cut slow office work',
    summary:
      'Large banks are using AI for reports, risk checks, and customer support so teams can move faster without hiring as many new people.',
    imageLabel: 'AI + Banking',
    accent: '#E48A48',
    cards: [
      'Banks are testing AI to handle boring admin work and speed up internal tasks. That means employees can spend more time on decisions instead of paperwork.',
      'The goal is not just cost cutting. Banks also want fewer mistakes, faster customer replies, and better ways to scan huge amounts of data.',
      'For everyday users, this could mean quicker approvals, smoother support chats, and more personalized services. It also raises questions about trust and oversight.',
    ],
    suggestions: [
      'Will AI replace bank jobs?',
      'How does this help customers?',
      'What are the risks here?',
    ],
    source: 'Financial Daily',
  },
  {
    id: '2',
    category: 'Tech',
    title: 'Chip startup raises fresh funding for faster servers',
    subtitle: 'Today pick',
    headline: 'A new chip startup just landed major cash',
    summary:
      'Investors are putting more money into chips built for AI workloads because demand for fast computing keeps rising across apps and cloud tools.',
    imageLabel: 'Future Chips',
    accent: '#F1A25C',
    cards: [
      'This startup builds chips designed for AI workloads, which need huge amounts of speed and efficiency. Investors think better hardware will stay in demand for years.',
      'The funding helps the company hire engineers, improve manufacturing, and win bigger customers. That is often the hardest jump for young hardware startups.',
      'If the product works well, it could give data centers cheaper and faster options. That matters as companies spend more on AI products and infrastructure.',
    ],
    suggestions: [
      'Why are AI chips so valuable?',
      'Who might buy these chips?',
      'Is this market too crowded?',
    ],
    source: 'Techline',
  },
  {
    id: '3',
    category: 'Startups',
    title: 'Consumer app grows by making finance easier to understand',
    subtitle: 'Made simple',
    headline: 'This startup is making money talk less confusing',
    summary:
      'A startup is winning users with simpler language, friendlier design, and shorter explanations that make personal finance feel less intimidating.',
    imageLabel: 'Simple Money',
    accent: '#D56F41',
    cards: [
      'The product succeeds because it removes jargon and explains money in plain language. People often avoid financial apps when they feel judged or confused.',
      'The team focused on design, trust, and short lessons instead of packing in too many features. That made the app feel useful right away.',
      'This shows a bigger trend in tech: products win when they reduce stress. Simple language can be just as powerful as a new technical feature.',
    ],
    suggestions: [
      'Why does simple wording matter so much?',
      'How is this different from banking apps?',
      'What makes a finance app trustworthy?',
    ],
    source: 'Startup Brief',
  },
];
