/**
 * Seed script - Populates MongoDB with demo job data for UI development
 * Run: node seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Job from './models/Job.js';

const demoJobs = [
  { jobId: 'glassdoor-google-senior-react-dev', title: 'Senior React Developer', company: 'Google', location: 'Bangalore, India', salary: '₹25-45 LPA', jobType: 'Full-time', platform: 'Glassdoor', jdText: 'We are looking for a Senior React Developer with 5+ years of experience in React.js, TypeScript, Redux, and Node.js. Experience with GraphQL, CI/CD pipelines, and cloud services (AWS/GCP) is a plus. You will lead frontend architecture decisions and mentor junior developers.', applyUrl: 'https://glassdoor.com/job/1', companyLogo: '', postedDate: '2 days ago', matchScore: 92, matchedSkills: ['React', 'TypeScript', 'Redux', 'Node.js', 'GraphQL'], missingSkills: ['GCP'], status: 'Pending Approval', aiSummary: 'Excellent match! Your React and TypeScript expertise align perfectly with this role.' },
  { jobId: 'linkedin-microsoft-fullstack-eng', title: 'Full Stack Engineer', company: 'Microsoft', location: 'Hyderabad, India', salary: '₹30-50 LPA', jobType: 'Hybrid', platform: 'LinkedIn', jdText: 'Join Microsofts Azure team as a Full Stack Engineer. Required: React, C#, .NET, Azure, SQL Server, Docker, Kubernetes. Build scalable cloud applications serving millions of users.', applyUrl: 'https://linkedin.com/jobs/2', companyLogo: '', postedDate: '1 day ago', matchScore: 74, matchedSkills: ['React', 'Docker', 'Kubernetes', 'SQL'], missingSkills: ['C#', '.NET', 'Azure'], status: 'New', aiSummary: 'Good match. You have strong frontend skills but need .NET and Azure experience.' },
  { jobId: 'naukri-zoho-frontend-dev', title: 'Frontend Developer', company: 'Zoho', location: 'Chennai, India', salary: '₹8-15 LPA', jobType: 'Full-time', platform: 'Naukri', jdText: 'Looking for a Frontend Developer proficient in JavaScript, React.js, HTML5, CSS3, and responsive design. Experience with Tailwind CSS and REST APIs preferred. 2+ years experience required.', applyUrl: 'https://naukri.com/job/3', companyLogo: '', postedDate: '3 days ago', matchScore: 88, matchedSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Tailwind', 'REST'], missingSkills: [], status: 'Approved', aiSummary: 'Excellent match! All required skills are present in your profile.' },
  { jobId: 'unstop-tcs-sde1', title: 'Software Development Engineer I', company: 'TCS', location: 'Coimbatore, India', salary: '₹6-10 LPA', jobType: 'Full-time', platform: 'Unstop', jdText: 'TCS is hiring SDE-1 with skills in Java, Spring Boot, MySQL, and REST APIs. Freshers with strong DSA skills are welcome. Knowledge of Microservices architecture is a bonus.', applyUrl: 'https://unstop.com/job/4', companyLogo: '', postedDate: '5 days ago', matchScore: 45, matchedSkills: ['REST', 'MySQL'], missingSkills: ['Java', 'Spring Boot', 'Microservices'], status: 'New', aiSummary: 'Partial match. This is a Java-focused role. Consider it for skill diversification.' },
  { jobId: 'glassdoor-amazon-sde2', title: 'SDE II - Frontend', company: 'Amazon', location: 'Bangalore, India', salary: '₹35-55 LPA', jobType: 'Full-time', platform: 'Glassdoor', jdText: 'Amazon is looking for SDE II Frontend engineers with deep expertise in React, TypeScript, System Design, and AWS. Must have experience with large-scale applications, performance optimization, and A/B testing frameworks.', applyUrl: 'https://glassdoor.com/job/5', companyLogo: '', postedDate: '1 day ago', matchScore: 81, matchedSkills: ['React', 'TypeScript', 'AWS', 'System Design'], missingSkills: ['A/B Testing'], status: 'Pending Approval', aiSummary: 'Strong match! Emphasize your system design and performance optimization experience.' },
  { jobId: 'linkedin-flipkart-react-native', title: 'React Native Developer', company: 'Flipkart', location: 'Bangalore, India', salary: '₹20-35 LPA', jobType: 'Hybrid', platform: 'LinkedIn', jdText: 'Build the next-gen Flipkart mobile experience. Required: React Native, JavaScript, Redux, REST APIs, Firebase. Experience with native Android/iOS development is a plus.', applyUrl: 'https://linkedin.com/jobs/6', companyLogo: '', postedDate: '4 days ago', matchScore: 68, matchedSkills: ['JavaScript', 'Redux', 'REST', 'Firebase', 'React Native'], missingSkills: ['Native Android', 'Native iOS'], status: 'Applied', appliedAt: new Date('2026-03-07'), applicationMethod: 'Auto-Apply', aiSummary: 'Good match for mobile development role.' },
  { jobId: 'naukri-infosys-python-dev', title: 'Python Developer', company: 'Infosys', location: 'Pune, India', salary: '₹10-18 LPA', jobType: 'Remote', platform: 'Naukri', jdText: 'Python Developer with experience in Django, Flask, PostgreSQL, Redis, Docker. Experience with Machine Learning frameworks (TensorFlow/PyTorch) is appreciated.', applyUrl: 'https://naukri.com/job/7', companyLogo: '', postedDate: '2 days ago', matchScore: 55, matchedSkills: ['Python', 'Docker', 'PostgreSQL', 'Redis'], missingSkills: ['Django', 'Flask', 'TensorFlow'], status: 'New', aiSummary: 'Moderate match. Python skills present but need backend framework experience.' },
  { jobId: 'glassdoor-stripe-frontend', title: 'Frontend Engineer', company: 'Stripe', location: 'Remote', salary: '$120-180K', jobType: 'Remote', platform: 'Glassdoor', jdText: 'Build beautiful payment UIs. Stack: React, TypeScript, GraphQL, CSS-in-JS, Storybook. Focus on accessibility, performance and design systems.', applyUrl: 'https://glassdoor.com/job/8', companyLogo: '', postedDate: '6 hours ago', matchScore: 85, matchedSkills: ['React', 'TypeScript', 'GraphQL', 'CSS'], missingSkills: ['Storybook', 'CSS-in-JS'], status: 'Bookmarked', aiSummary: 'Excellent opportunity! Your frontend expertise is a great fit.' },
  { jobId: 'linkedin-uber-backend', title: 'Backend Engineer - Go', company: 'Uber', location: 'Hyderabad, India', salary: '₹30-50 LPA', jobType: 'Hybrid', platform: 'LinkedIn', jdText: 'Backend engineer needed with Go, gRPC, Kafka, PostgreSQL, Kubernetes expertise. Must handle high-throughput distributed systems.', applyUrl: 'https://linkedin.com/jobs/9', companyLogo: '', postedDate: '3 days ago', matchScore: 35, matchedSkills: ['PostgreSQL', 'Kubernetes'], missingSkills: ['Go', 'gRPC', 'Kafka'], status: 'Rejected', aiSummary: 'Low match - this is a Go-heavy backend role. Consider for future skill development.' },
  { jobId: 'unstop-freshworks-intern', title: 'Software Engineering Intern', company: 'Freshworks', location: 'Chennai, India', salary: '₹25K/month', jobType: 'Internship', platform: 'Unstop', jdText: 'Internship for students/freshers. Learn React, Node.js, MongoDB in a real product team. Must know HTML, CSS, JavaScript basics and Git.', applyUrl: 'https://unstop.com/job/10', companyLogo: '', postedDate: '1 week ago', matchScore: 95, matchedSkills: ['React', 'Node.js', 'MongoDB', 'HTML', 'CSS', 'JavaScript', 'Git'], missingSkills: [], status: 'Applied', appliedAt: new Date('2026-03-08'), applicationMethod: 'One-Click', aiSummary: 'Perfect match! All skills covered. Great opportunity.' },
  { jobId: 'glassdoor-atlassian-senior-fe', title: 'Senior Frontend Developer', company: 'Atlassian', location: 'Bangalore, India', salary: '₹40-60 LPA', jobType: 'Hybrid', platform: 'Glassdoor', jdText: 'Senior Frontend Developer for Jira/Confluence. React, TypeScript, GraphQL, Webpack, Jest, Cypress, Performance optimization, Design Systems.', applyUrl: 'https://glassdoor.com/job/11', companyLogo: '', postedDate: '12 hours ago', matchScore: 78, matchedSkills: ['React', 'TypeScript', 'GraphQL', 'Webpack', 'Jest', 'Cypress'], missingSkills: ['Design Systems'], status: 'Pending Approval', aiSummary: 'Strong match. Highlight your testing and build tool expertise.' },
  { jobId: 'naukri-wipro-mern-stack', title: 'MERN Stack Developer', company: 'Wipro', location: 'Coimbatore, India', salary: '₹7-14 LPA', jobType: 'Full-time', platform: 'Naukri', jdText: 'MERN Stack Developer needed. MongoDB, Express.js, React.js, Node.js. Also need Git, REST APIs, Agile methodology.', applyUrl: 'https://naukri.com/job/12', companyLogo: '', postedDate: '4 days ago', matchScore: 90, matchedSkills: ['MongoDB', 'Express', 'React', 'Node.js', 'Git', 'REST', 'Agile'], missingSkills: [], status: 'Applying', aiSummary: 'Perfect MERN match. Auto-applying now...' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobify');
    console.log('Connected to MongoDB');

    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    await Job.insertMany(demoJobs);
    console.log(`✅ Seeded ${demoJobs.length} demo jobs`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
