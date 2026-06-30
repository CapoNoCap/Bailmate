# BailMate Database Schema

This diagram illustrates the core database relationships.

```mermaid
erDiagram

CUSTOMERS ||--o{ BAIL_REQUESTS : creates
PROVIDERS ||--o{ BAIL_REQUESTS : accepts
BAIL_REQUESTS ||--o{ NOTIFICATIONS : generates

CUSTOMERS {
    uuid id
    string first_name
    string last_name
    string phone
}

PROVIDERS {
    uuid id
    string company_name
    string phone
    string email
    string city
    string state
    float latitude
    float longitude
    boolean active
}

BAIL_REQUESTS {
    uuid id
    uuid customer_id
    uuid provider_id
    decimal bond_amount
    string jail
    string status
    datetime created_at
}

NOTIFICATIONS {
    uuid id
    uuid request_id
    string type
    boolean delivered
    datetime sent_at
}
```

## Tables

### Customers
Stores customer information requesting bail assistance.

### Providers
Licensed bail bond companies available within the marketplace.

### Bail Requests
Tracks every request submitted through the application.

### Notifications
Tracks SMS and Push Notification delivery.