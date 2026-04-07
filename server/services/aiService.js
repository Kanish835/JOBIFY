/**
 * ═══════════════════════════════════════════════════════════
 *  AI SERVICE - Resume Analysis & Tailoring
 *  Uses OpenAI/Gemini API for JD matching and resume rewriting
 * ═══════════════════════════════════════════════════════════
 */
import Job from '../models/Job.js';

/**
 * Analyze a job description against a master resume
 * Returns match score and tailored resume data
 */
export async function analyzeJobMatch(job, masterResume) {
  try {
    // Extract skills from both JD and resume
    const jdSkills = extractSkillsFromText(job.jdText);
    const resumeSkills = masterResume?.skills?.flatMap(s => s.items) || [];

    // Calculate match score
    const matched = resumeSkills.filter(skill =>
      jdSkills.some(jdSkill => jdSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(jdSkill.toLowerCase()))
    );

    const missing = jdSkills.filter(jdSkill =>
      !resumeSkills.some(skill => jdSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(jdSkill.toLowerCase()))
    );

    const matchScore = jdSkills.length > 0
      ? Math.round((matched.length / jdSkills.length) * 100)
      : 50;

    // Generate AI summary (placeholder — connect to OpenAI/Gemini for production)
    const aiSummary = generateAISummary(job, matched, missing, matchScore);

    return {
      matchScore: Math.min(matchScore, 100),
      matchedSkills: matched,
      missingSkills: missing.slice(0, 10),
      aiSummary,
    };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return { matchScore: 0, matchedSkills: [], missingSkills: [], aiSummary: '' };
  }
}

/**
 * Extract skills/keywords from JD text using pattern matching
 */
function extractSkillsFromText(text) {
  if (!text) return [];

  const knownSkills = [
    'JavaScript', 'TypeScript', 'React', 'React.js', 'Angular', 'Vue.js', 'Vue', 'Next.js',
    'Node.js', 'Express', 'Express.js', 'Python', 'Django', 'Flask', 'FastAPI',
    'Java', 'Spring Boot', 'Spring', 'C++', 'C#', '.NET', 'Go', 'Golang', 'Rust',
    'HTML', 'CSS', 'SCSS', 'Sass', 'Tailwind', 'Bootstrap', 'Material UI',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Firebase', 'DynamoDB', 'Cassandra',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform',
    'Git', 'GitHub', 'GitLab', 'REST', 'GraphQL', 'gRPC', 'WebSocket',
    'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch',
    'Figma', 'Adobe XD', 'UI/UX', 'Agile', 'Scrum', 'Jira',
    'Linux', 'Nginx', 'Apache', 'Microservices', 'Serverless',
    'Redux', 'Zustand', 'MobX', 'Webpack', 'Vite', 'Babel',
    'Jest', 'Cypress', 'Selenium', 'Playwright', 'Mocha',
    'SQL', 'NoSQL', 'ORM', 'Prisma', 'Sequelize', 'Mongoose',
    'Socket.io', 'RabbitMQ', 'Kafka', 'ElasticSearch',
    'OAuth', 'JWT', 'Authentication', 'Authorization',
    'Data Structures', 'Algorithms', 'System Design', 'OOP',
    'Power BI', 'Tableau', 'Excel', 'Data Analysis',
    'Pandas', 'NumPy', 'Scikit-learn', 'OpenCV',
    'Swift', 'Kotlin', 'Flutter', 'React Native', 'Dart',
  ];

  const lowerText = text.toLowerCase();
  return knownSkills.filter(skill => lowerText.includes(skill.toLowerCase()));
}

function generateAISummary(job, matched, missing, score) {
  if (score >= 80) {
    return `Excellent match! Your profile aligns strongly with this ${job.title} role at ${job.company}. You have ${matched.length} matching skills. Consider highlighting: ${matched.slice(0, 5).join(', ')}.`;
  } else if (score >= 50) {
    return `Good potential match for ${job.title} at ${job.company}. You match ${matched.length} required skills. To improve, consider learning: ${missing.slice(0, 3).join(', ')}.`;
  } else {
    return `Partial match for ${job.title} at ${job.company}. Key gaps: ${missing.slice(0, 5).join(', ')}. This could be a stretch role for skill development.`;
  }
}

/**
 * Batch analyze all "New" jobs
 */
export async function analyzeNewJobs(masterResume) {
  const newJobs = await Job.find({ status: 'New' });
  let analyzed = 0;

  for (const job of newJobs) {
    const analysis = await analyzeJobMatch(job, masterResume);
    await Job.findByIdAndUpdate(job._id, {
      ...analysis,
      status: 'Pending Approval',
    });
    analyzed++;
  }

  return analyzed;
}
