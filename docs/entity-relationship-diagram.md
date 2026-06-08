# Entity Relationship Diagram (ERD) Overview

This document provides a comprehensive overview of all database entities and their relationships in the **Qr invite be** backend architecture.

## Entities Summary

| Entity           | Table (DynamoDB) | Primary Key            | Description                                                                                                                                                                  |
| ------------------| ------------------| ------------------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **User**         | `User`           | `id`                   | Core user profile. Contains personal data (`gender`, `birth_date`, `occupation`), authentication info, and a list of stores (`store_ids`) the user is affiliated with.       |
| **Store**        | `Store`          | `id`                   | Represents a business entity/store. Contains settings like `default_commission`, `extra_bonus`, and tracks `collaborator_ids`.                                               |
| **StoreUser**    | `StoreUser`      | `store_id` + `user_id` | Association between **User** and **Store**. Stores role, verification, and duplicated user data (`name`, `avatar`, `gender`, `birth_date`, `occupation`) for fast retrieval. |
| **Admin**        | `Admin`          | `id`                   | Admin account for a specific **Store** (`store_id`).                                                                                                                         |
| **PaymentInfo**  | `PaymentInfo`    | `id` (= `user_id`)     | Stores payment details (bank, account number, QR) for a **User**. One-to-one mapping using the user's ID as the primary key.                                                 |
| **Service**      | `Service`        | `id`                   | Represents a product/service offered by a **Store** (`store_id`). Includes `points_value` and `monetary_value`.                                                              |
| **CheckIn**      | `CheckIn`        | `id`                   | Logs a check-in event linking a **User** (`user_id`) to a **Store** (`store_id`) at a specific `timestamp`.                                                                  |
| **Request**      | `Request`        | `id`                   | Action request (e.g., `REGISTER`, `WITHDRAW`) made by a **User** (`user_id`) optionally targeting a **Store** (`store_id`).                                                  |
| **PointHistory** | `PointHistory`   | `id`                   | Record of point transactions (rewards, withdrawals) for a **User** (`user_id`) at a **Store** (`store_id`).                                                                  |

## Relationships Details

### 1. User & Store Operations (Core M-N Relationship)
- **User ↔ StoreUser ↔ Store**
  - A **User** can be affiliated with multiple **Stores** (stored in `User.store_ids`).
  - A **Store** can have multiple **Users** (collaborators) (stored in `Store.collaborator_ids`).
  - **StoreUser** acts as the pivot/junction table, storing contextual data (e.g., role, verified status) and duplicating user profile details to prevent cross-table lookups.

### 2. User & Payment details (1-1 Relationship)
- **User ↔ PaymentInfo**
  - Every **PaymentInfo** record corresponds strictly to one **User**.
  - The `PaymentInfo.id` field matches the `User.id` exactly.

### 3. Store Administration (1-N Relationship)
- **Store ↔ Admin**
  - A **Store** can have multiple **Admin** accounts (or just one).
  - Each **Admin** belongs to one **Store** (`store_id`).

### 4. Store Assets (1-N Relationship)
- **Store ↔ Service**
  - A **Store** offers multiple **Services**.
  - Each **Service** references the store via `store_id`.

### 5. Activity & Transactions (1-N Relationships)
- **User/Store ↔ CheckIn**
  - A **CheckIn** links both `user_id` and `store_id`.
- **User/Store ↔ PointHistory**
  - Every point change (addition/deduction) references the affected `user_id` and the context `store_id`.
- **User/Store ↔ Request**
  - Registration requests link `user_id` and multiple stores (via body/payload).
  - Withdrawal requests link `user_id` and a specific `store_id`.

## Complete Diagram (ASCII)

```text
                     ┌───────────────────┐               ┌──────────────────┐
                     │    PaymentInfo    │               │      Admin       │
                     │  id (= user_id)   │               │   id (PK)        │
                     └─────────▲─────────┘               │   store_id ──────┼─────┐
                               │ 1:1                     └──────────────────┘     │
                               │                                                  │
┌──────────────────┐           │            ┌──────────────────┐                  │
│       User       ├───────────┘            │      Store       │◄─────────────────┤
│  id (PK)         │                        │  id (PK)         │                  │
│  store_ids[]     ├─────┐                  │  collaborators[] ├─────┐            │
│  gender          │     │                  └─────────▲────────┘     │            │
│  birth_date      │     │                            │              │            │
│  occupation      │     │      ┌──────────────────┐  │              │            │
└───────┬──────────┘     │      │    StoreUser     │  │              │            │
        │                └─────►│  store_id (PK1)  ├──┘              │            │
        │                       │  user_id (PK2)   │                 │            │
        │                       │  gender...       │                 │            │
        │                       └──────────────────┘                 │            │
        │                                                            │            │
        │        ┌──────────────────┐                                │            │
        ├───────►│     CheckIn      │◄───────────────────────────────┤            │
        │        │  user_id         │                                │            │
        │        │  store_id        │                                │            │
        │        └──────────────────┘                                │            │
        │                                                            │            │
        │        ┌──────────────────┐                                │            │
        ├───────►│     Request      │◄───────────────────────────────┤            │
        │        │  user_id         │                                │            │
        │        │  store_id        │                                │            │
        │        └──────────────────┘                                │            │
        │                                                            │            │
        │        ┌──────────────────┐                                │            │
        ├───────►│   PointHistory   │◄───────────────────────────────┤            │
        │        │  user_id         │                                │            │
        │        │  store_id        │                                │            │
        │        └──────────────────┘                                │            │
        │                                                            │            │
        │                                                            │            │
        │                                       ┌──────────────────┐ │            │
        └───────────────────────────────────────┤     Service      ├─┘            │
                                                │  id (PK)         │              │
                                                │  store_id        │              │
                                                └──────────────────┘              │
```

## DynamoDB Specifics
- No explicit foreign keys or `JOIN` operations exist in DynamoDB. Relations are maintained logically at the application layer using standard secondary index lookups or parallel fetching.
- **StoreUser** acts as an optimized projection (denormalization) of User and Store data to avoid heavy scatter-gather queries when fetching members of a store.