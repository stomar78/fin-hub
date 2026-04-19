# Project Planner — EGF Free Tools Hub

## 1. Timeline Overview
| Phase | Duration | Start | End | Goal |
| --- | --- | --- | --- | --- |
| Discovery & Setup | 1 week | TBD | TBD | Finalise requirements, confirm infrastructure, align stakeholders. |
| Phase 1 Build | 3 weeks | TBD | TBD | Launch landing page, core tools, lead intake API, SES emails. |
| Phase 2 Automation | 2 weeks | TBD | TBD | Deploy AI-enabled email responder, CRM sync, analytics improvements. |
| Phase 3 Expansion | 3 weeks | TBD | TBD | Add additional calculators, dashboards, multilingual support. |

## 2. Workstreams & Tasks
### 2.1 Product & Content
- Approve landing page messaging and hero copy.
- Provide tool-specific questions, validation rules, and assessment criteria.
- Draft email templates for acknowledgement and advisory responses.

### 2.2 Design & Brand
- Map brand components (`.card`, `.btn-primary`, `.btn-secondary`, `.chip`, `.app-header`, `.app-footer`) to reusable components per `global.css.example`. @global.css.example#27-140
- Define responsive layouts and typography hierarchy using Tailwind theme tokens from `taliwind.config.ts.example`. @taliwind.config.ts.example#9-59
- Prepare assets (icons, illustrations) consistent with EGF guidelines.

### 2.3 Engineering
- Scaffold Next.js project with App Router, TypeScript, mandated CSS imports.
- Implement `/free-tools` landing page matching documented content structure.
- Build tool routes (`/tools/<slug>`) with form components and submission handling.
- Create `/api/leads` endpoint, assessment generator, and SES mailer integration.
- Configure database migrations and deployment pipeline.

### 2.4 Automation & AI
- Set up IMAP listener workflow (n8n or custom worker) for `ktomar@epiidosisglobalfin.com`.
- Implement AI prompt templates leveraging lead payload + assessment + email history.
- Define escalation rules when AI confidence is low.
- Integrate outbound SES SMTP sending with thread-aware headers.

### 2.5 Infrastructure & Security
- Provision Postgres/MySQL database with encrypted storage.
- Configure environment variables via `.env` (based on `.env.example`) and secure secret management.
- Set up subdomain DNS, TLS certificate, and reverse proxy routing.
- Establish logging, monitoring, and backup strategy for application and database.

## 3. Dependencies & Prerequisites
- **Credentials:** AWS SES SMTP, IMAP mailbox, OpenAI API key (or equivalent provider).
- **Server Access:** SSH credentials for deployment target.
- **Compliance Sign-off:** Consent language, privacy policy updates, data retention policy.
- **Content Input:** Sector-specific tool questions, scoring heuristics, follow-up email tone.

## 4. Milestones & Acceptance Criteria
| Milestone | Acceptance Criteria | Owner |
| --- | --- | --- |
| M1 – Landing Page Ready | `/free-tools` accessible locally with final copy, responsive layout, analytics tag. | Engineering Lead |
| M2 – Lead Intake & Email | Tool form submission persists to DB, sends SES emails, returns success response. | Engineering Lead |
| M3 – AI Email Workflow | IMAP listener processes inbound mail, AI responds with approved tone, logs thread. | AI Automation Lead |
| M4 – Phase 1 Launch | Production deployment live on subdomain with monitoring enabled, internal demo completed. | Product Owner |

## 5. Stakeholder Checkpoints
- **Weekly Sync:** Review progress vs planner, unblock dependencies, update timeline.
- **Phase Gate Reviews:** End of each phase to assess readiness for next stage.
- **Post-Launch Retro:** Evaluate performance metrics, decide on prioritisation for Phase 3 items.

## 6. Communication Plan
- **Primary Channel:** Slack/Teams project channel for daily coordination.
- **Status Updates:** Bi-weekly written summary referencing progress tracker.
- **Escalations:** Critical blockers escalated directly to Product Owner within 24 hours.

## 7. Risks & Mitigation
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Delays in AI workflow setup | Slower follow-up response times | Start IMAP/SES integration early, maintain manual fallback process. |
| SES sending limits | Email throttling or bounce issues | Pre-approve domain with AWS, request quota increase, monitor SES dashboards. |
| Data privacy compliance | Regulatory penalties | Review consent language, encrypt sensitive data, maintain access logs. |

## 8. Deliverable Artifacts
- `PROJECT_DOCUMENTATION.md` — comprehensive system and architecture reference.
- `PROJECT_PLANNER.md` — this planning document.
- `PROJECT_PROGRESS_TRACKER.md` — operational status log (see tracker file).
- Future deliverables: deployment scripts, admin dashboard designs, AI prompt library.
