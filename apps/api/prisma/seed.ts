import { PrismaClient, JobType, WorkMode } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * V1 ships with dummy job listings (CLAUDE.md's own roadmap: "Dummy Jobs") —
 * there's no live job-board integration until V4 ("Job APIs"). Re-running
 * this is safe: it clears and re-seeds the `jobs` table only.
 */
const JOBS: Array<{
  title: string;
  company: string;
  location: string;
  description: string;
  type: JobType;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  externalUrl: string;
  skills: string[];
}> = [
  {
    title: 'Frontend Engineer',
    company: 'Nimbus Cloud',
    location: 'Bengaluru, India',
    description:
      'Build and maintain customer-facing dashboards used by thousands of teams daily. You will work closely with design and product to ship polished, accessible UI in a modern React + TypeScript codebase.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    salaryMin: 1800000,
    salaryMax: 2800000,
    externalUrl: 'https://example.com/careers/nimbus-cloud/frontend-engineer',
    skills: ['React', 'TypeScript', 'GraphQL', 'CSS'],
  },
  {
    title: 'Backend Developer',
    company: 'Northgate Labs',
    location: 'Pune, India',
    description:
      'Design and scale the services behind our payments platform. Strong ownership of API design, database schema evolution, and production reliability.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    salaryMin: 2000000,
    salaryMax: 3200000,
    externalUrl: 'https://example.com/careers/northgate-labs/backend-developer',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    title: 'Full Stack Developer',
    company: 'Vertex Analytics',
    location: 'Hyderabad, India',
    description:
      'Own features end to end across a NestJS API and a Next.js frontend. Small team, high autonomy, fast shipping cadence.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.ONSITE,
    salaryMin: 1600000,
    salaryMax: 2600000,
    externalUrl: 'https://example.com/careers/vertex-analytics/full-stack-developer',
    skills: ['React', 'NestJS', 'PostgreSQL', 'GraphQL'],
  },
  {
    title: 'DevOps Engineer',
    company: 'Skyline Systems',
    location: 'Remote',
    description:
      'Own CI/CD pipelines, container orchestration, and infrastructure-as-code across AWS. You will partner with every engineering team to make shipping safer and faster.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    salaryMin: 2200000,
    salaryMax: 3500000,
    externalUrl: 'https://example.com/careers/skyline-systems/devops-engineer',
    skills: ['AWS', 'Terraform', 'Docker', 'Kubernetes'],
  },
  {
    title: 'Software Engineer',
    company: 'Bluepeak Technologies',
    location: 'Gurugram, India',
    description:
      'Work across our core platform team building the primitives other product teams build on top of. Strong CS fundamentals and a bias for simple solutions.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    salaryMin: 1500000,
    salaryMax: 2400000,
    externalUrl: 'https://example.com/careers/bluepeak/software-engineer',
    skills: ['Java', 'Spring Boot', 'PostgreSQL'],
  },
  {
    title: 'Mobile Developer (React Native)',
    company: 'Orbit Health',
    location: 'Remote',
    description:
      'Ship features across iOS and Android from a single React Native codebase for our patient-facing health app used by 500K+ people.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    salaryMin: 1700000,
    salaryMax: 2700000,
    externalUrl: 'https://example.com/careers/orbit-health/mobile-developer',
    skills: ['React Native', 'TypeScript', 'GraphQL'],
  },
  {
    title: 'Data Engineer',
    company: 'Vertex Analytics',
    location: 'Hyderabad, India',
    description:
      'Build and operate the data pipelines feeding our analytics products — batch and streaming, at real scale, with a strong focus on data quality.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.ONSITE,
    salaryMin: 1900000,
    salaryMax: 3000000,
    externalUrl: 'https://example.com/careers/vertex-analytics/data-engineer',
    skills: ['Python', 'Spark', 'AWS', 'SQL'],
  },
  {
    title: 'Product Designer',
    company: 'Nimbus Cloud',
    location: 'Bengaluru, India',
    description:
      'Partner with engineering and product to design the next generation of our dashboard experience. Portfolio of shipped, polished B2B SaaS product work expected.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    salaryMin: 1500000,
    salaryMax: 2500000,
    externalUrl: 'https://example.com/careers/nimbus-cloud/product-designer',
    skills: ['Figma', 'Design Systems', 'Prototyping'],
  },
  {
    title: 'QA Engineer',
    company: 'Northgate Labs',
    location: 'Pune, India',
    description:
      'Build out our automated test suite and lead quality practices across the engineering org as we scale from 20 to 80 engineers.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.ONSITE,
    salaryMin: 1200000,
    salaryMax: 2000000,
    externalUrl: 'https://example.com/careers/northgate-labs/qa-engineer',
    skills: ['Playwright', 'Cypress', 'CI/CD'],
  },
  {
    title: 'Engineering Manager',
    company: 'Skyline Systems',
    location: 'Remote',
    description:
      'Lead a team of 6-8 backend engineers. Equal parts technical judgment and people leadership — you will still review designs and unblock hard problems.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    salaryMin: 3200000,
    salaryMax: 4500000,
    externalUrl: 'https://example.com/careers/skyline-systems/engineering-manager',
    skills: ['Leadership', 'System Design', 'Node.js'],
  },
  {
    title: 'Frontend Developer Intern',
    company: 'Bluepeak Technologies',
    location: 'Gurugram, India',
    description:
      'Six-month internship building real, shipped features alongside a senior mentor. Strong fundamentals in JavaScript and a portfolio of personal projects preferred.',
    type: JobType.INTERNSHIP,
    workMode: WorkMode.ONSITE,
    salaryMin: 300000,
    salaryMax: 480000,
    externalUrl: 'https://example.com/careers/bluepeak/frontend-intern',
    skills: ['JavaScript', 'React', 'HTML/CSS'],
  },
  {
    title: 'Backend Developer (Contract)',
    company: 'Orbit Health',
    location: 'Remote',
    description:
      '6-month contract to help rebuild our appointments service on a more scalable architecture. Healthcare domain experience is a plus, not required.',
    type: JobType.CONTRACT,
    workMode: WorkMode.REMOTE,
    salaryMin: 150000,
    salaryMax: 220000,
    externalUrl: 'https://example.com/careers/orbit-health/backend-contract',
    skills: ['Node.js', 'PostgreSQL', 'REST'],
  },
  {
    title: 'UI/UX Designer',
    company: 'Vertex Analytics',
    location: 'Hyderabad, India',
    description:
      'Shape how complex data becomes clear, usable dashboards. You will own the full design process from research through to shipped, polished UI.',
    type: JobType.PART_TIME,
    workMode: WorkMode.HYBRID,
    salaryMin: 900000,
    salaryMax: 1500000,
    externalUrl: 'https://example.com/careers/vertex-analytics/ui-ux-designer',
    skills: ['Figma', 'User Research', 'Design Systems'],
  },
  {
    title: 'Site Reliability Engineer',
    company: 'Nimbus Cloud',
    location: 'Remote',
    description:
      'Keep a platform serving millions of requests per day fast and reliable. On-call rotation, deep observability work, and real ownership over uptime.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    salaryMin: 2400000,
    salaryMax: 3800000,
    externalUrl: 'https://example.com/careers/nimbus-cloud/sre',
    skills: ['Kubernetes', 'AWS', 'Observability', 'Go'],
  },
  {
    title: 'Software Engineer, New Grad',
    company: 'Northgate Labs',
    location: 'Pune, India',
    description:
      'Our new-grad program pairs you with a mentor and rotates you across two teams in your first year. Strong fundamentals, eagerness to learn.',
    type: JobType.FULL_TIME,
    workMode: WorkMode.ONSITE,
    salaryMin: 1000000,
    salaryMax: 1600000,
    externalUrl: 'https://example.com/careers/northgate-labs/new-grad',
    skills: ['Java', 'Python', 'SQL'],
  },
];

async function main() {
  await prisma.job.deleteMany();
  await prisma.job.createMany({ data: JOBS });
  // eslint-disable-next-line no-console
  console.log(`Seeded ${JOBS.length} jobs.`);
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
