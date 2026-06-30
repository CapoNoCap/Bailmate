# ADR-0002: Use Supabase

## Status

Accepted

## Context

BailMate requires authentication, a relational database, realtime updates, and serverless backend logic without the overhead of managing full infrastructure during MVP development.

## Decision

Use Supabase as the primary backend platform.

## Rationale

Supabase provides PostgreSQL, authentication, realtime subscriptions, storage, and Edge Functions in a unified developer-friendly platform.

## Tradeoffs

Supabase creates some platform dependency. Future growth may require abstraction layers to support migration or multi-cloud deployment.

## Future Improvements

As BailMate scales, backend services may be separated into dedicated APIs, queues, and AI services.# ADR-0002: Use Supabase

## Status

Accepted

## Context

BailMate requires authentication, a relational database, realtime updates, and serverless backend logic without the overhead of managing full infrastructure during MVP development.

## Decision

Use Supabase as the primary backend platform.

## Rationale

Supabase provides PostgreSQL, authentication, realtime subscriptions, storage, and Edge Functions in a unified developer-friendly platform.

## Tradeoffs

Supabase creates some platform dependency. Future growth may require abstraction layers to support migration or multi-cloud deployment.

## Future Improvements

As BailMate scales, backend services may be separated into dedicated APIs, queues, and AI services.