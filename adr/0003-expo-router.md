# ADR-0003: Use Expo Router

## Status

Accepted

## Context

BailMate requires a clean navigation structure across customer flows, provider dashboards, lead pages, and future authentication screens.

## Decision

Use Expo Router for file-based navigation.

## Rationale

Expo Router makes navigation easier to understand by mapping routes directly to files in the project structure.

## Tradeoffs

File-based routing requires disciplined folder organization as the app grows.

## Future Improvements

As BailMate matures, routes may be grouped by user role, such as customer, provider, attorney, and admin.