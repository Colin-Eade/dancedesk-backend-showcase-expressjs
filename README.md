<div align="center">

<img src="dancedesk_wordmark_logo.png" alt="DanceDesk Wordmark" width="400">

# DanceDesk Backend API

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

## Project Overview

DanceDesk was conceived as a solution for dance studio management, developed as an [award-winning capstone project](https://www.linkedin.com/posts/colin-eade_three-years-of-studies-and-a-demanding-final-activity-7315047905411706881-9pvH) I significantly contributed to at Durham College. This repository specifically showcases the backend API – the portion I architected and built. As a headless backend, it provides the services for the DanceDesk React SPA (not showcased here), powering key functionalities like its scheduling system, user management, and core business operations.

This iteration of DanceDesk represents a significant milestone achieved by our team within the timeframe of the final academic semester. It successfully demonstrates core functionalities and a robust architecture. While the project forms a strong foundation, further development and refinement would be needed to evolve it into a fully-fledged application.

### 🏆 Award-Winning Project

DanceDesk, which this API serves, received multiple accolades at the Durham College IT Student Expo 2025:

- **Best In Show** (tied)
- **Best In Class** (tied)
- **Best Booth**

## Key API Features

### Scheduling Engine

- **Conflict Detection:** Endpoints ensure rooms, teachers, and dancers are not double-booked and prevent enrollment in overlapping classes.
- **Recurring Event Generation:** API logic to automatically create recurring class instances based on defined schedules.

### Multi-tenant Architecture Support

- **Data Isolation:** API design ensures that data for different dance studio organizations is segregated at the database level.

### Comprehensive & Secure Endpoints

- **Authentication and Authorization:** Leverages AWS Cognito for secure user management, with JWTs protecting API routes.
- **Full CRUD Operations:** Provides complete and well-structured endpoints for all core entities (classes, events, members, rooms, etc.).
- **Transactional Integrity:** Employs transaction-based operations where necessary to maintain data consistency across related database operations.
- **Validation & Error Handling:** Input validation for incoming requests and consistent, informative error responses.

## Technology Stack

### Core Backend

- **Node.js** with the **Express.js** framework
- **TypeScript** for static typing, enhanced code quality, and maintainability
- **RESTful API** architecture adhering to industry best practices

### Database & Data Access

- **PostgreSQL** chosen for relational data storage
- **Prisma ORM** utilized for type-safe database interactions and streamlined query building
- Transaction support to ensure data integrity

### Authentication & Security

- **AWS Cognito** integrated for secure and scalable user identity management
- **JWT (JSON Web Token)** based authentication for stateless and secure API access
- **Zod** implemented for validation on API endpoints
- **CORS** configured to manage secure cross-origin requests

### Cloud Architecture & DevOps (for the Deployed API)

- **AWS ECS with Fargate** as the container orchestration service for scalable deployment
- **Automated CI/CD pipeline** established with **GitHub Actions** and **AWS CodeBuild**
- **AWS ECR** for private Docker container image storage
- **RDS PostgreSQL** instance providing the production database backend
- **Multi-AZ configuration** with load balancing for high availability and fault tolerance
- **Route 53** for DNS management and routing

## API Architecture

The application adheres to a clean architecture philosophy, promoting a clear separation of concerns and modularity:

### Three-Tier Logical Architecture

1.  **Controllers:** Interface with incoming HTTP requests, handle request validation, and orchestrate responses.
2.  **Services:** Encapsulate the core business logic, coordinating operations and interacting with data access layers.
3.  **Data Access Layer:** Manages all database interactions, primarily through the Prisma ORM, abstracting database operations from services.

### Project Structure (Illustrative)

```text
src/
├── config/          # Application configuration (env vars, constants)
├── errors/          # Custom error handling classes and utilities
├── features/        # Domain-specific feature modules
│   ├── auth/        # Authentication, authorization, user sessions
│   ├── classes/     # Class creation, scheduling, management
│   ├── events/      # Calendar event logic
│   ├── locations/   # Physical studio locations
│   ├── members/     # User profiles (teachers, dancers, admins)
│   ├── rooms/       # Room booking and management
│   └── seasons/     # Seasonal scheduling and planning
├── middleware/      # Custom Express middleware (e.g., auth, error handling)
├── router/          # API route definitions and request routing
└── types/           # Shared TypeScript type definitions and interfaces
```

## Key Contributions & Ownership

As the backend developer and cloud architect for the DanceDesk team project, I took sole responsibility for the entire lifecycle of the API and its cloud infrastructure:

### Backend API Development

- Designed and built the complete RESTful API, defining its structure including routing, controllers, services, and data access layers.
- Translated business requirements into an optimized PostgreSQL database schema, focusing on performance and data integrity.
- Developed core features such as the conflict-detecting scheduling system and integrated event management.
- Engineered the user authentication and authorization system using AWS Cognito for secure access.
- Implemented server-side input validation with Zod and a standardized error handling framework.

### DevOps and Cloud Infrastructure

- Took full ownership of the AWS cloud environment, managing all aspects from initial setup and IAM to resource deployment.
- Configured and managed the production RDS PostgreSQL database.
- Implemented backend containerization using Docker.
- Designed and built the automated CI/CD pipeline (GitHub Actions, AWS CodeBuild, AWS ECR, ECS with Fargate) based on AWS Well-Architected principles.

### Local Development Operations

- Established the team's local backend development environment, including Dockerized database setups.
- Managed database migrations, schema updates, and seeding throughout the project.

## Lessons Learned

Key takeaways include:

- The importance of deeply understanding the domain and business rules before writing code.
- The inherent difficulty in accurately estimating development timelines for features with multifaceted logic.
- The importance of clear communication and defined responsibilities in a team environment, especially when integrating frontend and backend components.

This capstone project was instrumental in solidifying my skills across the full development lifecycle, from database design and API implementation to cloud deployment and DevOps practices. It has significantly bolstered my confidence in tackling real-world software engineering challenges.

---

**Note on Running the API:**
This project was developed as an academic capstone and relies on AWS and specific environment configurations for full functionality. As such, direct local execution of the complete, connected system from this repository alone is complex and not intended for a quick setup. **The code is primarily provided for review of its architecture, logic, design patterns, and best practices employed in building the backend.**

_Some identifiers and configurations have been generalized for this public portfolio presentation._
