import { Brain, Database, FileText, Layers, LineChart, Network, Terminal, Code2, Bot, Sparkles, Cpu, Workflow } from 'lucide-react';

export const PERSONAL_INFO = {
  name: "Divy Yadav",
  title: "Data Science & AI Enthusiast",
  headline: "Hey, I'm Divy.",
  subHeadline: "I build data science, GenAI, and agentic AI systems.",
  avatarUrl: "/profile.jpg", // Make sure to save your photo as public/profile.jpg
  email: "hello@divyyadav.com",
  socials: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    medium: "https://medium.com"
  }
};

export const NAVIGATION_LINKS = [
  { name: "Projects", href: "#projects" },
  { name: "Stack", href: "#skills" },
  { name: "Certificates", href: "#certificates" },
  { name: "Experience", href: "#resume" },
  { name: "Writing", href: "#blogs" },
];

export const SKILL_CATEGORIES = [
  { 
    id: 'ml',
    name: "Machine Learning", 
    icon: Brain, 
    description: "Predictive Modeling & Algorithms",
    techStack: ["Scikit-learn", "XGBoost", "CatBoost", "RandomForest", "Linear Regression", "K-Means", "Decision Trees", "SVM"]
  },
  { 
    id: 'dl',
    name: "Deep Learning", 
    icon: Layers, 
    description: "Neural Networks & Architectures",
    techStack: ["PyTorch", "TensorFlow", "Keras", "CNNs", "RNNs/LSTMs", "Transformers", "CUDA", "FastAI"]
  },
  { 
    id: 'nlp',
    name: "NLP", 
    icon: FileText, 
    description: "Text Analysis & Language Understanding",
    techStack: ["HuggingFace", "SpaCy", "NLTK", "BERT", "GPT Architecture", "Word2Vec", "Text Generation", "Sentiment Analysis"]
  },
  { 
    id: 'agentic',
    name: "Agentic AI", 
    icon: Bot, 
    description: "Autonomous Agents & Orchestration",
    techStack: ["LangChain", "LangGraph", "AutoGen", "CrewAI", "BabyAGI", "Prompt Engineering", "Tool Usage", "Memory Systems"]
  },
  { 
    id: 'genai',
    name: "Generative AI", 
    icon: Sparkles, 
    description: "Creation of Content & Code",
    techStack: ["OpenAI API", "LlamaIndex", "Stable Diffusion", "Midjourney", "RAG Pipelines", "Vector Databases", "Prompt Tuning", "Fine-tuning"]
  },
  { 
    id: 'analytics',
    name: "Data Analytics", 
    icon: LineChart, 
    description: "Insights, Visualization & Storage",
    techStack: ["Pandas", "NumPy", "SQL", "PowerBI", "Tableau", "Matplotlib", "Seaborn", "Excel/Sheets"]
  },
];

export const PROJECTS = [
  {
    id: 1,
    title: "NeuroArt Gen",
    description: "A generative adversarial network (GAN) that creates abstract art from sound wave patterns.",
    tags: ["PyTorch", "Librosa", "GANs"],
    image: "https://picsum.photos/600/400?random=10",
    liveLink: "#",
    githubLink: "#"
  },
  {
    id: 2,
    title: "DocuQuery RAG",
    description: "Retrieval-Augmented Generation pipeline allowing users to chat with their PDF documents locally.",
    tags: ["LangChain", "OpenAI API", "Pinecone"],
    image: "https://picsum.photos/600/400?random=11",
    liveLink: "#",
    githubLink: "#"
  },
  {
    id: 3,
    title: "Market Prophet",
    description: "Time-series forecasting model for predicting stock trends using LSTM neural networks.",
    tags: ["TensorFlow", "Pandas", "Scikit-learn"],
    image: "https://picsum.photos/600/400?random=12",
    liveLink: "#",
    githubLink: "#"
  },
  {
    id: 4,
    title: "Vision Sentry",
    description: "Real-time object detection system optimized for edge devices using quantized models.",
    tags: ["YOLOv8", "OpenCV", "EdgeAI"],
    image: "https://picsum.photos/600/400?random=13",
    liveLink: "#",
    githubLink: "#"
  }
];

export const CERTIFICATES = [
  {
    id: 1,
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    date: "2023",
    image: "https://picsum.photos/600/400?random=20",
    link: "#"
  },
  {
    id: 2,
    title: "Deep Learning Specialization",
    issuer: "Coursera / DeepLearning.AI",
    date: "2022",
    image: "https://picsum.photos/600/400?random=21",
    link: "#"
  },
  {
    id: 3,
    title: "AWS Certified Machine Learning",
    issuer: "Amazon Web Services",
    date: "2021",
    image: "https://picsum.photos/600/400?random=22",
    link: "#"
  }
];

export const BLOGS = [
  {
    id: 1,
    title: "Demystifying Transformers: Attention is All You Need",
    date: "Nov 15, 2023",
    link: "#"
  },
  {
    id: 2,
    title: "Why Your RAG Pipeline is Hallucinating (and how to fix it)",
    date: "Oct 02, 2023",
    link: "#"
  },
  {
    id: 3,
    title: "The Mathematical Beauty of Gradient Descent",
    date: "Sep 10, 2023",
    link: "#"
  }
];

export const RESUME_ENTRIES = [
  {
    id: 1,
    type: "work",
    title: "Senior AI Engineer",
    company: "Neural Nexus Solutions",
    period: "2022 - Present",
    description: "Leading a team of 5 in developing enterprise-grade LLM applications. Architected a multi-agent system for automated code review that reduced bug rates by 40%.",
    tags: ["System Architecture", "Team Leadership", "LLMOps"]
  },
  {
    id: 2,
    type: "work",
    title: "Data Scientist",
    company: "FinTech Innovations",
    period: "2020 - 2022",
    description: "Built predictive models for credit risk assessment using XGBoost and CatBoost. Deployed models to AWS SageMaker serving 1M+ requests daily.",
    tags: ["Predictive Modeling", "AWS", "Python"]
  },
  {
    id: 3,
    type: "education",
    title: "M.S. in Computer Science (AI Specialization)",
    company: "Tech University",
    period: "2018 - 2020",
    description: "Thesis: 'Optimizing Transformer Attention Mechanisms for Low-Resource Languages'. Graduated with Distinction.",
    tags: ["Research", "Deep Learning", "Mathematics"]
  }
];