
import fs from 'fs';
import path from 'path';
import { getProjectsKnowledgeBase } from './project-knowledge-base';

const postsDirectory = path.join(process.cwd(), 'posts');

function getAllBlogContent(): string {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    let allContent = '\n\n# BLOG POSTS KNOWLEDGE BASE\nThe following are blog posts written by Yasar Tanjim Haque Rafsy. You should use this information to provide deeper, more insightful answers about his experience and thought process.\n';
    
    for (const fileName of fileNames) {
      if (fileName.endsWith('.md')) {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        const parts = fileContents.split('---');
        if (parts.length > 2) {
            const frontMatter = parts[1];
            const content = parts.slice(2).join('---').trim();

            const titleMatch = frontMatter.match(/title:\s*"(.*?)"/);
            const title = titleMatch ? titleMatch[1] : 'Untitled';

            allContent += `
---
## BLOG POST: "${title}"

${content}
---
`;
        }
      }
    }
    return allContent;
  } catch (error) {
    console.error("Error reading blog posts for AI knowledge base:", error);
    return ""; // Return empty string if there's an error so the app doesn't crash
  }
}

const CV = `
# Yasar Tanjim Haque Rafsy - CV

## Personal Details & Contact
- **Full Name:** Yasar Tanjim Haque Rafsy
- **Contact:**
  - **Phone:** +8801775041187 / +8801613362034
  - **Email:** rafsyhaque@gmail.com
  - **WhatsApp / Telegram:** +8801775941187
- **Professional Links:**
  - **Website:** www.Y.H.Rafsy.com (in development)
  - **LinkedIn:** https://www.linkedin.com/in/yasar-tanjim-haque-rafsy/
  - **GitHub:** YRafsy (Yasar Rafsy)
- **Address:** House No 62, Road No 4/A, Dhanmondi, Dhaka 1209
- **Personal Info:** Male, Born 04/02/1999 in Dhaka, Unmarried, Bangladeshi, Islam, Blood Group A+.

## Professional Summary & About Me
- **Title:** AI-Enabled Electrical Engineer & Full-Stack Developer.
- **Summary:** Bridges the gap between hardware and software, leveraging a deep understanding of electrical engineering and artificial intelligence to build innovative, end-to-end solutions.
- **About:** A dedicated and ambitious professional with a BSc in Electrical & Electronics Engineering (Major: Electronics, Minor: Computer Science) from the University of Liberal Arts Bangladesh. Possesses excellent communication skills, learns rapidly, and excels in professional environments. Proficient in a variety of languages and technologies, with hands-on experience in Full-Stack Web Development, Deep Learning, and Embedded Systems. Passionate about solving technical problems and continuous learning.

## Professional Experience

### Technical Assistant – Academic Research (April 2025 – June 2025)
- **Mentor:** Dr. Akhand Akhter Hossain, Economist, Professor, UIU.
- Developed a personal academic website for Dr. Hossain.
- Assisted in producing educational video materials and authored a career achievement report.

### Intern Engineer – RSR Fiber Co. (Feb 2025 – March 2025)
- Designed and launched the company’s official website.
- Wrote a detailed report on transforming waste fiber into yarn and created promotional videos.

### Strategic Manager – FishYou (Tech Startup) (Jan 2024 – July 2024)
- Led strategies boosting user engagement by 25%.
- Conducted behavior-based analytics to optimize conversion funnels.
- Supervised backend development and website content optimization.

### Sub-Executive – IEEE ULAB Student Chapter (April 2023 – Oct 2023)
- Organized hackathons, robotics competitions, and AI/IoT workshops.
- Mentored students in embedded systems, control technologies, and programming.

## Technical Skills

### Programming Languages
- **Python (Advanced):** Web development, data analysis, AI.
- **JavaScript (Intermediate):** Dynamic and interactive web applications.
- **Others:** HTML5, CSS3, PHP, MySQL, C, C++, Verilog, Java (OOP).

### Web Development
- **Full-Stack:** Client-side (frontend) and server-side (backend) development.
- **Technologies:** Responsive Design, RESTful APIs, AJAX, JSON.

### Frameworks & Libraries
- **Backend:** Node.js, Express.js
- **Frontend:** React, currently exploring Next.js.

### Tools & Technologies
- **Version Control:** Git, GitHub.
- **Engineering Software:** MATLAB, Simulink, AutoCAD, Proteus, TinkerCAD.
- **Cloud/Collaboration:** Google Colab.

### Data Science & Machine Learning
- **Data Manipulation:** Pandas, NumPy.
- **Visualization:** Matplotlib.
- **ML/DL Frameworks:** Scikit-learn, TensorFlow, Keras, PyTorch.

## Notable Projects

- **AI-Integrated Industrial Management System:** Optimized industrial processes with AI, enhancing efficiency with real-time analytics. (Tech: Python, TensorFlow, Scikit-learn, Flask).
- **E-Commerce Website:** Achieved a 30% increase in sales with a user-friendly platform featuring secure authentication and payments.
- **Smart Home Automation for Farming:** Cloud-based IoT platform for real-time monitoring and control of agricultural operations. (Tech: Python, Flask, HTML, CSS, JS, MySQL).
- **Image Classification Model:** Achieved 95% accuracy using TensorFlow and Keras.
- **AI-Powered Weather Forecasting:** Precise weather prediction system using AI algorithms.

## Education
- **BSc in Electrical & Electronics Engineering** (2019–2024)
  - University of Liberal Arts Bangladesh (ULAB)
  - CGPA: 3.03
- **Higher Secondary Certificate (HSC)** (2018)
  - Cambrian College
- **Secondary School Certificate (SSC)** (2015)
  - UI School

## Publications
- **IEEE Publication:** "Design of a PID Controller-Based Permanent Magnet DC Motor Driven Conveyor Belt System."
- **Journal Submission (Under Review):** "Localized Low-Cost Automatic Weather Forecasting Devices using TinyML & Edge Computing."

## Career Vision
To actively participate in the Fourth Industrial Revolution by blending hardware and software to solve pressing societal problems. Key focus areas include AI-enabled Electrical Engineering and multidisciplinary, full-stack engineering.

## Languages
- **Speaking:** Bengali (Native), English (Intermediate), Hindi (Conversational), Japanese (Beginner).
- **Writing:** Bengali (Native), English (Intermediate), Japanese (Beginner).

## Awards
- Best Capstone Project Award, EEE Department, ULAB (2024).
- Best Project Award, EEE Project Showcase, ULAB (2024).
`;

const BLOG_CONTENT = getAllBlogContent();
const PROJECTS_CONTENT = getProjectsKnowledgeBase();

export const KNOWLEDGE_BASE = CV + BLOG_CONTENT + PROJECTS_CONTENT;
