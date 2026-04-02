export type ProjectFeature = {
  title: string
  body: string
}

export type ProjectChallenge = {
  challenge: string
  solution: string
  outcome: string
}

export type ProjectMetric = {
  label: string
  value: string
  note?: string
}

export type ProjectData = {
  slug: string
  title: string
  medium: string
  description: string
  span: string
  status: string
  timeline: string
  role: string
  team: string
  heroLine: string
  overview: string
  problem: string
  goal: string
  contribution: string[]
  process: ProjectFeature[]
  features: ProjectFeature[]
  challenges: ProjectChallenge[]
  results: string[]
  metrics?: ProjectMetric[]
  stack: {
    frontend: string[]
    backend: string[]
    tooling: string[]
  }
  nextSteps: string[]
}

export const projects: ProjectData[] = [
  {
    slug: "project-lattice",
    title: "ProcureOS Pro",
    medium: "Product Leadership",
    description: "Defining a repeatable commercial model in a historically one-off, sales-led motion.",
    span: "col-span-2 row-span-2",
    status: "Shipped",
    timeline: "Multi-quarter initiative",
    role: "Product Leadership",
    team: "Analytics, Marketing, Product, and Sales",
    heroLine: "Introducing product led growth to a sales driven org & how the bet paid off.",
    overview:
      "ProcureOS Pro centered on redesigning the commercial model behind the platform. Similar customer cohorts were being sold through one-off structures with inconsistent account value, making growth hard to predict and harder to scale.",
    problem:
      "Commercial packaging and pricing were highly variable, even across comparable customers. The existing model limited repeatability, obscured value realization, and made long-term product investment decisions harder.",
    goal:
      "Establish a standardized model that protects a free legacy path while introducing clear paid-Pro value, improving consistency, scalability, and alignment between customer value and revenue.",
    contribution: [
      "Aligned analytics, marketing, product, and sales around a unified commercial framework",
      "Defined Pro-only feature boundaries to create clear paid value",
      "Structured free-tier eligibility around standardized volume thresholds",
      "Led cross-functional decision-making on rollout and customer transition",
    ],
    process: [
      { title: "Commercial Diagnosis", body: "Audited one-off deal patterns and account-value variance across comparable cohorts." },
      { title: "Cross-Functional Design", body: "Facilitated model design with analytics, marketing, product, and sales to ensure operational fit." },
      { title: "Packaging Strategy", body: "Preserved legacy free access while moving advanced capabilities into a Pro subscription tier." },
      { title: "Policy Standardization", body: "Defined volume thresholds required for ongoing free usage to improve consistency." },
    ],
    features: [
      { title: "Pro Feature Gating", body: "High-value capabilities were packaged into a paid Pro tier with clearer customer outcomes." },
      { title: "Free-Tier Volume Standards", body: "Eligibility requirements for free usage were standardized across similar customers." },
      { title: "Cohort Consistency", body: "Commercial decisions moved from one-off exceptions toward repeatable cohort-based rules." },
    ],
    challenges: [
      {
        challenge: "A sales-driven organization relied on bespoke deal making.",
        solution: "Built alignment around a shared model that still allowed a practical legacy-free path.",
        outcome: "Created a more scalable commercial motion without forcing abrupt customer disruption.",
      },
      {
        challenge: "Balancing adoption with monetization required careful tradeoffs.",
        solution: "Used clear Pro value boundaries plus objective free-tier volume requirements.",
        outcome: "Improved model clarity for internal teams and customers.",
      },
    ],
    results: [
      "Average ticket price for newly onboarded customers increased by ~20% after tying ProcureOS Pro to net-new customers.",
      "Successfully migrated unprofitable legacy-system customers onto ProcureOS Pro pricing.",
      "Improved overall monetization performance through a more consistent, scalable commercial model.",
    ],
    metrics: [
      {
        label: "Avg Ticket Price (Net-New)",
        value: "+20%",
        note: "Increase after unveiling ProcureOS Pro and tying Pro packaging to new customer onboarding.",
      },
      {
        label: "Marketplace GP (2025)",
        value: "$20,123",
      },
      {
        label: "Expected SaaS Revenue (2026)",
        value: "$435,577",
        note: "Expected value based on Jan '26 SaaS invoices from board-deck snapshot.",
      },
      {
        label: "Marketplace → SaaS Uplift",
        value: "~21.6x (~+2,064%)",
        note: "Directional conversion benchmark from 2025 baseline to 2026 expected revenue profile.",
      },
    ],
    stack: {
      frontend: ["N/A"],
      backend: ["Analytics modeling", "Pricing and packaging operations"],
      tooling: ["Cross-functional workshops", "Board-deck analysis"],
    },
    nextSteps: [
      "Add quantified impact metrics from board-deck slides.",
      "Document customer cohort before/after performance deltas.",
      "Capture rollout lessons for future commercial-model updates.",
    ],
  },

  {
    slug: "silent-agent",
    title: "Freight UI",
    medium: "Visual System",
    description: "Updating a fragmented visual system to be AI ready.",
    span: "col-span-1 row-span-2",
    status: "In Design",
    timeline: "4 weeks",
    role: "Design Leadership",
    team: "Design team + frontend engineering",
    heroLine: "Updating a fragmented visual system to be AI ready.",
    overview: "Freight UI focused on consolidating a fragmented component ecosystem split across Material UI patterns and multiple custom themes into a unified, scalable design system.",
    problem: "The product experience lacked cohesion because teams were shipping from competing component patterns and theme implementations, creating inconsistency and higher implementation overhead.",
    goal: "Modernize and standardize the component library so designers and engineers could build faster, with clearer patterns, stronger UI consistency, and a shared source of truth.",
    contribution: ["Managed designers modernizing core UI components", "Defined standards to bridge Material UI and custom theme patterns", "Introduced Storybook documentation workflows for developer adoption", "Aligned implementation direction toward MCP-server-ready component architecture"],
    process: [
      { title: "Audit & Mapping", body: "Cataloged component drift across Material UI and custom-themed implementations." },
      { title: "System Modernization", body: "Led redesign and standardization of shared components with implementation constraints in mind." },
      { title: "Documentation", body: "Rolled out Storybook docs (storybook.emergemarket.dev) including FUI component stories to improve dev handoff and usage consistency." },
    ],
    features: [
      { title: "Unified Component Standards", body: "Core UI patterns were consolidated into a coherent cross-team component system." },
      { title: "Storybook-Driven Adoption", body: "Design and engineering shared documented component behavior and usage guidance in Storybook." },
    ],
    challenges: [
      { challenge: "Fragmented implementation patterns made consistency difficult at scale.", solution: "Introduced shared component standards, documentation, and governance through Storybook.", outcome: "Improved UI cohesion and reduced ambiguity between design intent and engineering execution." },
    ],
    results: ["Reduced design/development ambiguity through documented reusable components.", "Improved consistency across surfaces previously split between Material UI and custom themes.", "Established groundwork for MCP-server-ready component operations."],
    stack: { frontend: ["Material UI", "Custom theming system"], backend: ["N/A"], tooling: ["Figma", "Storybook", "Design QA reviews"] },
    nextSteps: ["Expand Storybook coverage across remaining legacy components.", "Add quantified delivery metrics (velocity, defects, adoption).", "Formalize MCP-server integration patterns for component delivery."],
  },
  {
    slug: "noir-grid",
    title: "Top of Funnel Automation",
    medium: "Marketing Automation",
    description: "Automating marketing for better sales qualified leads.",
    span: "col-span-1 row-span-2",
    status: "Exploration",
    timeline: "3 weeks",
    role: "Type System Design",
    team: "Solo",
    heroLine: "Automating marketing for better sales qualified leads.",
    overview: "Noir Grid explores density, hierarchy, and pace in long-form digital storytelling.",
    problem: "Generic typography made important context visually flat and hard to scan.",
    goal: "Create a typographic system that carries narrative hierarchy with precision.",
    contribution: ["Scale architecture", "Responsive rhythm", "Editorial components"],
    process: [
      { title: "Audit", body: "Benchmarked readability and hierarchy failures in existing layouts." },
      { title: "Build", body: "Created modular display/body/caption relationships." },
    ],
    features: [
      { title: "Kinetic Headline Scale", body: "Headlines adapt shape across breakpoints while retaining identity." },
      { title: "Annotation Layer", body: "Context tags and captions remain visually coherent in dense pages." },
    ],
    challenges: [
      { challenge: "Expressive type often breaks on small screens.", solution: "Introduced range-clamped scale rules.", outcome: "Preserved tone without sacrificing readability." },
    ],
    results: ["Reading-flow tests showed better section recall."],
    stack: { frontend: ["CSS clamp()", "Tailwind typography"], backend: ["N/A"], tooling: ["Type studies", "Figma"] },
    nextSteps: ["Publish as reusable editorial design kit."],
  },


  {
    slug: "freight-spend-optimization",
    title: "Freight Spend Optimization",
    medium: "AI Product Strategy",
    description: "Developing AI driven products to save customers millions in freight spend.",
    span: "col-span-1 row-span-1",
    status: "In Delivery",
    timeline: "12+ months",
    role: "Product Leadership",
    team: "Cross-functional",
    heroLine: "Developing AI driven products to save customers millions in freight spend.",
    overview:
      "This initiative focused on building AI-assisted freight decisioning products that identify waste, improve routing decisions, and uncover savings opportunities across large shipping networks.",
    problem:
      "Customers managed freight spend through manual analysis and fragmented tooling, leading to missed savings and inconsistent procurement decisions.",
    goal:
      "Create intelligent, scalable product workflows that surface high-impact savings opportunities and make optimization actions easy to execute.",
    contribution: [
      "Shaped product strategy and roadmap",
      "Aligned stakeholders across product, sales, and operations",
      "Defined AI use-cases and validation criteria",
      "Led rollout and adoption planning",
    ],
    process: [
      { title: "Opportunity Mapping", body: "Analyzed customer spend patterns and identified highest-value optimization moments." },
      { title: "AI Product Design", body: "Defined recommendation flows and confidence-based actioning models." },
      { title: "Pilot Delivery", body: "Launched targeted pilots and iterated with customer feedback loops." },
    ],
    features: [
      { title: "Savings Opportunity Detection", body: "Models identify overspend patterns and prioritize high-value actions." },
      { title: "Decision Support Workflows", body: "Recommendations are paired with context, confidence, and expected impact." },
      { title: "Performance Tracking", body: "Dashboards connect optimization actions to measurable savings outcomes." },
    ],
    challenges: [
      {
        challenge: "Data quality varied significantly across customer environments.",
        solution: "Designed resilient ingestion rules and confidence thresholds.",
        outcome: "Maintained recommendation quality while scaling across accounts.",
      },
    ],
    results: [
      "Demonstrated multi-million-dollar savings potential across key customer segments.",
      "Improved stakeholder confidence in AI-assisted freight decisions.",
    ],
    stack: {
      frontend: ["Next.js", "React"],
      backend: ["Data pipelines", "Recommendation services"],
      tooling: ["Figma", "Analytics dashboards", "Customer pilot frameworks"],
    },
    nextSteps: [
      "Expand optimization models to additional spend categories.",
      "Increase automation for recurring high-confidence actions.",
    ],
  },

  {
    slug: "inventory-part-management",
    title: "Inventory & Part Management",
    medium: "Workflow Optimization",
    description: "Streamlining the most time inefficient part of a technician's workflow.",
    span: "col-span-1 row-span-1",
    status: "Shipped",
    timeline: "9 months",
    role: "Product Leadership",
    team: "Product, Design, Engineering, Field Ops",
    heroLine: "Streamlining the most time inefficient part of a technician's workflow.",
    overview:
      "This project focused on reducing technician downtime caused by fragmented inventory lookup, part availability uncertainty, and manual request processes.",
    problem:
      "Technicians were losing high-value time searching for parts across disconnected systems, delaying repairs and increasing repeat site visits.",
    goal:
      "Design and deliver an end-to-end part management experience that speeds up lookup, improves confidence in availability, and shortens repair cycles.",
    contribution: [
      "Defined product vision and success metrics",
      "Prioritized technician-first workflows with operations stakeholders",
      "Led execution sequencing across multiple teams",
      "Drove adoption strategy with field enablement",
    ],
    process: [
      { title: "Field Research", body: "Mapped technician pain points from dispatch to completion." },
      { title: "Workflow Redesign", body: "Created unified part search, reservation, and request flows." },
      { title: "Rollout", body: "Released incrementally with training and operational feedback loops." },
    ],
    features: [
      { title: "Unified Part Search", body: "Single search surface for local, regional, and vendor inventory." },
      { title: "Availability Confidence", body: "Clear stock status and fulfillment timing reduce guesswork." },
      { title: "Technician Queue Tools", body: "Batch request and part-kit workflows reduce repetitive actions." },
    ],
    challenges: [
      {
        challenge: "Inventory data consistency varied by source system.",
        solution: "Introduced normalization and confidence indicators at point of use.",
        outcome: "Improved trust in displayed availability for field decisions.",
      },
    ],
    results: [
      "Reduced time spent on parts-related tasks within technician workflows.",
      "Improved repair throughput by minimizing parts-related delays.",
    ],
    stack: {
      frontend: ["Next.js", "React"],
      backend: ["Inventory APIs", "Parts orchestration services"],
      tooling: ["Figma", "Analytics", "Field pilot playbooks"],
    },
    nextSteps: [
      "Expand predictive part recommendations by job type.",
      "Integrate automated replenishment signals for high-velocity items.",
    ],
  },

]

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}
