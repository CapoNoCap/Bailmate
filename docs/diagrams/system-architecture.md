# BailMate System Architecture

This diagram illustrates the high-level architecture of BailMate.

```mermaid
flowchart TD

A[Customer Mobile App]

B[React Native / Expo]

C[Supabase]

D[(PostgreSQL Database)]

E[Authentication]

F[Realtime]

G[Edge Functions]

H[SMS Notifications]

I[Push Notifications]

J[Provider Dashboard]

K[Future AI Engine]

A --> B

B --> C

C --> D
C --> E
C --> F
C --> G

G --> H
G --> I

J --> C

K --> C

K --> J
```

## Components

### Mobile Application
- React Native
- Expo Router
- TypeScript

### Backend
- Supabase
- PostgreSQL
- Edge Functions

### Communication
- SMS Notifications
- Push Notifications

### Future AI Layer
- Provider Ranking
- Intelligent Dispatch
- Fraud Detection
- Predictive Analytics