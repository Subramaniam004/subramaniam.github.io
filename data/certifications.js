/**
 * ── Certifications Data ──────────────────────────────
 * Add new entries here to automatically render them in the certification grids.
 */
const certifications = [
  {
    id: 1,
    title: 'Ethical Hacking',
    issuer: 'Tutedude',
    issueDate: '2026-01',
    description: 'Foundation certificate in ethical hacking concepts and practical security basics.',
    skills: ['Ethical Hacking', 'Security Fundamentals', 'Linux'],
    category: 'professional',
    pdf: 'certificates/tutedude-ethical-hacking.pdf',
    logo: 'images/certifications/tutedude.svg',
    verifyUrl: ''
  },
  {
    id: 2,
    title: 'Cybersecurity',
    issuer: 'Simplilearn',
    issueDate: '2026-01',
    description: 'Certificate covering core cybersecurity concepts and defensive practices.',
    skills: ['Cybersecurity', 'Network Security', 'Secure Coding'],
    category: 'professional',
    pdf: 'certificates/simplilearn-cybersecurity.pdf',
    logo: 'images/certifications/simplilearn.svg',
    verifyUrl: ''
  },
  {
    id: 3,
    title: 'Deloitte Cyber Job Simulation',
    issuer: 'Deloitte',
    issueDate: '2026-04',
    description: 'Industry simulation focused on cybersecurity analysis and consulting workflows.',
    skills: ['Cybersecurity', 'Analysis', 'Consulting'],
    category: 'simulation',
    pdf: 'certificates/deloitte-cyber-job-simulation.pdf',
    logo: 'images/certifications/deloitte.svg',
    verifyUrl: ''
  },
  {
    id: 4,
    title: 'Deloitte Data Analytics Job Simulation',
    issuer: 'Deloitte',
    issueDate: '2026-04',
    description: 'Simulation covering data analysis, interpretation, and reporting workflows.',
    skills: ['Data Analysis', 'Reporting', 'Problem Solving'],
    category: 'simulation',
    pdf: 'certificates/deloitte-data-analytics-job-simulation.pdf',
    logo: 'images/certifications/deloitte.svg',
    verifyUrl: ''
  },
  {
    id: 5,
    title: 'Electronic Arts Job Simulation',
    issuer: 'Electronic Arts',
    issueDate: '2026-04',
    description: 'Simulation experience focused on technical delivery and team workflows.',
    skills: ['Software Engineering', 'Collaboration', 'Delivery'],
    category: 'simulation',
    pdf: 'certificates/electronic-arts-job-simulation.pdf',
    logo: 'images/certifications/electronic-arts.svg',
    verifyUrl: ''
  },
  {
    id: 6,
    title: 'TATA IAM Job Simulation',
    issuer: 'Tata',
    issueDate: '2026-04',
    description: 'Identity and access management simulation covering security operations.',
    skills: ['IAM', 'Security Operations', 'Access Control'],
    category: 'simulation',
    pdf: 'certificates/tata-iam-job-simulation.pdf',
    logo: 'images/certifications/tata.svg',
    verifyUrl: ''
  },
  {
    id: 7,
    title: 'Google AI Essentials',
    issuer: 'Google',
    issueDate: '2026-05',
    description: 'Foundational certificate in practical AI concepts and responsible usage.',
    skills: ['AI', 'Prompting', 'Productivity'],
    category: 'professional',
    pdf: 'certificates/google-ai-essentials.pdf',
    logo: 'images/certifications/google.svg',
    verifyUrl: ''
  },
  {
    id: 8,
    title: 'Google IT Automation with Python',
    issuer: 'Google',
    issueDate: '2024-03',
    description: 'Python automation certificate with scripting and workflow fundamentals.',
    skills: ['Python', 'Automation', 'CLI'],
    category: 'professional',
    pdf: 'certificates/google-it-automation-with-python.pdf',
    logo: 'images/certifications/google.svg',
    verifyUrl: ''
  },
  {
    id: 10,
    title: 'Cybersecurity Certification',
    issuer: 'Simplilearn',
    issueDate: '2026-07',
    description: 'Comprehensive professional certification validating expertise in cybersecurity principles, network security, and defensive operations.',
    skills: ['Cybersecurity', 'Network Security', 'Vulnerability Assessment', 'Incident Response'],
    category: 'internship',
    pdf: 'certificates/SUBRAMANIAM B Cybersecurity Cert.png',
    logo: 'images/certifications/simplilearn.svg',
    verifyUrl: ''
  },
  {
    id: 11,
    title: 'Data Science Certification',
    issuer: 'Simplilearn',
    issueDate: '2026-07',
    description: 'Professional certification validating expertise in data analysis, statistical modeling, machine learning, and data visualization.',
    skills: ['Data Science', 'Python', 'Data Analysis', 'Machine Learning'],
    category: 'internship',
    pdf: 'certificates/SUBRAMANIAM B Data Science Cert.png',
    logo: 'images/certifications/simplilearn.svg',
    verifyUrl: ''
  },
  {
    id: 12,
    title: 'Hackathon Insignia Mobile Application Development',
    issuer: 'Hackathon Insignia',
    issueDate: '2026-04',
    description: 'Participation and achievement in the Hackathon Insignia for Mobile Application Development.',
    skills: ['Mobile App Development', 'Android', 'iOS', 'UI/UX'],
    category: 'hackathon',
    pdf: 'certificates/Screenshot 2026-07-16 022157.png',
    logo: 'images/certifications/generic-cert.svg',
    verifyUrl: ''
  }
];

const CERT_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'professional', label: 'Professional Certifications' },
  { id: 'simulation', label: 'Job Simulations' },
  { id: 'internship', label: 'Internships' },
  { id: 'hackathon', label: 'Hackathons' }
];

