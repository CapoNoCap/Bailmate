# BailMate Request Flow

This diagram shows how a customer bail assistance request moves through the system.

```mermaid
sequenceDiagram
    participant C as Customer
    participant App as BailMate App
    participant DB as Supabase Database
    participant SMS as SMS Service
    participant P as Provider

    C->>App: Submit bail assistance request
    App->>DB: Create bail request record
    DB->>SMS: Trigger provider notification
    SMS->>P: Send new lead alert
    P->>App: View lead details
    P->>DB: Update request status
    DB->>App: Sync latest status
    App->>C: Show confirmation / status update