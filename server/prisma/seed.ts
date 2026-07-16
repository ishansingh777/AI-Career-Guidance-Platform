import { PrismaClient } from "@prisma/client";
import type { CareerSeed } from "../src/types/prismaSeed.js";

// Avoid requiring @types/node just for seeds.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: { exit: (code?: number) => void };

const prisma = new PrismaClient();

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function course(
  title: string,
  provider: string,
  duration: string,
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
) {
  return { title, provider, duration, difficulty };
}

function article(title: string, provider: string, tags: string[]) {
  return { title, provider, tags };
}

function roadmap3(overview: string, p1: string, p2: string, p3: string) {
  return {
    overview,
    phases: [
      { title: "Phase 1", items: [{ title: p1, description: "Build fundamentals", durationMin: 240 }] },
      { title: "Phase 2", items: [{ title: p2, description: "Deepen and apply", durationMin: 300 }] },
      { title: "Phase 3", items: [{ title: p3, description: "Ship and iterate", durationMin: 240 }] },
    ],
  };
}

function buildLearningResources(baseTopic: string) {
  return {
    courses: [course(`${baseTopic} Essentials`, "Coursera", "6-8 weeks", "BEGINNER")],
    articles: [article(`${baseTopic} guide`, "Docs/Industry", ["Guide"])],
  };
}

async function upsertCareer(c: CareerSeed) {
  const data = {
    slug: c.slug,
    title: c.title,
    category: c.category,
    description: c.description,
    dailyWork: c.dailyWork,
    requiredSkills: c.requiredSkills,
    preferredInterests: c.preferredInterests,
    requiredSubjects: c.requiredSubjects,
    personalityTraits: c.personalityTraits,
    salaryIndiaMin: clamp(c.salaryIndiaMin, 0, 10_000_000_000),
    salaryIndiaMax: clamp(c.salaryIndiaMax, 0, 10_000_000_000),
    salaryGlobalMin: c.salaryGlobalMin ?? null,
    salaryGlobalMax: c.salaryGlobalMax ?? null,
    futureDemand: clamp(c.futureDemand, 1, 10),
    automationRisk: clamp(c.automationRisk, 1, 10),
    growthRate: clamp(c.growthRate, -100, 1000),
    roadmap: c.roadmap,
    learningResources: c.learningResources,
    certifications: c.certifications,
    projectIdeas: c.projectIdeas,
    companiesHiring: c.companiesHiring,
    image: c.image ?? null,
    profile: undefined as any,
  };

  await prisma.career.upsert({
    where: { slug: c.slug },
    update: data,
    create: data,
  });
}

function makeCareer(params: Omit<CareerSeed, "slug"> & { title: string }) {
  const slug = slugify(params.title);
  return { slug, ...params } as CareerSeed;
}

async function main() {
  // Existing category names used in this project.
  const C = {
    SE: "Software Engineering",
    AI: "Artificial Intelligence",
    ML: "Machine Learning",
    DS: "Data Science",
    DE: "Data Engineering",
    SEC: "Cybersecurity",
    CLOUD: "Cloud Computing",
    DEVOPS: "DevOps",
    UX: "UI/UX Design",
    PM: "Product Management",
    BA: "Business Analysis",
    FIN: "Finance",
    CONS: "Consulting",
    MKT: "Digital Marketing",
    HEALTH: "Healthcare",
    MECH: "Mechanical Engineering",
    CIVIL: "Civil Engineering",
    ELEC: "Electrical Engineering",
    GOV: "Government Services",
    RESEARCH: "Research",
    SPORTS: "Sports",
    EDU: "Education",
    ENTRE: "Entrepreneurship",
    LAW: "Law",
    CREATIVE: "Creative Careers",
  };

  // Preserve the original distribution: First 15 categories → 4 careers each, Remaining 10 → 3 careers each.
  const categoryOrder = [
    C.SE,
    C.AI,
    C.ML,
    C.DS,
    C.DE,
    C.SEC,
    C.CLOUD,
    C.DEVOPS,
    C.UX,
    C.PM,
    C.BA,
    C.FIN,
    C.CONS,
    C.MKT,
    C.HEALTH,
    C.MECH,
    C.CIVIL,
    C.ELEC,
    C.GOV,
    C.RESEARCH,
    C.SPORTS,
    C.EDU,
    C.ENTRE,
    C.LAW,
    C.CREATIVE,
  ];

  const careers: CareerSeed[] = [];
  const pushCareer = (
    title: string,
    category: string,
    patch: Omit<CareerSeed, "slug" | "title" | "category">
  ) => {
    careers.push(
      makeCareer({
        title,
        category,
        ...patch,
      })
    );
  };

  // -------------------------
  // Software Engineering (4)
  // -------------------------
  pushCareer("Backend Developer", C.SE, {
    description: "Build and maintain server-side applications, REST APIs, and data services with reliability and performance in mind.",
    dailyWork: "Design endpoints, implement business logic, optimize database queries, write unit/integration tests, review PRs, and troubleshoot production incidents.",
    requiredSkills: ["TypeScript/JavaScript", "REST APIs", "SQL", "Testing", "Git", "API design"],
    preferredInterests: ["Building products", "Systems", "Problem solving"],
    requiredSubjects: ["Computer Science", "Databases", "Algorithms"],
    personalityTraits: ["Structured", "Team-oriented", "Pragmatic"],
    salaryIndiaMin: 600000,
    salaryIndiaMax: 2200000,
    salaryGlobalMin: 70000,
    salaryGlobalMax: 170000,
    futureDemand: 9,
    automationRisk: 5,
    growthRate: 18,
    roadmap: roadmap3("From backends to production systems.", "API design", "Testing & CI/CD", "Performance & scaling"),
    learningResources: buildLearningResources("Backend engineering"),
    certifications: ["AWS Certified Developer – Associate"],
    projectIdeas: ["Public API service", "Rate-limited endpoints", "Background worker"],
    companiesHiring: ["Amazon", "Microsoft", "Google"],
    image: "https://example.com/careers/backend-developer.png",
  });

  pushCareer("Frontend Developer", C.SE, {
    description: "Create responsive, accessible, and high-performance user interfaces using modern frontend technologies and best practices.",
    dailyWork: "Implement UI components, optimize rendering/performance, handle state and forms, ensure accessibility (WCAG), write tests, and collaborate with design/PM.",
    requiredSkills: ["React", "TypeScript", "CSS", "Accessibility", "Testing", "Performance"],
    preferredInterests: ["User empathy", "Design polish", "Responsiveness"],
    requiredSubjects: ["Web Development", "Human-Computer Interaction"],
    personalityTraits: ["Detail-focused", "Creative", "Collaborative"],
    salaryIndiaMin: 500000,
    salaryIndiaMax: 1800000,
    salaryGlobalMin: 60000,
    salaryGlobalMax: 140000,
    futureDemand: 8,
    automationRisk: 3,
    growthRate: 16,
    roadmap: roadmap3("From UI basics to production frontends.", "Component patterns", "A11y + testing", "Speed & UX tuning"),
    learningResources: buildLearningResources("Frontend development"),
    certifications: [],
    projectIdeas: ["Accessibility audit", "Analytics dashboard UI", "Performance profiling"],
    companiesHiring: ["Google", "Meta", "Apple"],
    image: "https://example.com/careers/frontend-developer.png",
  });

  pushCareer("Full-Stack Developer", C.SE, {
    description: "Deliver complete product experiences by building frontend, backend, databases, and deployment workflows that work end-to-end.",
    dailyWork: "Implement features across the stack, manage API contracts, create data models, handle auth, write tests, and ship releases with observability.",
    requiredSkills: ["TypeScript", "REST/GraphQL", "SQL", "React", "Testing", "Deployment"],
    preferredInterests: ["Ownership", "Product building", "End-to-end problem solving"],
    requiredSubjects: ["Computer Science", "Databases", "Networking basics"],
    personalityTraits: ["Ownership", "Curious", "Pragmatic"],
    salaryIndiaMin: 650000,
    salaryIndiaMax: 2600000,
    salaryGlobalMin: 75000,
    salaryGlobalMax: 190000,
    futureDemand: 8,
    automationRisk: 4,
    growthRate: 19,
    roadmap: roadmap3("From fundamentals to scalable full-stack delivery.", "System design basics", "APIs + database integration", "CI/CD + observability"),
    learningResources: buildLearningResources("Full-stack engineering"),
    certifications: [],
    projectIdeas: ["Role-based access demo", "SaaS feature module", "End-to-end testing suite"],
    companiesHiring: ["Amazon", "Microsoft", "Google"],
    image: "https://example.com/careers/full-stack-developer.png",
  });

  pushCareer("Mobile App Developer", C.SE, {
    description: "Build cross-platform or native iOS/Android apps, integrating APIs and delivering smooth, reliable user experiences.",
    dailyWork: "Implement screens and background tasks, integrate REST services, monitor crashes/ANRs, optimize performance, and ship updates.",
    requiredSkills: ["Kotlin", "Swift", "Mobile UI", "API integration", "Testing", "Performance"],
    preferredInterests: ["Building products", "UX", "Iteration"],
    requiredSubjects: ["Mobile Computing", "Computer Science"],
    personalityTraits: ["User-focused", "Analytical", "Persistent"],
    salaryIndiaMin: 500000,
    salaryIndiaMax: 1900000,
    salaryGlobalMin: 65000,
    salaryGlobalMax: 160000,
    futureDemand: 8,
    automationRisk: 3,
    growthRate: 17,
    roadmap: roadmap3("From mobile basics to shipped products.", "Core screens & navigation", "Testing & crash analytics", "Release pipeline & monitoring"),
    learningResources: buildLearningResources("Mobile development"),
    certifications: ["Google Associate Android Developer"],
    projectIdeas: ["Offline-first notes app", "Crash-free release dashboard", "Payment integration prototype"],
    companiesHiring: ["Google", "Amazon", "Meta"],
    image: "https://example.com/careers/mobile-app-developer.png",
  });

  // -------------------------
  // Artificial Intelligence (4)
  // -------------------------
  pushCareer("AI Engineer", C.AI, {
    description: "Develop production-ready AI solutions including data pipelines, model training, evaluation, and deployment.",
    dailyWork: "Build ML workflows, evaluate model quality, deploy inference services, monitor drift, and collaborate on product integration.",
    requiredSkills: ["Python", "Machine learning", "Evaluation", "MLOps", "Experiment tracking"],
    preferredInterests: ["AI & ML", "Automation", "Data analysis"],
    requiredSubjects: ["Statistics", "Linear Algebra", "Computer Science"],
    personalityTraits: ["Analytical", "Curious", "Experiment-driven"],
    salaryIndiaMin: 800000,
    salaryIndiaMax: 2600000,
    salaryGlobalMin: 90000,
    salaryGlobalMax: 200000,
    futureDemand: 10,
    automationRisk: 6,
    growthRate: 24,
    roadmap: roadmap3("From learning to production AI.", "ML foundations", "MLOps & deployment", "Evaluation harness & monitoring"),
    learningResources: buildLearningResources("AI engineering"),
    certifications: ["Google Professional ML Engineer"],
    projectIdeas: ["Model training + monitoring", "Drift alerts", "Evaluation dashboard"],
    companiesHiring: ["Google", "Meta", "Amazon"],
    image: "https://example.com/careers/ai-engineer.png",
  });

  pushCareer("Computer Vision Engineer", C.AI, {
    description: "Build and optimize vision models for detection, segmentation, tracking, and perception systems.",
    dailyWork: "Prepare datasets, design training pipelines, evaluate metrics, deploy inference, and debug real-world failures.",
    requiredSkills: ["Python", "OpenCV", "Deep learning", "Model evaluation", "GPU fundamentals"],
    preferredInterests: ["Perception", "Automation", "Experimentation"],
    requiredSubjects: ["Linear Algebra", "Probability", "Computer Vision"],
    personalityTraits: ["Detail-oriented", "Analytical", "Persistent"],
    salaryIndiaMin: 850000,
    salaryIndiaMax: 2800000,
    salaryGlobalMin: 95000,
    salaryGlobalMax: 210000,
    futureDemand: 9,
    automationRisk: 6,
    growthRate: 23,
    roadmap: roadmap3("From datasets to deployed CV.", "Dataset curation", "Training & evaluation", "Production inference"),
    learningResources: buildLearningResources("Computer vision"),
    certifications: [],
    projectIdeas: ["Defect detection pipeline", "Object tracking demo", "Vision model monitoring"],
    companiesHiring: ["Microsoft", "Google", "Amazon"],
    image: "https://example.com/careers/computer-vision-engineer.png",
  });

  pushCareer("NLP Engineer", C.AI, {
    description: "Develop NLP systems including language understanding, extraction, embeddings, and language model applications.",
    dailyWork: "Build NLP pipelines, evaluate outputs, implement retrieval/reranking, and deploy NLP services for production use.",
    requiredSkills: ["Python", "NLP", "Transformers", "Evaluation", "Information retrieval"],
    preferredInterests: ["Language", "Automation", "Data analysis"],
    requiredSubjects: ["Statistics", "Algorithms", "Computer Science"],
    personalityTraits: ["Curious", "Analytical", "Experiment-driven"],
    salaryIndiaMin: 820000,
    salaryIndiaMax: 2700000,
    salaryGlobalMin: 90000,
    salaryGlobalMax: 205000,
    futureDemand: 10,
    automationRisk: 6,
    growthRate: 25,
    roadmap: roadmap3("From prompts to production NLP.", "NLP foundations", "Model evaluation", "RAG and deployment"),
    learningResources: buildLearningResources("NLP"),
    certifications: [],
    projectIdeas: ["RAG prototype", "Text classification service", "Bias and quality evaluation"],
    companiesHiring: ["OpenAI ecosystem", "Google", "Meta"],
    image: "https://example.com/careers/nlp-engineer.png",
  });

  pushCareer("Robotics Software Engineer", C.AI, {
    description: "Build software for robots and autonomous systems, integrating perception, planning, and control components.",
    dailyWork: "Implement middleware modules, integrate sensors, test behaviors in simulation and on hardware, and iterate safely.",
    requiredSkills: ["Python/C++", "Robotics middleware", "Control basics", "Perception", "Testing"],
    preferredInterests: ["Automation", "Experimentation", "Systems"],
    requiredSubjects: ["Control", "Computer Science", "Signals basics"],
    personalityTraits: ["Problem-solver", "Persistent", "Safety-minded"],
    salaryIndiaMin: 780000,
    salaryIndiaMax: 2500000,
    salaryGlobalMin: 85000,
    salaryGlobalMax: 190000,
    futureDemand: 8,
    automationRisk: 7,
    growthRate: 20,
    roadmap: roadmap3("From perception to autonomy.", "Sensor integration", "Perception & tracking", "Robot behavior testing"),
    learningResources: buildLearningResources("Robotics"),
    certifications: [],
    projectIdeas: ["Autonomous navigation sim", "Vision-based tracking", "Robotics monitoring dashboard"],
    companiesHiring: ["Robotics labs", "Tech automation", "Amazon"],
    image: "https://example.com/careers/robotics-software-engineer.png",
  });

  // -------------------------
  // Machine Learning (4)
  // -------------------------
  pushCareer("Machine Learning Engineer", C.ML, {

    description: "Design, train, and optimize ML systems for prediction, ranking, and decision support in production environments.",
    dailyWork: "Train models, validate metrics, run experiments, debug error cases, and improve pipelines for deployment.",
    requiredSkills: ["Python", "Machine learning", "Feature engineering", "Evaluation", "Experiment tracking"],
    preferredInterests: ["Modeling", "Experimentation", "Data"],
    requiredSubjects: ["Probability", "Statistics", "Algorithms"],
    personalityTraits: ["Detail-oriented", "Experiment-driven", "Analytical"],
    salaryIndiaMin: 780000,
    salaryIndiaMax: 2500000,
    salaryGlobalMin: 85000,
    salaryGlobalMax: 190000,
    futureDemand: 10,
    automationRisk: 6,
    growthRate: 23,
    roadmap: roadmap3("From model building to improvement.", "Train & evaluate", "Error analysis", "Inference pipeline"),
    learningResources: buildLearningResources("Machine learning"),
    certifications: [],
    projectIdeas: ["Forecasting system", "Classifier evaluation suite", "Offline evaluation notebook"],
    companiesHiring: ["Amazon", "Google", "Microsoft"],
    image: "https://example.com/careers/ml-engineer.png",
  });

  pushCareer("Recommender Systems Engineer", C.ML, {
    description: "Build recommender systems for ranking, personalization, and experimentation-driven optimization.",
    dailyWork: "Design ranking models, tune losses, evaluate offline/online metrics, and deploy recommendation pipelines.",
    requiredSkills: ["Python", "Ranking", "Collaborative filtering", "Experimentation", "Evaluation"],
    preferredInterests: ["Personalization", "Experimentation", "Optimization"],
    requiredSubjects: ["Algorithms", "Statistics", "Computer Science"],
    personalityTraits: ["Analytical", "Curious", "Iterative"],
    salaryIndiaMin: 820000,
    salaryIndiaMax: 2700000,
    salaryGlobalMin: 90000,
    salaryGlobalMax: 205000,
    futureDemand: 9,
    automationRisk: 6,
    growthRate: 24,
    roadmap: roadmap3("From data to personalized ranking.", "Candidate generation", "Ranking model training", "Offline/online evaluation"),
    learningResources: buildLearningResources("Recommenders"),
    certifications: [],
    projectIdeas: ["Offline recommender evaluation", "Experiment tracking dashboard", "Personalization metrics"],
    companiesHiring: ["Meta", "Amazon", "Netflix"],
    image: "https://example.com/careers/recommender-systems-engineer.png",
  });

  pushCareer("Deep Learning Research Engineer", C.ML, {
    description: "Apply deep learning research techniques to build robust models and improve training stability for production use.",
    dailyWork: "Prototype models, run ablations, improve training, and coordinate with engineering for deployment.",
    requiredSkills: ["Python", "Deep learning", "Training diagnostics", "Evaluation", "ML engineering"],
    preferredInterests: ["Research", "Experimentation", "Optimization"],
    requiredSubjects: ["Linear Algebra", "Probability", "Computer Vision/NLP"],
    personalityTraits: ["Persistent", "Analytical", "Creative"],
    salaryIndiaMin: 900000,
    salaryIndiaMax: 3300000,
    salaryGlobalMin: 110000,
    salaryGlobalMax: 250000,
    futureDemand: 9,
    automationRisk: 7,
    growthRate: 26,
    roadmap: roadmap3("From experiments to reliable deep models.", "Model prototyping", "Training improvements", "Production readiness"),
    learningResources: buildLearningResources("Deep learning"),
    certifications: [],
    projectIdeas: ["Ablation study repo", "Training stability toolkit", "Model evaluation harness"],
    companiesHiring: ["Google", "Meta", "Research labs"],
    image: "https://example.com/careers/deep-learning-research-engineer.png",
  });

  pushCareer("Time Series Forecasting Engineer", C.ML, {
    description: "Build forecasting models for demand prediction, anomaly detection, and operational planning.",
    dailyWork: "Engineer time-series features, validate via backtesting, tune hyperparameters, and deploy forecasting services.",
    requiredSkills: ["Python", "Time series", "Statistics", "Feature engineering", "Backtesting"],
    preferredInterests: ["Patterns", "Optimization", "Prediction"],
    requiredSubjects: ["Statistics", "Algorithms", "Data analysis"],
    personalityTraits: ["Analytical", "Structured", "Detail-focused"],
    salaryIndiaMin: 760000,
    salaryIndiaMax: 2400000,
    salaryGlobalMin: 82000,
    salaryGlobalMax: 180000,
    futureDemand: 8,
    automationRisk: 5,
    growthRate: 20,
    roadmap: roadmap3("From feature engineering to deployment.", "Backtesting setup", "Forecasting models", "Production monitoring"),
    learningResources: buildLearningResources("Time series"),
    certifications: [],
    projectIdeas: ["Demand forecast service", "Anomaly detection prototype", "Forecast evaluation notebook"],
    companiesHiring: ["Retail", "Logistics", "FinTech"],
    image: "https://example.com/careers/time-series-forecasting-engineer.png",
  });

  // -------------------------
  // Data Science (4)
  // -------------------------
  pushCareer("Data Scientist", C.DS, {
    description: "Use statistical modeling and machine learning to uncover insights and inform business decisions.",
    dailyWork: "Perform EDA, design experiments, build models, evaluate results, and communicate findings to stakeholders.",
    requiredSkills: ["Python", "Statistics", "Machine learning", "SQL", "Visualization"],
    preferredInterests: ["Insights", "Experimentation", "Business impact"],
    requiredSubjects: ["Statistics", "Probability", "Data Science"],
    personalityTraits: ["Analytical", "Communicative", "Curious"],
    salaryIndiaMin: 650000,
    salaryIndiaMax: 2200000,
    salaryGlobalMin: 80000,
    salaryGlobalMax: 170000,
    futureDemand: 9,
    automationRisk: 5,
    growthRate: 20,
    roadmap: roadmap3("From analytics to decision science.", "EDA & hypotheses", "Predictive modeling", "Stakeholder communication"),
    learningResources: buildLearningResources("Data science"),
    certifications: [],
    projectIdeas: ["Churn prediction", "Experiment analysis", "Forecasting"],
    companiesHiring: ["Netflix", "Amazon", "Microsoft"],
    image: "https://example.com/careers/data-scientist.png",
  });

  pushCareer("Marketing Data Analyst", C.DS, {
    description: "Analyze marketing performance metrics and improve acquisition and conversion using experiments and reporting.",
    dailyWork: "Build dashboards, analyze funnel metrics, run A/B tests, and produce actionable insights for marketing teams.",
    requiredSkills: ["SQL", "Python", "Attribution basics", "Experimentation", "Visualization"],
    preferredInterests: ["Growth", "Creativity", "Decision support"],
    requiredSubjects: ["Marketing analytics", "Statistics basics", "Economics"],
    personalityTraits: ["Results-driven", "Structured", "Communicative"],
    salaryIndiaMin: 450000,
    salaryIndiaMax: 1600000,
    salaryGlobalMin: 55000,
    salaryGlobalMax: 120000,
    futureDemand: 8,
    automationRisk: 4,
    growthRate: 14,
    roadmap: roadmap3("From dashboards to optimization.", "Funnel metrics & SQL", "Experiment design", "Actionable reporting"),
    learningResources: buildLearningResources("Marketing analytics"),
    certifications: [],
    projectIdeas: ["Attribution comparison", "A/B test analysis", "Campaign ROI dashboard"],
    companiesHiring: ["Meta", "Google", "E-commerce"],
    image: "https://example.com/careers/marketing-data-analyst.png",
  });

  pushCareer("Product Analyst", C.DS, {
    description: "Measure product performance, understand user behavior, and improve outcomes through experiments and metrics.",
    dailyWork: "Define KPIs, analyze cohorts, design experiments, and report measurable impact to product teams.",
    requiredSkills: ["SQL", "Statistics", "Experimentation", "Visualization", "Data modeling"],
    preferredInterests: ["User impact", "Strategy", "Problem solving"],
    requiredSubjects: ["Statistics", "Data analysis", "Product basics"],
    personalityTraits: ["Communicative", "Structured", "Curious"],
    salaryIndiaMin: 500000,
    salaryIndiaMax: 1800000,
    salaryGlobalMin: 60000,
    salaryGlobalMax: 140000,
    futureDemand: 8,
    automationRisk: 4,
    growthRate: 15,
    roadmap: roadmap3("From metrics to product decisions.", "Cohort analysis", "Experiment design", "Decision dashboards"),
    learningResources: buildLearningResources("Product analytics"),
    certifications: [],
    projectIdeas: ["Activation funnel analysis", "Experiment evaluation report", "Metrics glossary & dashboards"],
    companiesHiring: ["SaaS", "Consumer apps", "E-commerce"],
    image: "https://example.com/careers/product-analyst.png",
  });

  pushCareer("Research Data Scientist", C.DS, {
    description: "Apply data science methods to research problems, validating results with rigorous evaluation and reproducible workflows.",
    dailyWork: "Form hypotheses, design experiments, train/validate models as needed, and publish findings.",
    requiredSkills: ["Python", "Statistics", "Experiment design", "Writing", "Data visualization"],
    preferredInterests: ["Discovery", "Experimentation", "Problem solving"],
    requiredSubjects: ["Research methods", "Statistics", "Algorithms"],
    personalityTraits: ["Persistent", "Analytical", "Curious"],
    salaryIndiaMin: 700000,
    salaryIndiaMax: 2800000,
    salaryGlobalMin: 90000,
    salaryGlobalMax: 210000,
    futureDemand: 7,
    automationRisk: 3,
    growthRate: 18,
    roadmap: roadmap3("From hypothesis to validated insights.", "Research design", "Modeling & evaluation", "Writing & publishing"),
    learningResources: buildLearningResources("Research data science"),
    certifications: [],
    projectIdeas: ["Benchmark study", "Reproducible experiments", "Research report draft"],
    companiesHiring: ["Research labs", "Tech R&D"],
    image: "https://example.com/careers/research-data-scientist.png",
  });

  // -------------------------
  // Data Engineering (4)
  // -------------------------
  pushCareer("Data Engineer", C.DE, {

    description: "Build and maintain data pipelines and platforms that power analytics and machine learning workloads.",
    dailyWork: "Design ETL/ELT jobs, manage data quality, optimize pipelines, implement schemas/validation, and maintain documentation.",
    requiredSkills: ["SQL", "Data modeling", "ETL/ELT", "Python", "Orchestration"],
    preferredInterests: ["Pipelines", "Performance", "Automation"],
    requiredSubjects: ["Databases", "Computer Science", "Data systems"],
    personalityTraits: ["Systems thinker", "Reliable", "Detail-oriented"],
    salaryIndiaMin: 700000,
    salaryIndiaMax: 2400000,
    salaryGlobalMin: 85000,
    salaryGlobalMax: 180000,
    futureDemand: 9,
    automationRisk: 5,
    growthRate: 21,
    roadmap: roadmap3("From pipelines to platforms.", "Build ETL jobs", "Data quality & contracts", "Performance & cost optimization"),
    learningResources: buildLearningResources("Data engineering"),
    certifications: [],
    projectIdeas: ["Warehouse-ready datasets", "Data quality checks", "ELT pipeline"],
    companiesHiring: ["Google", "Amazon", "Snowflake"],
    image: "https://example.com/careers/data-engineer.png",
  });

  pushCareer("Data Warehouse Engineer", C.DE, {
    description: "Design and maintain data warehouse architectures for trustworthy reporting and analytics.",
    dailyWork: "Model schemas, optimize queries, manage data freshness, implement lineage/documentation, and improve performance.",
    requiredSkills: ["SQL", "Dimensional modeling", "ETL/ELT", "Performance tuning", "Documentation"],
    preferredInterests: ["Analytics reliability", "Systems", "Optimization"],
    requiredSubjects: ["Databases", "Computer Science"],
    personalityTraits: ["Methodical", "Reliable", "Detail-focused"],
    salaryIndiaMin: 680000,
    salaryIndiaMax: 2400000,
    salaryGlobalMin: 82000,
    salaryGlobalMax: 175000,
    futureDemand: 8,
    automationRisk: 5,
    growthRate: 20,
    roadmap: roadmap3("From modeling to trustworthy warehouses.", "Dimensional modeling", "Quality & freshness", "Cost + performance tuning"),
    learningResources: buildLearningResources("Data warehouse"),
    certifications: [],
    projectIdeas: ["Analytics-ready schema", "Query optimization benchmark", "Data freshness monitoring"],
    companiesHiring: ["Analytics firms", "Tech companies"],
    image: "https://example.com/careers/data-warehouse-engineer.png",
  });

  pushCareer("ETL Developer", C.DE, {
    description: "Develop ETL workflows that transform and move data between systems reliably and efficiently.",
    dailyWork: "Implement transformations, handle scheduling/retries, validate data, and troubleshoot pipeline failures.",
    requiredSkills: ["SQL", "ETL transformations", "Python", "Workflow orchestration", "Testing"],
    preferredInterests: ["Automation", "Data quality", "Problem solving"],
    requiredSubjects: ["Databases", "Computer Science"],
    personalityTraits: ["Patient", "Structured", "Troubleshooting-minded"],
    salaryIndiaMin: 520000,
    salaryIndiaMax: 1800000,
    salaryGlobalMin: 60000,
    salaryGlobalMax: 130000,
    futureDemand: 8,
    automationRisk: 5,
    growthRate: 15,
    roadmap: roadmap3("From ETL basics to robust pipelines.", "Transformations & validation", "Orchestration & retries", "Monitoring & incident response"),
    learningResources: buildLearningResources("ETL"),
    certifications: [],
    projectIdeas: ["ETL for CRM data", "Schema validation pipeline", "Pipeline health dashboard"],
    companiesHiring: ["Enterprises", "Data platforms"],
    image: "https://example.com/careers/etl-developer.png",
  });

  pushCareer("Big Data Engineer", C.DE, {
    description: "Process and transform large-scale datasets using distributed systems and scalable data frameworks.",
    dailyWork: "Implement distributed jobs, optimize throughput, manage partitioning, and ensure operational reliability.",
    requiredSkills: ["Distributed computing", "SQL", "Python", "Data processing frameworks", "Performance"],
    preferredInterests: ["Scale", "Performance", "Automation"],
    requiredSubjects: ["Distributed systems", "Databases", "Algorithms"],
    personalityTraits: ["Analytical", "Systems-minded", "Persistent"],
    salaryIndiaMin: 650000,
    salaryIndiaMax: 2600000,
    salaryGlobalMin: 80000,
    salaryGlobalMax: 190000,
    futureDemand: 8,
    automationRisk: 5,
    growthRate: 21,
    roadmap: roadmap3("From batch pipelines to big data platforms.", "Core batch processing", "Optimization & partitioning", "Operational monitoring"),
    learningResources: buildLearningResources("Big data"),
    certifications: [],
    projectIdeas: ["Large-scale ETL job", "Cost/performance analysis", "Data quality framework"],
    companiesHiring: ["Streaming platforms", "Cloud providers"],
    image: "https://example.com/careers/big-data-engineer.png",
  });

  // ---
  // NOTE:
  // To keep this response size manageable within the tool limits, the remainder of the 90 careers
  // must be added here. This draft currently seeds fewer than 90 careers.
  // ---

  // -------------------------
  // Batch: Careers 21–40 (20)
  // -------------------------
  // Software Engineering (4)
  pushCareer("DevOps Engineer", C.DEVOPS, {
    description: "Design and maintain CI/CD pipelines and infrastructure automation to enable fast, reliable software delivery.",
    dailyWork: "Build CI/CD workflows, manage infrastructure as code, monitor deployments, troubleshoot release issues, and improve reliability practices.",
    requiredSkills: ["CI/CD", "Infrastructure as code", "Linux", "Docker", "Observability", "Scripting"],
    preferredInterests: ["Automation", "Reliability", "Performance"],
    requiredSubjects: ["Operating Systems", "Networking", "Software Engineering"],
    personalityTraits: ["Process-driven", "Troubleshooting", "Calm under pressure"],
    salaryIndiaMin: 750000,
    salaryIndiaMax: 2800000,
    salaryGlobalMin: 90000,
    salaryGlobalMax: 210000,
    futureDemand: 9,
    automationRisk: 7,
    growthRate: 22,
    roadmap: roadmap3("From pipelines to production reliability.", "CI/CD pipelines", "Infrastructure automation", "Production observability"),
    learningResources: buildLearningResources("DevOps engineering"),
    certifications: ["AWS Certified DevOps Engineer – Professional"],
    projectIdeas: ["CI pipeline for a full-stack app", "Terraform IaC for staging", "Kubernetes deployment + monitoring"],
    companiesHiring: ["Amazon", "Microsoft", "Google"],
    image: "https://example.com/careers/devops-engineer.png",
  });

  pushCareer("Site Reliability Engineer (SRE)", C.DEVOPS, {
    description: "Improve system reliability using SLOs, incident response, and automation across services and infrastructure.",
    dailyWork: "Define SLOs/SLIs, automate remediation, conduct postmortems, improve alerting, and drive engineering practices for reliability.",
    requiredSkills: ["SRE practices", "Monitoring/Alerting", "Incident response", "Linux", "Networking", "Automation"],
    preferredInterests: ["Reliability", "Systems", "Continuous improvement"],
    requiredSubjects: ["Distributed Systems", "Networking", "Operating Systems"],
    personalityTraits: ["Analytical", "Ownership", "Persistent"],
    salaryIndiaMin: 850000,
    salaryIndiaMax: 3200000,
    salaryGlobalMin: 110000,
    salaryGlobalMax: 240000,
    futureDemand: 8,
    automationRisk: 6,
    growthRate: 20,
    roadmap: roadmap3("From operational pain to reliability engineering.", "SLO strategy", "Automated runbooks", "Incident management"),
    learningResources: buildLearningResources("SRE"),
    certifications: ["Google Professional Cloud Architect (optional)"],
    projectIdeas: ["SLO dashboard + alert tuning", "Runbook automation with scripts", "Chaos test for failure modes"],
    companiesHiring: ["Google", "Netflix", "Amazon"],
    image: "https://example.com/careers/sre.png",
  });

  pushCareer("Cloud Solutions Architect", C.CLOUD, {
    description: "Architect cloud solutions that balance scalability, security, performance, and cost across environments.",
    dailyWork: "Design reference architectures, define deployment strategies, implement IAM/security best practices, and optimize costs using observability.",
    requiredSkills: ["Cloud architecture", "IAM", "Networking", "Security", "Cost optimization", "Monitoring"],
    preferredInterests: ["Infrastructure", "Reliability", "Scale"],
    requiredSubjects: ["Networking", "Cloud", "Security"],
    personalityTraits: ["Pragmatic", "Systems thinking", "Ownership"],
    salaryIndiaMin: 800000,
    salaryIndiaMax: 3400000,
    salaryGlobalMin: 100000,
    salaryGlobalMax: 250000,
    futureDemand: 9,
    automationRisk: 5,
    growthRate: 21,
    roadmap: roadmap3("From cloud foundations to production architectures.", "Reference architecture design", "IAM & security", "Performance + cost optimization"),
    learningResources: buildLearningResources("Cloud architecture"),
    certifications: ["AWS Solutions Architect – Associate"],
    projectIdeas: ["Serverless app architecture", "Multi-region reference design", "Cost/performance review report"],
    companiesHiring: ["Amazon", "Microsoft", "Google"],
    image: "https://example.com/careers/cloud-solutions-architect.png",
  });

  pushCareer("API Product Engineer (API Developer)", C.SE, {
    description: "Build and iterate API products with strong design, versioning strategy, documentation, and reliability practices.",
    dailyWork: "Design API contracts, implement API gateways, manage versioning, write documentation, and ensure performance and security for consumers.",
    requiredSkills: ["REST/GraphQL", "API design", "Versioning", "Authentication/Authorization", "Testing", "Observability"],
    preferredInterests: ["Building products", "Systems", "Developer experience"],
    requiredSubjects: ["Computer Science", "Networking basics", "Software Engineering"],
    personalityTraits: ["User-focused", "Detail-oriented", "Collaborative"],
    salaryIndiaMin: 700000,
    salaryIndiaMax: 2600000,
    salaryGlobalMin: 90000,
    salaryGlobalMax: 200000,
    futureDemand: 8,
    automationRisk: 4,
    growthRate: 18,
    roadmap: roadmap3("From API design to stable API products.", "API contract & versioning", "Security for APIs", "Performance + documentation quality"),
    learningResources: buildLearningResources("API engineering"),
    certifications: [],
    projectIdeas: ["API gateway + rate limiting demo", "OpenAPI docs automation", "Integration test suite for APIs"],
    companiesHiring: ["Amazon", "Microsoft", "Stripe (examples)"],
    image: "https://example.com/careers/api-engineer.png",
  });

  // Artificial Intelligence & ML (4)
  pushCareer("AI Research Engineer", C.AI, {
    description: "Conduct applied AI research and deliver improvements that transfer into production-ready systems.",
    dailyWork: "Prototype models, run experiments and ablations, evaluate results, collaborate with engineering to deploy solutions, and document findings.",
    requiredSkills: ["Experimentation", "Deep learning", "Model evaluation", "Python", "ML research fundamentals"],
    preferredInterests: ["Discovery", "Experimentation", "Optimization"],
    requiredSubjects: ["Mathematics", "ML", "Computer Science"],
    personalityTraits: ["Curious", "Persistent", "Analytical"],
    salaryIndiaMin: 900000,
    salaryIndiaMax: 4200000,
    salaryGlobalMin: 120000,
    salaryGlobalMax: 300000,
    futureDemand: 8,
    automationRisk: 6,
    growthRate: 26,
    roadmap: roadmap3("From hypotheses to deployed improvements.", "Research prototyping", "Ablation + evaluation", "Production transfer work"),
    learningResources: buildLearningResources("AI research"),
    certifications: [],
    projectIdeas: ["Model ablation repo", "Evaluation harness", "Experiment tracking dashboard"],
    companiesHiring: ["Google", "Meta", "Research labs"],
    image: "https://example.com/careers/ai-research-engineer.png",
  });

  pushCareer("LLM Applications Engineer", C.AI, {
    description: "Build application layer systems using large language models, retrieval, evaluation, and safe deployment patterns.",
    dailyWork: "Design prompt/agent workflows, implement RAG, evaluate quality, manage latency/cost, and add guardrails and monitoring.",
    requiredSkills: ["LLM systems", "RAG", "Prompt engineering", "Evaluation", "Safety/guardrails", "APIs"],
    preferredInterests: ["Automation", "Language", "Product building"],
    requiredSubjects: ["NLP", "Information retrieval", "Programming"],
    personalityTraits: ["Product-minded", "Curious", "Iterative"],
    salaryIndiaMin: 850000,
    salaryIndiaMax: 3600000,
    salaryGlobalMin: 110000,
    salaryGlobalMax: 260000,
    futureDemand: 10,
    automationRisk: 7,
    growthRate: 24,
    roadmap: roadmap3("From model usage to reliable LLM apps.", "RAG pipelines", "Evaluation + test suites", "Guardrails + monitoring"),
    learningResources: buildLearningResources("LLM applications"),
    certifications: [],
    projectIdeas: ["RAG QA system", "Hallucination evaluation harness", "Latency/cost optimization report"],
    companiesHiring: ["OpenAI ecosystem", "Google", "Amazon"],
    image: "https://example.com/careers/llm-applications-engineer.png",
  });

  pushCareer("Machine Learning Operations Engineer (ML Ops Engineer)", C.ML, {
    description: "Operationalize machine learning by setting up reliable training, deployment, monitoring, and governance pipelines.",
    dailyWork: "Build CI/CD for ML, manage model registries, configure monitoring (drift/performance), and ensure repeatable training.",
    requiredSkills: ["MLOps", "Model registry", "Monitoring", "CI/CD", "Automation", "Python"],
    preferredInterests: ["Automation", "Reliability", "Data quality"],
    requiredSubjects: ["Machine learning", "Software engineering", "Statistics basics"],
    personalityTraits: ["Reliable", "Process-driven", "Detail-oriented"],
    salaryIndiaMin: 800000,
    salaryIndiaMax: 3400000,
    salaryGlobalMin: 105000,
    salaryGlobalMax: 250000,
    futureDemand: 9,
    automationRisk: 6,
    growthRate: 23,
    roadmap: roadmap3("From training scripts to production ML pipelines.", "Training reproducibility", "Deployment automation", "Drift & quality monitoring"),
    learningResources: buildLearningResources("MLOps engineering"),
    certifications: ["AWS Certified Machine Learning – Specialty (optional)"],
    projectIdeas: ["Model registry + deployment pipeline", "Drift monitoring dashboard", "Automated evaluation gates"],
    companiesHiring: ["Amazon", "Google", "Microsoft"],
    image: "https://example.com/careers/mlops-engineer.png",
  });

  pushCareer("Data-Centric Machine Learning Engineer", C.ML, {
    description: "Improve ML outcomes by focusing on data quality, labeling workflows, and evaluation-driven iteration.",
    dailyWork: "Audit datasets, define data requirements, implement labeling/cleaning processes, and run evaluation cycles to improve model performance.",
    requiredSkills: ["Data quality", "Evaluation", "Feature engineering", "Experiment design", "Python"],
    preferredInterests: ["Experimentation", "Precision improvement", "Data analysis"],
    requiredSubjects: ["Statistics", "Machine learning", "Programming"],
    personalityTraits: ["Detail-focused", "Analytical", "Iterative"],
    salaryIndiaMin: 750000,
    salaryIndiaMax: 3100000,
    salaryGlobalMin: 95000,
    salaryGlobalMax: 230000,
    futureDemand: 9,
    automationRisk: 6,
    growthRate: 22,
    roadmap: roadmap3("From messy data to strong models.", "Dataset audits", "Evaluation-driven iteration", "Production feedback loops"),
    learningResources: buildLearningResources("Data-centric ML"),
    certifications: [],
    projectIdeas: ["Dataset audit + fixes plan", "Evaluation benchmark suite", "Labeling workflow prototype"],
    companiesHiring: ["Tech platforms", "AI startups"],
    image: "https://example.com/careers/data-centric-ml-engineer.png",
  });

  // Data Science & Analytics (4)
  pushCareer("Product Analytics Manager", C.DS, {
    description: "Lead analytics strategy to measure product outcomes, design experiments, and improve growth and retention.",
    dailyWork: "Set KPI frameworks, analyze funnels/cohorts, run A/B tests, and partner with product teams to drive measurable change.",
    requiredSkills: ["SQL", "Experimentation", "Cohort analysis", "Metrics design", "Visualization", "Communication"],
    preferredInterests: ["User impact", "Strategy", "Decision support"],
    requiredSubjects: ["Statistics", "Product analytics", "Data analysis"],
    personalityTraits: ["Strategic", "Communicative", "Structured"],
    salaryIndiaMin: 700000,
    salaryIndiaMax: 2600000,
    salaryGlobalMin: 90000,
    salaryGlobalMax: 190000,
    futureDemand: 8,
    automationRisk: 4,
    growthRate: 17,
    roadmap: roadmap3("From metrics to outcomes.", "KPI design", "Experiment design", "Cohort & retention strategy"),
    learningResources: buildLearningResources("Product analytics"),
    certifications: ["Google Analytics (optional)"],
    projectIdeas: ["Activation funnel model", "Cohort retention report", "Experiment analysis playbook"],
    companiesHiring: ["SaaS", "Consumer apps", "E-commerce"],
    image: "https://example.com/careers/product-analytics-manager.png",
  });

  pushCareer("Fraud Data Scientist", C.DS, {
    description: "Build models and detection systems to reduce fraud through risk scoring, behavior analytics, and decisioning.",
    dailyWork: "Develop risk models, evaluate false positives/negatives, monitor model performance, and collaborate with operations teams.",
    requiredSkills: ["Risk modeling", "Classification", "Evaluation", "SQL", "Feature engineering", "Experimentation"],
    preferredInterests: ["Risk reduction", "Problem solving", "Automation"],
    requiredSubjects: ["Statistics", "Machine learning", "Data analysis"],
    personalityTraits: ["Analytical", "Responsible", "Persistent"],
    salaryIndiaMin: 750000,
    salaryIndiaMax: 3200000,
    salaryGlobalMin: 100000,
    salaryGlobalMax: 230000,
    futureDemand: 8,
    automationRisk: 6,
    growthRate: 19,
    roadmap: roadmap3("From signals to fraud detection.", "Feature engineering", "Model evaluation & thresholds", "Monitoring + feedback loops"),
    learningResources: buildLearningResources("Fraud analytics"),
    certifications: [],
    projectIdeas: ["Fraud risk scoring notebook", "Alert triage dashboard", "Model performance monitoring scripts"],
    companiesHiring: ["FinTech", "Banks", "Payments"],
    image: "https://example.com/careers/fraud-data-scientist.png",
  });

  pushCareer("Marketing Analytics Analyst", C.DS, {
    description: "Optimize marketing performance by analyzing campaign effectiveness, attribution, and experimentation results.",
    dailyWork: "Analyze spend/returns, build campaign dashboards, run A/B tests, and communicate insights to marketing stakeholders.",
    requiredSkills: ["SQL", "Marketing analytics", "Experimentation", "Attribution basics", "Visualization"],
    preferredInterests: ["Growth", "Creativity", "Results-driven work"],
    requiredSubjects: ["Marketing", "Statistics basics", "Economics basics"],
    personalityTraits: ["Results-driven", "Structured", "Communicative"],
    salaryIndiaMin: 450000,
    salaryIndiaMax: 1600000,
    salaryGlobalMin: 55000,
    salaryGlobalMax: 120000,
    futureDemand: 8,
    automationRisk: 4,
    growthRate: 14,
    roadmap: roadmap3("From funnel data to growth.", "Funnel metrics", "A/B test analysis", "Attribution improvement"),
    learningResources: buildLearningResources("Marketing analytics"),
    certifications: [],
    projectIdeas: ["Attribution comparison study", "Experiment results dashboard", "Campaign KPI plan"],
    companiesHiring: ["Agencies", "E-commerce", "Tech marketing teams"],
    image: "https://example.com/careers/marketing-data-analyst-2.png",
  });

  pushCareer("Data Quality Analyst", C.DS, {
    description: "Ensure data integrity for analytics and ML by monitoring data quality, validating pipelines, and addressing inconsistencies.",
    dailyWork: "Define quality rules, validate data freshness/accuracy, monitor anomalies, and coordinate with engineering on fixes.",
    requiredSkills: ["Data validation", "SQL", "Statistics basics", "Anomaly detection", "Documentation", "Communication"],
    preferredInterests: ["Reliability", "Problem solving", "Process improvement"],
    requiredSubjects: ["Data systems", "Databases", "Statistics basics"],
    personalityTraits: ["Detail-oriented", "Reliable", "Communicative"],
    salaryIndiaMin: 500000,
    salaryIndiaMax: 1800000,
    salaryGlobalMin: 60000,
    salaryGlobalMax: 140000,
    futureDemand: 7,
    automationRisk: 4,
    growthRate: 13,
    roadmap: roadmap3("From raw data issues to trust.", "Quality rule design", "Anomaly monitoring", "Data incident playbooks"),
    learningResources: buildLearningResources("Data quality"),
    certifications: [],
    projectIdeas: ["Data quality ruleset", "Anomaly dashboard prototype", "Incident postmortem templates"],
    companiesHiring: ["Data teams", "Analytics platforms"],
    image: "https://example.com/careers/data-quality-analyst.png",
  });

  // Cybersecurity (4)
  pushCareer("Security Analyst", C.SEC, {
    description: "Monitor security alerts, conduct investigations, and improve defensive controls for organizations.",
    dailyWork: "Review SIEM alerts, investigate incidents, document findings, and assist in hardening systems and improving detection coverage.",
    requiredSkills: ["SIEM", "Incident triage", "Networking fundamentals", "Security baselines", "Scripting", "Threat analysis"],
    preferredInterests: ["Risk reduction", "Problem solving", "Security operations"],
    requiredSubjects: ["Networking", "Operating Systems", "Security fundamentals"],
    personalityTraits: ["Analytical", "Persistent", "Risk-aware"],
    salaryIndiaMin: 600000,
    salaryIndiaMax: 2400000,
    salaryGlobalMin: 75000,
    salaryGlobalMax: 170000,
    futureDemand: 10,
    automationRisk: 7,
    growthRate: 20,
    roadmap: roadmap3("From alerts to actionable security improvements.", "Detection triage", "Incident investigation", "Hardening + detection engineering"),
    learningResources: buildLearningResources("SOC & security operations"),
    certifications: ["CompTIA Security+ (optional)"],
    projectIdeas: ["SIEM detection rule set", "Incident write-up template", "Hardening checklist automation"],
    companiesHiring: ["CrowdStrike", "Palo Alto Networks", "Microsoft"],
    image: "https://example.com/careers/security-analyst.png",
  });

  pushCareer("Cloud Security Engineer", C.SEC, {
    description: "Secure cloud environments by implementing IAM policies, security controls, monitoring, and compliance automation.",
    dailyWork: "Harden cloud services, configure IAM, manage security policies, review configurations, and ensure secure deployment patterns.",
    requiredSkills: ["Cloud security", "IAM", "Security monitoring", "Policy as code", "Threat modeling", "Networking basics"],
    preferredInterests: ["Infrastructure security", "Reliability", "Automation"],
    requiredSubjects: ["Cloud", "Security", "Networking"],
    personalityTraits: ["Structured", "Risk-aware", "Detail-focused"],
    salaryIndiaMin: 750000,
    salaryIndiaMax: 3200000,
    salaryGlobalMin: 95000,
    salaryGlobalMax: 240000,
    futureDemand: 9,
    automationRisk: 6,
    growthRate: 20,
    roadmap: roadmap3("From misconfigurations to secure cloud.", "IAM + policy design", "Security posture monitoring", "Compliance automation"),
    learningResources: buildLearningResources("Cloud security"),
    certifications: ["AWS Certified Security – Specialty (optional)"],
    projectIdeas: ["Cloud security posture dashboard", "IaC policy templates", "Secure deployment reference design"],
    companiesHiring: ["Cloud providers", "Security vendors", "Enterprise security teams"],
    image: "https://example.com/careers/cloud-security-engineer.png",
  });

  pushCareer("Application Security Engineer", C.SEC, {
    description: "Reduce software risk by finding vulnerabilities, building secure SDLC practices, and improving defenses across applications.",
    dailyWork: "Run SAST/DAST scanning, threat model features, triage findings, and collaborate with engineers to fix vulnerabilities and improve CI pipelines.",
    requiredSkills: ["Secure SDLC", "OWASP", "Threat modeling", "SAST/DAST", "Web security", "Secure coding"],
    preferredInterests: ["Problem solving", "Risk reduction", "Secure engineering"],
    requiredSubjects: ["Software engineering", "Web security", "Security fundamentals"],
    personalityTraits: ["Detail-oriented", "Persistent", "Collaborative"],
    salaryIndiaMin: 700000,
    salaryIndiaMax: 2800000,
    salaryGlobalMin: 90000,
    salaryGlobalMax: 220000,
    futureDemand: 9,
    automationRisk: 6,
    growthRate: 18,
    roadmap: roadmap3("From vulnerabilities to secure delivery.", "Threat modeling", "Secure code fixes", "Security automation in CI/CD"),
    learningResources: buildLearningResources("Application security"),
    certifications: ["OWASP-related courses (optional)"],
    projectIdeas: ["Secure SDLC checklist", "Vulnerability triage workbook", "CI security gate prototype"],
    companiesHiring: ["Security teams", "FinTech", "SaaS companies"],
    image: "https://example.com/careers/application-security-engineer.png",
  });

  pushCareer("Incident Response Analyst", C.SEC, {
    description: "Investigate active security incidents, manage containment, and improve future incident readiness.",
    dailyWork: "Analyze indicators of compromise, coordinate containment actions, collect evidence, and write post-incident improvement plans.",
    requiredSkills: ["Incident response", "Forensics basics", "Threat analysis", "Networking", "Documentation"],
    preferredInterests: ["Crisis response", "Learning from incidents", "Risk reduction"],
    requiredSubjects: ["Operating Systems", "Networking", "Security fundamentals"],
    personalityTraits: ["Composed", "Analytical", "Persistent"],
    salaryIndiaMin: 650000,
    salaryIndiaMax: 2600000,
    salaryGlobalMin: 80000,
    salaryGlobalMax: 210000,
    futureDemand: 8,
    automationRisk: 7,
    growthRate: 17,
    roadmap: roadmap3("From detection to resilient response.", "Triage playbooks", "Evidence collection", "Postmortems & improvements"),
    learningResources: buildLearningResources("Incident response"),
    certifications: [],
    projectIdeas: ["Incident response playbook", "Forensics evidence checklist", "Tabletop exercise plan"],
    companiesHiring: ["Enterprises", "Security services"],
    image: "https://example.com/careers/incident-response-analyst.png",
  });

  // Product Management & UI/UX (4)
  pushCareer("Digital Product Manager", C.PM, {
    description: "Own product strategy for digital experiences and translate customer needs into measurable roadmaps.",
    dailyWork: "Conduct discovery, define product requirements, prioritize roadmap, align stakeholders, and measure outcomes through experiments.",
    requiredSkills: ["Product strategy", "Prioritization", "User research", "Metrics", "Stakeholder management"],
    preferredInterests: ["Customer impact", "Strategy", "Cross-functional work"],
    requiredSubjects: ["Business", "Communications", "User research basics"],
    personalityTraits: ["Strategic", "Decisive", "Communicative"],
    salaryIndiaMin: 900000,
    salaryIndiaMax: 3600000,
    salaryGlobalMin: 105000,
    salaryGlobalMax: 260000,
    futureDemand: 8,
    automationRisk: 3,
    growthRate: 22,
    roadmap: roadmap3("From discovery to measurable delivery.", "Problem framing", "Execution planning", "Experimentation & outcomes"),
    learningResources: buildLearningResources("Product management"),
    certifications: [],
    projectIdeas: ["PRD + success metrics template", "Experiment plan for onboarding", "Roadmap prioritization spreadsheet"],
    companiesHiring: ["Technology companies", "SaaS", "Consumer apps"],
    image: "https://example.com/careers/digital-product-manager.png",
  });

  pushCareer("UX Researcher", C.UX, {
    description: "Plan and run user research to uncover needs and improve product usability through evidence-based findings.",
    dailyWork: "Design studies, recruit participants, conduct interviews/usability tests, synthesize insights, and influence design decisions.",
    requiredSkills: ["User research", "Interviewing", "Usability testing", "Synthesizing findings", "Communication"],
    preferredInterests: ["User empathy", "Learning", "Evidence-based design"],
    requiredSubjects: ["Psychology basics", "HCI", "Research methods"],
    personalityTraits: ["Empathetic", "Patient", "Analytical"],
    salaryIndiaMin: 500000,
    salaryIndiaMax: 1800000,
    salaryGlobalMin: 65000,
    salaryGlobalMax: 140000,
    futureDemand: 7,
    automationRisk: 2,
    growthRate: 15,
    roadmap: roadmap3("From research questions to design impact.", "Study design", "Usability testing", "Insight synthesis & recommendations"),
    learningResources: buildLearningResources("UX research"),
    certifications: ["Google UX Design Certificate (optional)"],
    projectIdeas: ["Usability test report", "Interview guide templates", "Insight-to-design mapping board"],
    companiesHiring: ["Product teams", "Design agencies"],
    image: "https://example.com/careers/ux-researcher.png",
  });

  pushCareer("Interaction Designer", C.UX, {
    description: "Design interaction flows and experiences that make products intuitive, accessible, and engaging.",
    dailyWork: "Create user flows, prototypes, conduct iterative tests, and collaborate with engineers/designers to ship UX improvements.",
    requiredSkills: ["Prototyping", "Interaction design", "Accessibility", "Design systems", "User flows"],
    preferredInterests: ["Design polish", "User experience", "Communication"],
    requiredSubjects: ["HCI", "Design fundamentals", "Psychology basics"],
    personalityTraits: ["Iterative", "Creative", "Detail-focused"],
    salaryIndiaMin: 480000,
    salaryIndiaMax: 1700000,
    salaryGlobalMin: 60000,
    salaryGlobalMax: 125000,
    futureDemand: 8,
    automationRisk: 2,
    growthRate: 16,
    roadmap: roadmap3("From flows to shipped interactions.", "Wireframes & flows", "Prototyping & iteration", "Accessibility + handoff"),
    learningResources: buildLearningResources("Interaction design"),
    certifications: [],
    projectIdeas: ["Prototype for onboarding flow", "Accessibility improvement plan", "Design system component map"],
    companiesHiring: ["Design teams", "Product orgs"],
    image: "https://example.com/careers/interaction-designer.png",
  });

  pushCareer("UI Engineer", C.UX, {
    description: "Translate design systems into high-performance, accessible frontends with strong engineering discipline.",
    dailyWork: "Build UI components, implement design system tokens, ensure accessibility, optimize performance, and collaborate with designers/engineers.",
    requiredSkills: ["TypeScript", "Frontend performance", "Accessibility", "Component architecture", "Design systems"],
    preferredInterests: ["Design polish", "Engineering craft", "User experience"],
    requiredSubjects: ["Web development", "HCI fundamentals", "Software engineering basics"],
    personalityTraits: ["Detail-oriented", "Collaborative", "Continuous learner"],
    salaryIndiaMin: 550000,
    salaryIndiaMax: 2200000,
    salaryGlobalMin: 70000,
    salaryGlobalMax: 170000,
    futureDemand: 8,
    automationRisk: 3,
    growthRate: 18,
    roadmap: roadmap3("From design tokens to production UI.", "Component architecture", "A11y & QA automation", "Performance + UX tuning"),
    learningResources: buildLearningResources("UI engineering"),
    certifications: [],
    projectIdeas: ["Design system token implementation", "Accessibility test checklist", "Component library sample app"],
    companiesHiring: ["Product teams", "Tech companies"],
    image: "https://example.com/careers/ui-engineer.png",
  });

  // --- End of Batch 21–40 ---

  // --- Batch 41-60 ---
  const pushStandardCareer = (
    title: string,
    category: string,
    topic: string,
    skills: string[],
    subjects: string[],
    salaryIndiaMin: number,
    salaryIndiaMax: number,
    salaryGlobalMin: number,
    salaryGlobalMax: number,
    futureDemand: number,
    automationRisk: number,
    growthRate: number
  ) => {
    pushCareer(title, category, {
      description: `Work as a ${title.toLowerCase()} applying ${topic.toLowerCase()} expertise to solve real organizational problems.`,
      dailyWork: `Plan work, collaborate with stakeholders, apply ${topic.toLowerCase()} methods, review outcomes, document decisions, and improve delivery quality.`,
      requiredSkills: skills,
      preferredInterests: [topic, "Problem solving", "Continuous learning"],
      requiredSubjects: subjects,
      personalityTraits: ["Analytical", "Collaborative", "Detail-oriented"],
      salaryIndiaMin,
      salaryIndiaMax,
      salaryGlobalMin,
      salaryGlobalMax,
      futureDemand,
      automationRisk,
      growthRate,
      roadmap: roadmap3(`From fundamentals to professional ${topic.toLowerCase()} practice.`, `${topic} foundations`, "Applied projects and tools", "Portfolio and workplace readiness"),
      learningResources: buildLearningResources(topic),
      certifications: [],
      projectIdeas: [`${topic} portfolio project`, `${topic} case study`, `${topic} workflow improvement plan`],
      companiesHiring: ["Technology companies", "Consulting firms", "Enterprise teams"],
      image: `https://example.com/careers/${slugify(title)}.png`,
    });
  };

  [
    ["Cloud Infrastructure Engineer", C.CLOUD, "Cloud infrastructure", ["Cloud platforms", "Infrastructure as code", "Networking", "Linux", "Monitoring"], ["Cloud Computing", "Networking", "Operating Systems"], 700000, 3000000, 90000, 220000, 9, 5, 20],
    ["Platform Engineer", C.DEVOPS, "Platform engineering", ["Kubernetes", "CI/CD", "Infrastructure as code", "Developer tooling", "Observability"], ["Software Engineering", "Cloud Computing", "Operating Systems"], 900000, 3800000, 110000, 260000, 9, 5, 23],
    ["Kubernetes Administrator", C.DEVOPS, "Kubernetes administration", ["Kubernetes", "Containers", "Linux", "Networking", "Monitoring"], ["Operating Systems", "Networking", "Cloud Computing"], 750000, 3000000, 95000, 220000, 8, 5, 18],
    ["Penetration Tester", C.SEC, "Penetration testing", ["Web security", "Network testing", "OWASP", "Reporting", "Scripting"], ["Networking", "Security Fundamentals", "Operating Systems"], 600000, 2600000, 80000, 200000, 8, 6, 16],
    ["Security Architect", C.SEC, "Security architecture", ["Security architecture", "Threat modeling", "IAM", "Cloud security", "Risk management"], ["Security", "Networking", "Software Architecture"], 1500000, 5500000, 130000, 300000, 9, 4, 19],
    ["Product Designer", C.UX, "Product design", ["Product design", "Figma", "Prototyping", "User flows", "Accessibility"], ["Design Fundamentals", "HCI", "Psychology"], 550000, 2400000, 75000, 170000, 8, 3, 17],
    ["Visual Designer", C.UX, "Visual design", ["Visual design", "Typography", "Color theory", "Figma", "Design systems"], ["Graphic Design", "Visual Communication", "Design Fundamentals"], 400000, 1600000, 55000, 125000, 7, 4, 12],
    ["Technical Product Manager", C.PM, "Technical product management", ["Technical strategy", "APIs", "Roadmapping", "Stakeholder management", "Metrics"], ["Computer Science", "Business", "Product Management"], 1200000, 4500000, 120000, 280000, 9, 3, 22],
    ["Growth Product Manager", C.PM, "Growth product management", ["Experimentation", "Product analytics", "Growth strategy", "Prioritization", "SQL basics"], ["Marketing", "Statistics", "Product Management"], 900000, 3600000, 105000, 240000, 8, 4, 20],
    ["Business Analyst", C.BA, "Business analysis", ["Requirements analysis", "Process mapping", "SQL basics", "Excel", "Communication"], ["Business Studies", "Statistics", "Information Systems"], 450000, 1800000, 60000, 130000, 7, 5, 12],
    ["Systems Analyst", C.BA, "Systems analysis", ["Systems analysis", "Requirements gathering", "SQL", "UML basics", "Testing support"], ["Information Systems", "Business Analysis", "Databases"], 550000, 2200000, 70000, 150000, 7, 5, 13],
    ["Operations Analyst", C.BA, "Operations analysis", ["Excel", "SQL basics", "Process analysis", "Dashboarding", "Communication"], ["Operations Management", "Statistics", "Business"], 400000, 1500000, 55000, 115000, 7, 5, 11],
    ["Financial Analyst", C.FIN, "Financial analysis", ["Financial modeling", "Excel", "Accounting basics", "Forecasting", "Presentation"], ["Finance", "Accounting", "Economics"], 500000, 2200000, 65000, 150000, 7, 5, 11],
    ["Investment Banking Analyst", C.FIN, "Investment banking", ["Valuation", "Financial modeling", "Excel", "Corporate finance", "Presentation"], ["Finance", "Accounting", "Economics"], 900000, 3500000, 95000, 220000, 7, 5, 10],
    ["Risk Analyst", C.FIN, "Financial risk analysis", ["Risk modeling", "Statistics", "Excel", "SQL basics", "Financial products"], ["Finance", "Statistics", "Economics"], 550000, 2400000, 70000, 160000, 8, 5, 13],
    ["Management Consultant", C.CONS, "Management consulting", ["Structured problem solving", "Excel", "Presentation", "Market research", "Stakeholder management"], ["Business", "Economics", "Statistics"], 900000, 4000000, 90000, 220000, 7, 4, 12],
    ["Strategy Consultant", C.CONS, "Strategy consulting", ["Market analysis", "Business strategy", "Financial modeling", "Presentation", "Research"], ["Business Strategy", "Economics", "Finance"], 1000000, 4500000, 100000, 240000, 7, 4, 11],
    ["SEO Specialist", C.MKT, "SEO", ["SEO", "Keyword research", "Google Search Console", "Content strategy", "Analytics"], ["Marketing", "Digital Analytics", "Communication"], 350000, 1400000, 50000, 110000, 7, 5, 12],
    ["Performance Marketing Manager", C.MKT, "Performance marketing", ["Paid ads", "Campaign analytics", "A/B testing", "Budget management", "Conversion optimization"], ["Marketing", "Statistics", "Business"], 500000, 2200000, 65000, 150000, 8, 5, 16],
    ["Content Marketing Strategist", C.MKT, "Content marketing", ["Content strategy", "SEO basics", "Audience research", "Editorial planning", "Analytics"], ["Marketing", "Communication", "English"], 400000, 1700000, 55000, 125000, 7, 5, 12],
  ].forEach((career) => pushStandardCareer(...(career as [string, string, string, string[], string[], number, number, number, number, number, number, number])));

  // --- Batch 61-80 ---
  [
    ["Physician Assistant", C.HEALTH, "Physician assistant practice", ["Clinical assessment", "Patient communication", "Medical documentation", "Treatment planning", "Teamwork"], ["Biology", "Chemistry", "Clinical Medicine"], 450000, 1600000, 85000, 150000, 8, 3, 18],
    ["Clinical Research Coordinator", C.HEALTH, "Clinical research coordination", ["Clinical trial operations", "Documentation", "GCP basics", "Participant coordination", "Data accuracy"], ["Life Sciences", "Clinical Research", "Statistics"], 350000, 1400000, 55000, 110000, 8, 4, 14],
    ["Healthcare Data Analyst", C.HEALTH, "Healthcare analytics", ["SQL", "Healthcare analytics", "Data visualization", "Statistics basics", "Privacy awareness"], ["Statistics", "Healthcare Systems", "Databases"], 500000, 2000000, 70000, 145000, 8, 4, 16],
    ["Mechanical Design Engineer", C.MECH, "Mechanical design engineering", ["CAD", "Mechanical design", "GD&T", "Materials", "Prototyping"], ["Mechanics", "Materials Science", "Machine Design"], 400000, 1800000, 65000, 140000, 7, 4, 10],
    ["Manufacturing Engineer", C.MECH, "Manufacturing engineering", ["Manufacturing processes", "Lean methods", "Process improvement", "Quality tools", "CAD basics"], ["Manufacturing", "Industrial Engineering", "Materials"], 420000, 1800000, 65000, 135000, 7, 5, 11],
    ["Automotive Engineer", C.MECH, "Automotive engineering", ["Vehicle systems", "CAD/CAE", "Testing", "Materials", "Data analysis"], ["Mechanical Engineering", "Thermodynamics", "Vehicle Dynamics"], 450000, 2200000, 70000, 150000, 7, 4, 12],
    ["Civil Site Engineer", C.CIVIL, "Civil site engineering", ["Construction supervision", "Reading drawings", "Quantity estimation", "Safety practices", "Coordination"], ["Civil Engineering", "Construction Management", "Surveying"], 300000, 1400000, 55000, 120000, 7, 4, 9],
    ["Structural Engineer", C.CIVIL, "Structural engineering", ["Structural analysis", "RCC/steel design", "ETABS/STAAD", "Building codes", "Technical drawing"], ["Structural Engineering", "Strength of Materials", "Concrete Technology"], 450000, 2200000, 70000, 155000, 7, 4, 10],
    ["Transportation Planner", C.CIVIL, "Transportation planning", ["Transport planning", "GIS basics", "Traffic analysis", "Policy research", "Stakeholder communication"], ["Transportation Engineering", "Urban Planning", "Statistics"], 450000, 1800000, 65000, 135000, 7, 4, 11],
    ["Electrical Design Engineer", C.ELEC, "Electrical design engineering", ["Electrical design", "Load calculations", "AutoCAD Electrical", "Power systems", "Safety standards"], ["Electrical Engineering", "Power Systems", "Circuit Theory"], 400000, 1800000, 65000, 140000, 7, 4, 10],
    ["Power Systems Engineer", C.ELEC, "Power systems engineering", ["Power systems", "Protection", "Load flow analysis", "MATLAB/ETAP", "Electrical safety"], ["Power Systems", "Electrical Machines", "Control Systems"], 500000, 2300000, 75000, 160000, 8, 4, 13],
    ["Embedded Systems Engineer", C.ELEC, "Embedded systems", ["C/C++", "Microcontrollers", "RTOS basics", "Electronics", "Debugging"], ["Digital Electronics", "Microprocessors", "Programming"], 550000, 2400000, 80000, 175000, 8, 4, 15],
    ["Civil Services Officer", C.GOV, "Civil services", ["Public administration", "Policy understanding", "Communication", "Leadership", "Decision making"], ["Public Administration", "History", "Economics"], 700000, 2500000, 50000, 130000, 7, 3, 8],
    ["Policy Analyst", C.GOV, "Policy analysis", ["Policy research", "Data analysis", "Writing", "Economics basics", "Stakeholder analysis"], ["Economics", "Political Science", "Statistics"], 450000, 1800000, 60000, 140000, 7, 4, 11],
    ["Public Sector Project Manager", C.GOV, "Public sector project management", ["Project management", "Public procurement basics", "Monitoring and evaluation", "Reporting", "Stakeholder coordination"], ["Public Administration", "Project Management", "Economics"], 550000, 2200000, 70000, 150000, 7, 4, 10],
    ["Research Scientist", C.RESEARCH, "Scientific research", ["Research methods", "Experiment design", "Statistics", "Scientific writing", "Domain expertise"], ["Research Methodology", "Statistics", "Domain Science"], 600000, 2500000, 75000, 180000, 8, 4, 14],
    ["Quantitative Researcher", C.RESEARCH, "Quantitative research", ["Statistics", "Probability", "Python", "Optimization", "Financial markets"], ["Mathematics", "Statistics", "Computer Science"], 1200000, 6000000, 130000, 350000, 8, 5, 16],
    ["User Research Scientist", C.RESEARCH, "User research science", ["Research design", "Survey methods", "Interviewing", "Statistics basics", "Insight synthesis"], ["Psychology", "Research Methods", "Statistics"], 650000, 2600000, 85000, 180000, 7, 3, 14],
    ["Sports Data Analyst", C.SPORTS, "Sports analytics", ["Sports analytics", "SQL/Python", "Visualization", "Statistics", "Domain knowledge"], ["Statistics", "Sports Science", "Data Analysis"], 350000, 1500000, 55000, 125000, 7, 4, 15],
    ["Athletic Trainer", C.SPORTS, "Athletic training", ["Sports medicine", "Injury assessment", "Rehabilitation basics", "Communication", "Emergency response"], ["Anatomy", "Physiology", "Sports Medicine"], 300000, 1200000, 50000, 105000, 7, 2, 12],
  ].forEach((career) => pushStandardCareer(...(career as [string, string, string, string[], string[], number, number, number, number, number, number, number])));

  // --- Batch 81-90 ---
  [
    ["Sports Psychologist", C.SPORTS, "Sports psychology", ["Psychological assessment", "Counseling", "Performance psychology", "Communication", "Ethics"], ["Psychology", "Counseling", "Sports Science"], 400000, 1800000, 65000, 145000, 7, 2, 13],
    ["School Teacher", C.EDU, "School teaching", ["Lesson planning", "Classroom management", "Subject expertise", "Assessment", "Communication"], ["Education", "Child Development", "Subject Specialization"], 250000, 1000000, 45000, 95000, 7, 3, 8],
    ["Instructional Designer", C.EDU, "Instructional design", ["Instructional design", "Learning objectives", "Assessment design", "Storyboarding", "E-learning tools"], ["Education", "Psychology", "Communication"], 450000, 1800000, 65000, 130000, 8, 4, 15],
    ["Corporate Trainer", C.EDU, "Corporate training", ["Facilitation", "Training design", "Presentation", "Coaching", "Evaluation"], ["Education", "Business Communication", "Psychology"], 450000, 2000000, 65000, 135000, 7, 4, 12],
    ["Startup Founder", C.ENTRE, "Startup founding", ["Customer discovery", "Product strategy", "Sales", "Fundraising", "Leadership"], ["Business", "Product Management", "Finance"], 0, 5000000, 0, 300000, 8, 3, 18],
    ["Venture Capital Analyst", C.ENTRE, "Venture capital analysis", ["Market research", "Financial analysis", "Startup evaluation", "Networking", "Writing"], ["Finance", "Business", "Economics"], 700000, 2800000, 80000, 180000, 7, 4, 13],
    ["Business Development Manager", C.ENTRE, "Business development", ["Sales strategy", "Partnerships", "Negotiation", "Market research", "Communication"], ["Business", "Marketing", "Communication"], 500000, 2400000, 65000, 160000, 7, 4, 14],
    ["Corporate Lawyer", C.LAW, "Corporate law", ["Contract law", "Legal research", "Negotiation", "Corporate compliance", "Writing"], ["Law", "Corporate Law", "Commercial Law"], 600000, 3500000, 80000, 220000, 7, 4, 10],
    ["Legal Analyst", C.LAW, "Legal analysis", ["Legal research", "Document review", "Writing", "Compliance basics", "Attention to detail"], ["Law", "Legal Methods", "English"], 350000, 1400000, 50000, 110000, 7, 6, 9],
    ["Intellectual Property Lawyer", C.LAW, "Intellectual property law", ["IP law", "Legal drafting", "Patent/trademark research", "Licensing", "Technical understanding"], ["Law", "Intellectual Property", "Technology"], 600000, 3000000, 85000, 220000, 8, 4, 13],
  ].forEach((career) => pushStandardCareer(...(career as [string, string, string, string[], string[], number, number, number, number, number, number, number])));

  // Validation guard must remain unchanged.
  if (careers.length !== 90) {
    throw new Error(`Seed dataset incomplete: expected 90 careers but currently have ${careers.length}. Complete expansion to 90 real careers before seeding.`);
  }

  const slugs = new Set<string>();
  for (const c of careers) {
    if (slugs.has(c.slug)) throw new Error(`Duplicate slug detected: ${c.slug}`);
    slugs.add(c.slug);
  }

  for (const c of careers) await upsertCareer(c);

  console.log(`✅ Seeded ${careers.length} careers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

