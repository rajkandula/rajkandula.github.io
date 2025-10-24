---
title: "Personal Finance Tracker"
excerpt: "Full-stack budgeting app with recurring expenses, charts, and role-based auth.<br/><img src='/images/500x300.png' alt='Personal Finance Tracker UI placeholder'>"
collection: portfolio
---

A personal finance dashboard built with Next.js, Node/Express, and MongoDB that keeps budgets, recurring expenses, and cashflow insights in sync.

* Modeled categories, recurring rules, and CSV import/export to accelerate onboarding from existing spreadsheets.
* Used TanStack Query for cache-aware data fetching and optimistic mutations, keeping UI latency low even on slow networks.
* Hardened the API with JWT auth, granular roles, rate limiting, and integration tests on critical payout flows.
* Delivered responsive charts (Recharts + accessible SVG fallbacks) to visualize spend by month and category.
