# ADR-0001: Monorepo Structure

## Status
Proposed

## Context
Multiple services (API, frontend) and a shared engine package require coordination and shared CI.

## Decision
Adopt a monorepo with the following top-level layout:
- apps/api
- apps/frontend
- packages/epiidosis_valuation
- infra
- docs

## Consequences
- Simplified dependency management and shared CI.
- Requires codeowners and CI matrix to avoid cross-impact.
