# BailMate API Design

## Overview

BailMate uses Supabase, PostgreSQL, and Edge Functions to support real-time provider discovery, lead routing, notifications, and future AI services.

## Core Endpoints

### GET /providers

Returns active bail bond providers based on location.

### POST /request-help

Creates a new bail assistance request.

### POST /notifications/sms

Sends an SMS notification to a provider.

### GET /leads/new

Returns new incoming leads for a provider.

### GET /leads/contacted

Returns contacted leads.

### GET /leads/closed

Returns closed deals.

### GET /clients/monitored

Returns monitored clients.

## Future AI Endpoints

### POST /ai/recommend-provider

Recommends the best provider based on distance, availability, response history, and acceptance likelihood.

### POST /ai/summarize-lead

Summarizes incoming request details into a structured lead summary.

### POST /ai/detect-duplicate

Checks whether a new request appears to duplicate a prior request.

### POST /ai/draft-follow-up

Drafts a provider follow-up message.

## API Design Principles

- Fast response times
- Clear error handling
- Secure provider access
- Human-in-the-loop AI recommendations
- Privacy-first data handling# BailMate API Design

## Overview

BailMate uses Supabase, PostgreSQL, and Edge Functions to support real-time provider discovery, lead routing, notifications, and future AI services.

## Core Endpoints

### GET /providers

Returns active bail bond providers based on location.

### POST /request-help

Creates a new bail assistance request.

### POST /notifications/sms

Sends an SMS notification to a provider.

### GET /leads/new

Returns new incoming leads for a provider.

### GET /leads/contacted

Returns contacted leads.

### GET /leads/closed

Returns closed deals.

### GET /clients/monitored

Returns monitored clients.

## Future AI Endpoints

### POST /ai/recommend-provider

Recommends the best provider based on distance, availability, response history, and acceptance likelihood.

### POST /ai/summarize-lead

Summarizes incoming request details into a structured lead summary.

### POST /ai/detect-duplicate

Checks whether a new request appears to duplicate a prior request.

### POST /ai/draft-follow-up

Drafts a provider follow-up message.

## API Design Principles

- Fast response times
- Clear error handling
- Secure provider access
- Human-in-the-loop AI recommendations
- Privacy-first data handling