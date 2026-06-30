# BailMate Database Design

## Overview

BailMate uses Supabase (PostgreSQL) as its primary data platform.

The schema is designed to support provider discovery, customer requests, lead management, analytics, and future AI services.

---

# Tables

## Providers

Stores licensed bail bond companies.

Fields:

- id
- company_name
- phone
- email
- address
- city
- state
- latitude
- longitude
- rating
- active
- created_at

---

## Customers

Stores customer information.

Fields:

- id
- first_name
- last_name
- phone
- email

---

## Bail Requests

Stores every incoming request.

Fields:

- id
- customer_id
- provider_id
- jail
- county
- bond_amount
- charge
- status
- created_at

Status values:

- Pending
- Contacted
- Closed
- Expired

---

## Notifications

Tracks SMS and push notifications.

Fields:

- id
- request_id
- provider_id
- notification_type
- delivered
- opened
- responded
- timestamp

---

## Analytics

Aggregated metrics.

Fields:

- daily_requests
- acceptance_rate
- average_response_time
- provider_rank

---

# Future AI Tables

## AI Recommendations

Stores recommendation history.

## AI Conversations

Stores summarized conversations.

## AI Predictions

Stores predicted acceptance scores.

## AI Audit Log

Stores AI decision explanations.