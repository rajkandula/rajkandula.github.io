---
layout: archive
title: "Experience"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Contact
======
* **Email:** [kandulacharanraj@gmail.com](mailto:kandulacharanraj@gmail.com)
* **Location:** Jersey City, NJ
* **Phone:** +1 (551) 256-0939
* **LinkedIn:** [linkedin.com/in/kandula-charan-raj](https://www.linkedin.com/in/kandula-charan-raj)
* **GitHub:** [github.com/rajkandula](https://github.com/rajkandula)
* **Website:** [charan-raj-kandula.com](https://charan-raj-kandula.com)

Summary
======
Full-stack engineer with 5+ years designing and shipping production AI SaaS platforms end to end: React/Next.js and TypeScript frontends, Node.js/Python microservices, and LLM agent infrastructure on GCP and Cloudflare. Owns systems from architecture through deployment, including multi-tenant auth, payments, and serverless, event-driven backends. Focused on scalable system design, distributed systems, and secure AI-agent tooling (MCP).

Skills
======
* **Languages & Frameworks:** JavaScript, TypeScript, Python, React, Next.js, Node.js, Electron, REST APIs
* **Cloud & Data:** Google Cloud Platform, Cloudflare (Workers, D1, R2, KV, Vectorize), MongoDB, PostgreSQL, Docker, Serverless, CI/CD
* **AI & Systems:** LLM integration, multi-agent systems, MCP, vector search, system design, microservices, event-driven architecture (Kafka, webhooks), OAuth2, RBAC, Stripe payments

Experience
======
* **Full Stack Engineer — Harakumo, New York, NY** _(Nov 2024 – Present)_
  * Own end-to-end delivery of full-stack features in Next.js/TypeScript on serverless Cloudflare Workers, spanning D1, R2, KV, Vectorize, and Stream, from design through production deployment.
  * Designed and built the platform's multi-tenant authentication and authorization layer: organization-level RBAC, API keys, and email OTP verification.
  * Implemented Stripe billing end to end: subscriptions, Connect marketplace payouts, and webhook processing for payment lifecycle events.
  * Shipped the public developer platform (SDK, CLI, REST API, and documentation) for external partner integrations.
  * Built core AI platform features running in production: an AI gateway, agents, and vector/memory stores.
* **Senior Software Engineer — Emberleaf Books, New York City Metro** _(Jun 2023 – Oct 2024)_
  * Architected and shipped production AI SaaS features across the full stack (Next.js, React, Node.js, Python), owning system design from UI through backend services.
  * Designed the multi-agent LLM orchestration pipelines behind the product's AI-assisted content generation in production.
  * Built scalable backend microservices with MongoDB on GCP, using Cloudflare for global caching and edge delivery.
  * Led cross-platform expansion from web to desktop (Electron, macOS/Windows), reusing shared REST APIs and backend schemas for consistent behavior across platforms.
* **Software Engineer Intern — BibleWrite, New Jersey** _(Jan 2023 – May 2023)_
  * Built Python and Node.js middleware integrating LLM APIs into production features, with React components streaming model responses in real time.
  * Implemented request caching and payload optimization to manage API rate limits and reduce token usage.
* **Graduate Research Assistant (AI/ML) — Stevens Institute of Technology, Hoboken, NJ** _(Jan 2022 – May 2022)_
  * Built Python data-processing pipelines and benchmarked classical ML vs. transformer models on standard NLP benchmarks, measuring accuracy and latency trade-offs.
* **Software Engineer (Intern to Full-Time) — Chanova Labs, Hyderabad, India** _(Jan 2019 – Dec 2021)_
  * Shipped full-stack features across multiple client projects using React, Node.js, and Python REST APIs with PostgreSQL, including third-party payment integrations, deployed to GCP via CI/CD.
  * Converted from intern to full-time after building consumer-facing Android interfaces from Figma wireframes, writing unit tests, and fixing cross-device rendering bugs on an agile team.

Education
======
* **M.S., Computer Science** — Stevens Institute of Technology, Hoboken, NJ _(Jan 2022 – May 2023)_
* **B.Tech, Computer Science** — Mahatma Gandhi Institute of Technology, Hyderabad, India _(Jun 2016 – Oct 2020)_

Projects
======
* **MCP Security Gateway: Zero-Trust Access Control for LLM Agents** — Python (FastAPI), Docker, Kafka, OAuth2. Centralized MCP proxy enforcing RBAC and OAuth2 scope verification on LLM-agent tool calls, with sandboxed code execution in ephemeral Docker containers and Kafka-based, event-driven audit logging for agent workflows.
* **Job Application Tracker** — Next.js, TypeScript, Tailwind, RHF, Zod, TanStack Query. Pipeline statuses, filters/sort, CSV export, Server Actions for create/update, optimistic UI, keyboard shortcuts, light/dark mode, local caching of filters.
* **Personal Finance Tracker** — Next.js, TypeScript, Tailwind, Node/Express, MongoDB, TanStack Query. Budgets, categories, recurring expenses, CSV import/export, charts, validation, optimistic updates, pagination, JWT auth, role-based access.
* **Notes & Kanban** — React, Node, Express, MongoDB, JWT, Drag & Drop. Boards → Columns → Cards, labels, search, pagination, auth with role-based access, rate limiting, tests, admin metrics.
* **Learning Management System** — Node.js, Express, Handlebars, MongoDB, GridFS. Led a team of 6 serving 500+ students; built REST backend, file storage, responsive UI with micro-interactions, executed ETL for student data.
* **Solar Construction Portal** — Express.js, MongoDB, HTML/CSS/JS. End-to-end portal for a 100+ employee firm; relational-style schema streamlined team handoffs; improved page load speed by ~25%.
* **Community Management Platform** — Node.js, Bootstrap, MongoDB. Admin dashboard for content/events/users; role-based access, moderation tools, templated announcements (SPA).
* **Personal Productivity Manager** — React, Node, MongoDB. Notes, tasks, and schedules with AI suggestions; micro-frontend architecture; habit tracking and analytics dashboards.
* **Medical Records Wallet** — MERN + object storage. Patient uploads, OCR search, shareable time-limited links, audit logs, encryption-at-rest, role-based access (HIPAA-aware design).
* **AI Video Generation Pipeline** — Python, OpenAI, MoviePy, GCP. Automated documentary-style videos: narration (GPT/TTS), subtitles (Whisper), stitching, GCS storage, CI for reliability.
* **ComicCraft** — Next.js, Node, MongoDB, GCP/Vercel. Auth, credits/payments, OpenAI/DALL·E image synthesis, CI/CD with GitHub Actions, deployed on Cloud Run + Vercel.
* **University Android App** — Java, Firebase, Material Design. Resume builder, GPA calculator, cloud doc storage; 10K+ installs, 4.5⭐ rating; ~50% engagement lift through UX polish and crash fixes.

Leadership & Certifications
======
* Project management: managed two Agile dev teams; improved delivery throughput by ~30%.
* Certifications: Java, Python, React, Angular, Android App Development.

Publications
======
  <ul>{% for post in site.publications %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
