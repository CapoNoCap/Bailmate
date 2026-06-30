# BailMate Provider Workflow

```mermaid
flowchart TD
    A[Provider receives new lead]
    B[Reviews request details]
    C{Accept lead?}
    D[Contact customer]
    E[Move to contacted leads]
    F[Close deal]
    G[Move to monitored clients]
    H[Decline / Ignore]
    I[Request becomes available to other providers]

    A --> B
    B --> C
    C -->|Yes| D
    D --> E
    E --> F
    F --> G
    C -->|No| H
    H --> I
    ```
    ## Summary

This workflow illustrates the complete provider lifecycle within BailMate—from receiving a new lead, reviewing the request, contacting the customer, closing the deal, and ultimately monitoring the client. If a provider declines the request, the system automatically releases it to other providers to maximize customer response time.
