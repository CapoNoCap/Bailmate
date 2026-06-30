# ADR-0001: Use React Native

## Status

Accepted

## Context

BailMate needs to support mobile users in urgent, real-world situations. The app must work well on both iOS and Android while allowing fast MVP development.

## Decision

Use React Native as the primary mobile framework.

## Rationale

React Native allows BailMate to share one codebase across iOS and Android while still delivering a native mobile experience.

## Tradeoffs

React Native may require native configuration for advanced features like push notifications, maps, and background services.

## Future Improvements

As BailMate matures, native modules may be added for performance-sensitive features.