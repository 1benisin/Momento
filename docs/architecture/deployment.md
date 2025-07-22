# Deployment & Infrastructure

This document outlines the complete deployment strategy, infrastructure configuration, and operational procedures for the Momento platform.

## Table of Contents

- [Deployment Overview](#deployment-overview)
- [Environment Configuration](#environment-configuration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Infrastructure as Code](#infrastructure-as-code)
- [Database Management](#database-management)
- [Monitoring & Alerting](#monitoring--alerting)
- [Security & Compliance](#security--compliance)
- [Disaster Recovery](#disaster-recovery)
- [Performance Optimization](#performance-optimization)
- [Scaling Strategy](#scaling-strategy)

---

## Deployment Overview

Momento uses a **multi-environment deployment strategy** with automated CI/CD pipelines, infrastructure as code, and comprehensive monitoring. Our deployment approach prioritizes reliability, security, and rapid iteration.

### Deployment Principles

- **Infrastructure as Code**: All infrastructure defined in code for consistency and version control
- **Automated Deployment**: Zero-downtime deployments with automated rollback capabilities
- **Environment Parity**: Development, staging, and production environments are as similar as possible
- **Security First**: All deployments follow security best practices and compliance requirements
- **Monitoring Driven**: Comprehensive monitoring and alerting for all deployed services

### Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│                 │    │                 │    │                 │
│ • Local Dev     │    │ • Pre-prod      │    │ • Live Users    │
│ • Feature Tests │    │ • Integration   │    │ • Real Data     │
│ • Unit Tests    │    │ • UAT           │    │ • Monitoring    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   CI/CD Pipeline │
                    │                 │
                    │ • Automated     │
                    │ • Tested        │
                    │ • Monitored     │
                    └─────────────────┘
```

---

## Environment Configuration

### Environment Variables

#### Production Environment

```bash
# Application
NODE_ENV=production
FRONTEND_URL=https://app.momento.com
API_URL=https://api.momento.com

# Database
CONVEX_DEPLOY_KEY=your_convex_deploy_key
CONVEX_URL=https://your-project.convex.cloud

# Authentication
CLERK_SECRET_KEY=sk_live_...
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_JWT_ISSUER=https://clerk.momento.com

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_ACCOUNT_ID=acct_...

# Email
POSTMARK_API_KEY=your_postmark_api_key
POSTMARK_FROM_EMAIL=noreply@momento.com

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
DATADOG_API_KEY=your_datadog_key

# Security
ENCRYPTION_KEY=your_encryption_key
JWT_SECRET=your_jwt_secret
```

#### Staging Environment

```bash
# Application
NODE_ENV=staging
FRONTEND_URL=https://staging.momento.com
API_URL=https://staging-api.momento.com

# Database
CONVEX_DEPLOY_KEY=your_staging_convex_key
CONVEX_URL=https://your-staging-project.convex.cloud

# Authentication
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_JWT_ISSUER=https://staging-clerk.momento.com

# Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
STRIPE_ACCOUNT_ID=acct_test_...

# Email
POSTMARK_API_KEY=your_staging_postmark_key
POSTMARK_FROM_EMAIL=staging@momento.com

# Monitoring
SENTRY_DSN=https://your-staging-sentry-dsn
DATADOG_API_KEY=your_staging_datadog_key
```

#### Development Environment

```bash
# Application
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:8000

# Database
CONVEX_DEPLOY_KEY=your_dev_convex_key
CONVEX_URL=https://your-dev-project.convex.cloud

# Authentication
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_JWT_ISSUER=https://dev-clerk.momento.com

# Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
STRIPE_ACCOUNT_ID=acct_test_...

# Email
POSTMARK_API_KEY=your_dev_postmark_key
POSTMARK_FROM_EMAIL=dev@momento.com
```

### Environment Management

#### Secret Management

```yaml
# .env.example
# Copy this file to .env.local and fill in your values
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:8000

# Database
CONVEX_DEPLOY_KEY=
CONVEX_URL=

# Authentication
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_JWT_ISSUER=

# Payments
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_ACCOUNT_ID=

# Email
POSTMARK_API_KEY=
POSTMARK_FROM_EMAIL=

# Monitoring
SENTRY_DSN=
DATADOG_API_KEY=

# Security
ENCRYPTION_KEY=
JWT_SECRET=
```

#### Environment Validation

```typescript
// scripts/validate-env.ts
import {config} from '../convex/lib/config'

const requiredEnvVars = [
  'NODE_ENV',
  'FRONTEND_URL',
  'CONVEX_DEPLOY_KEY',
  'CLERK_SECRET_KEY',
  'STRIPE_SECRET_KEY',
  'POSTMARK_API_KEY',
]

export const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    )
  }

  console.log('✅ Environment validation passed')
}
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

#### Main Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm run test:ci

      - name: Run type checking
        run: npm run type-check

      - name: Build application
        run: npm run build

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: coverage/

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Convex (Staging)
        run: npx convex deploy --prod-name staging
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_STAGING_KEY }}

      - name: Deploy to Expo (Staging)
        run: eas build --platform all --profile staging
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run security scan
        run: npm run security:scan

      - name: Deploy to Convex (Production)
        run: npx convex deploy --prod-name production
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_PRODUCTION_KEY }}

      - name: Deploy to Expo (Production)
        run: eas build --platform all --profile production
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Run smoke tests
        run: npm run test:smoke

      - name: Notify deployment
        run: npm run notify:deployment
```

#### Security Workflow

```yaml
# .github/workflows/security.yml
name: Security

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM

jobs:
  security-scan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Run CodeQL analysis
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, typescript

      - name: Perform CodeQL analysis
        uses: github/codeql-action/analyze@v2
```

### Deployment Strategies

#### Blue-Green Deployment

```typescript
// scripts/deploy-blue-green.ts
export const deployBlueGreen = async () => {
  // 1. Deploy new version to green environment
  await deployToEnvironment('green')

  // 2. Run health checks
  const healthCheck = await runHealthChecks('green')

  if (!healthCheck.success) {
    console.log('❌ Health checks failed, rolling back')
    await rollbackDeployment()
    return
  }

  // 3. Switch traffic to green
  await switchTraffic('green')

  // 4. Monitor for issues
  await monitorDeployment()

  // 5. Clean up blue environment
  await cleanupEnvironment('blue')
}
```

#### Canary Deployment

```typescript
// scripts/deploy-canary.ts
export const deployCanary = async () => {
  // 1. Deploy to canary environment
  await deployToCanary()

  // 2. Route small percentage of traffic
  await routeTraffic(5) // 5% of traffic

  // 3. Monitor metrics
  const metrics = await monitorCanaryMetrics()

  if (metrics.errorRate > 0.01) {
    // 1% error rate threshold
    console.log('❌ Canary deployment failed, rolling back')
    await rollbackCanary()
    return
  }

  // 4. Gradually increase traffic
  await routeTraffic(25) // 25% of traffic
  await monitorCanaryMetrics()

  await routeTraffic(50) // 50% of traffic
  await monitorCanaryMetrics()

  // 5. Full deployment
  await routeTraffic(100) // 100% of traffic
}
```

---

## Infrastructure as Code

### Terraform Configuration

#### Main Infrastructure

```hcl
# infrastructure/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "momento-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Momento"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Configuration
module "vpc" {
  source = "./modules/vpc"

  environment = var.environment
  vpc_cidr    = var.vpc_cidr
  azs         = var.availability_zones
}

# Database Configuration
module "database" {
  source = "./modules/database"

  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  instance_class  = var.database_instance_class
  allocated_storage = var.database_allocated_storage
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"

  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.public_subnet_ids
}

# ECS Cluster
module "ecs" {
  source = "./modules/ecs"

  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids
  alb_arn     = module.alb.alb_arn
}
```

#### Security Configuration

```hcl
# infrastructure/security.tf
# IAM Roles and Policies
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.environment}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "ecs_task_policy" {
  name = "${var.environment}-ecs-task-policy"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = [
          "${aws_s3_bucket.user_uploads.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          aws_secretsmanager_secret.app_secrets.arn
        ]
      }
    ]
  })
}

# Security Groups
resource "aws_security_group" "app_sg" {
  name        = "${var.environment}-app-sg"
  description = "Security group for Momento application"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTPS from ALB"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    security_groups = [module.alb.alb_sg_id]
  }

  ingress {
    description = "HTTP from ALB"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    security_groups = [module.alb.alb_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-app-sg"
  }
}
```

### Docker Configuration

#### Application Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - CONVEX_URL=${CONVEX_URL}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: momento
      POSTGRES_USER: momento
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  redis_data:
  postgres_data:
```

---

## Database Management

### Convex Database Operations

#### Migration Scripts

```typescript
// scripts/migrate.ts
import {ConvexHttpClient} from 'convex/browser'
import {api} from '../convex/_generated/api'

const client = new ConvexHttpClient(process.env.CONVEX_URL!)

export const runMigration = async (migrationName: string) => {
  console.log(`Running migration: ${migrationName}`)

  try {
    switch (migrationName) {
      case 'add_user_verification_fields':
        await migrateUserVerificationFields()
        break
      case 'add_event_categories':
        await migrateEventCategories()
        break
      case 'add_payment_tracking':
        await migratePaymentTracking()
        break
      default:
        throw new Error(`Unknown migration: ${migrationName}`)
    }

    console.log(`✅ Migration ${migrationName} completed successfully`)
  } catch (error) {
    console.error(`❌ Migration ${migrationName} failed:`, error)
    throw error
  }
}

const migrateUserVerificationFields = async () => {
  // Add verification fields to existing users
  const users = await client.query(api.users.listAll)

  for (const user of users) {
    await client.mutation(api.users.updateVerificationFields, {
      userId: user._id,
      isVerified: false,
      verificationStatus: 'not_started',
    })
  }
}
```

#### Backup and Recovery

```typescript
// scripts/backup.ts
import {ConvexHttpClient} from 'convex/browser'
import {api} from '../convex/_generated/api'

const client = new ConvexHttpClient(process.env.CONVEX_URL!)

export const createBackup = async () => {
  console.log('Creating database backup...')

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupName = `backup-${timestamp}`

  try {
    // Export all data
    const users = await client.query(api.users.listAll)
    const events = await client.query(api.events.listAll)
    const payments = await client.query(api.payments.listAll)

    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: {
        users,
        events,
        payments,
      },
    }

    // Save backup to S3
    await saveBackupToS3(backupName, backup)

    console.log(`✅ Backup created: ${backupName}`)
    return backupName
  } catch (error) {
    console.error('❌ Backup failed:', error)
    throw error
  }
}

export const restoreBackup = async (backupName: string) => {
  console.log(`Restoring backup: ${backupName}`)

  try {
    // Load backup from S3
    const backup = await loadBackupFromS3(backupName)

    // Validate backup
    if (!backup.data || !backup.timestamp) {
      throw new Error('Invalid backup format')
    }

    // Restore data
    await restoreUsers(backup.data.users)
    await restoreEvents(backup.data.events)
    await restorePayments(backup.data.payments)

    console.log(`✅ Backup restored: ${backupName}`)
  } catch (error) {
    console.error('❌ Restore failed:', error)
    throw error
  }
}
```

---

## Monitoring & Alerting

### Application Monitoring

#### Sentry Integration

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/react-native'

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.ReactNativeTracing({
        tracingOrigins: ['localhost', 'your-api-url.com'],
      }),
    ],
  })
}

export const captureException = (error: Error, context?: any) => {
  Sentry.captureException(error, {
    extra: context,
  })
}

export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
) => {
  Sentry.captureMessage(message, level)
}
```

#### Performance Monitoring

```typescript
// lib/performance.ts
import {Performance} from '@sentry/react-native'

export const trackPerformance = (
  name: string,
  operation: () => Promise<any>,
) => {
  const transaction = Performance.startTransaction({
    name,
    op: 'function',
  })

  return operation().finally(() => {
    transaction.finish()
  })
}

export const trackApiCall = (
  endpoint: string,
  operation: () => Promise<any>,
) => {
  return trackPerformance(`API: ${endpoint}`, operation)
}

export const trackDatabaseQuery = (
  query: string,
  operation: () => Promise<any>,
) => {
  return trackPerformance(`DB: ${query}`, operation)
}
```

### Infrastructure Monitoring

#### CloudWatch Dashboards

```typescript
// scripts/create-dashboards.ts
import {CloudWatch} from 'aws-sdk'

const cloudwatch = new CloudWatch()

export const createDashboards = async () => {
  const dashboardConfig = {
    DashboardName: 'Momento-Production',
    DashboardBody: JSON.stringify({
      widgets: [
        {
          type: 'metric',
          properties: {
            metrics: [
              ['AWS/ECS', 'CPUUtilization', 'ServiceName', 'momento-api'],
              ['AWS/ECS', 'MemoryUtilization', 'ServiceName', 'momento-api'],
            ],
            period: 300,
            stat: 'Average',
            region: 'us-east-1',
            title: 'ECS Service Metrics',
          },
        },
        {
          type: 'metric',
          properties: {
            metrics: [
              [
                'AWS/RDS',
                'CPUUtilization',
                'DBInstanceIdentifier',
                'momento-db',
              ],
              [
                'AWS/RDS',
                'DatabaseConnections',
                'DBInstanceIdentifier',
                'momento-db',
              ],
            ],
            period: 300,
            stat: 'Average',
            region: 'us-east-1',
            title: 'Database Metrics',
          },
        },
      ],
    }),
  }

  await cloudwatch.putDashboard(dashboardConfig).promise()
}
```

#### Alerting Rules

```typescript
// scripts/create-alerts.ts
import {CloudWatch} from 'aws-sdk'

const cloudwatch = new CloudWatch()

export const createAlerts = async () => {
  const alerts = [
    {
      AlarmName: 'Momento-High-CPU',
      MetricName: 'CPUUtilization',
      Namespace: 'AWS/ECS',
      Statistic: 'Average',
      Period: 300,
      EvaluationPeriods: 2,
      Threshold: 80,
      ComparisonOperator: 'GreaterThanThreshold',
      ActionsEnabled: true,
      AlarmActions: ['arn:aws:sns:us-east-1:123456789012:Momento-Alerts'],
    },
    {
      AlarmName: 'Momento-High-Error-Rate',
      MetricName: 'HTTPCode_Target_5XX_Count',
      Namespace: 'AWS/ApplicationELB',
      Statistic: 'Sum',
      Period: 300,
      EvaluationPeriods: 1,
      Threshold: 10,
      ComparisonOperator: 'GreaterThanThreshold',
      ActionsEnabled: true,
      AlarmActions: ['arn:aws:sns:us-east-1:123456789012:Momento-Alerts'],
    },
  ]

  for (const alert of alerts) {
    await cloudwatch.putMetricAlarm(alert).promise()
  }
}
```

---

## Security & Compliance

### Security Scanning

#### Container Security

```yaml
# .github/workflows/container-security.yml
name: Container Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  container-scan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t momento-app .

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'momento-app:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

#### Infrastructure Security

```typescript
// scripts/security-scan.ts
import {SecurityHub} from 'aws-sdk'

const securityhub = new SecurityHub()

export const runSecurityScan = async () => {
  console.log('Running security scan...')

  try {
    // Get security findings
    const findings = await securityhub
      .getFindings({
        Filters: {
          RecordState: [
            {
              Value: 'ACTIVE',
              Comparison: 'EQUALS',
            },
          ],
          SeverityLabel: [
            {
              Value: 'HIGH',
              Comparison: 'EQUALS',
            },
            {
              Value: 'CRITICAL',
              Comparison: 'EQUALS',
            },
          ],
        },
      })
      .promise()

    if (findings.Findings && findings.Findings.length > 0) {
      console.log(`❌ Found ${findings.Findings.length} security issues`)

      for (const finding of findings.Findings) {
        console.log(`- ${finding.Title}: ${finding.Description}`)
      }

      throw new Error('Security scan failed')
    }

    console.log('✅ Security scan passed')
  } catch (error) {
    console.error('Security scan error:', error)
    throw error
  }
}
```

---

## Disaster Recovery

### Backup Strategy

#### Automated Backups

```typescript
// scripts/backup-scheduler.ts
import {schedule} from 'node-cron'

export const scheduleBackups = () => {
  // Daily backup at 2 AM
  schedule('0 2 * * *', async () => {
    console.log('Starting daily backup...')
    await createBackup()
  })

  // Weekly backup on Sunday at 3 AM
  schedule('0 3 * * 0', async () => {
    console.log('Starting weekly backup...')
    await createBackup()
  })
}
```

#### Recovery Procedures

```typescript
// scripts/recovery.ts
export const disasterRecovery = async (scenario: string) => {
  console.log(`Starting disaster recovery for: ${scenario}`)

  switch (scenario) {
    case 'database_failure':
      await recoverDatabase()
      break
    case 'application_failure':
      await recoverApplication()
      break
    case 'infrastructure_failure':
      await recoverInfrastructure()
      break
    default:
      throw new Error(`Unknown recovery scenario: ${scenario}`)
  }
}

const recoverDatabase = async () => {
  // 1. Stop application
  await stopApplication()

  // 2. Restore from latest backup
  const latestBackup = await getLatestBackup()
  await restoreBackup(latestBackup)

  // 3. Verify data integrity
  await verifyDataIntegrity()

  // 4. Restart application
  await startApplication()

  // 5. Run health checks
  await runHealthChecks()
}
```

---

## Performance Optimization

### Caching Strategy

#### Redis Configuration

```typescript
// lib/redis.ts
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
})

export const cache = {
  async get(key: string) {
    try {
      const value = await redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  },

  async set(key: string, value: any, ttl: number = 3600) {
    try {
      await redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  },

  async del(key: string) {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  },
}
```

#### Application Caching

```typescript
// convex/lib/cache.ts
import {cache} from './redis'

export const withCache = async <T>(
  key: string,
  operation: () => Promise<T>,
  ttl: number = 3600,
): Promise<T> => {
  // Try to get from cache
  const cached = await cache.get(key)
  if (cached) {
    return cached
  }

  // Execute operation
  const result = await operation()

  // Cache result
  await cache.set(key, result, ttl)

  return result
}

// Usage example
export const getEventsForUser = query({
  args: {userId: v.id('users')},
  handler: async (ctx, args) => {
    return withCache(
      `events:user:${args.userId}`,
      async () => {
        // Actual database query
        return await ctx.db
          .query('events')
          .withIndex('by_host', q => q.eq('hostId', args.userId))
          .collect()
      },
      1800, // 30 minutes
    )
  },
})
```

---

## Scaling Strategy

### Horizontal Scaling

#### Auto Scaling Configuration

```typescript
// infrastructure/autoscaling.ts
import {AutoScaling} from 'aws-sdk'

const autoscaling = new AutoScaling()

export const configureAutoScaling = async () => {
  const config = {
    AutoScalingGroupName: 'momento-api-asg',
    MinSize: 2,
    MaxSize: 10,
    DesiredCapacity: 2,
    TargetGroupARNs: [
      'arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/momento-api/1234567890123456',
    ],
    VPCZoneIdentifier: ['subnet-12345678', 'subnet-87654321'],
    HealthCheckType: 'ELB',
    HealthCheckGracePeriod: 300,
    Tags: [
      {
        Key: 'Name',
        Value: 'Momento API Instance',
        PropagateAtLaunch: true,
      },
    ],
  }

  await autoscaling.createAutoScalingGroup(config).promise()

  // Configure scaling policies
  await autoscaling
    .putScalingPolicy({
      AutoScalingGroupName: 'momento-api-asg',
      PolicyName: 'ScaleUpPolicy',
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingConfiguration: {
        PredefinedMetricSpecification: {
          PredefinedMetricType: 'ASGAverageCPUUtilization',
        },
        TargetValue: 70.0,
      },
    })
    .promise()
}
```

#### Load Balancing

```typescript
// infrastructure/load-balancer.ts
import {ELBv2} from 'aws-sdk'

const elbv2 = new ELBv2()

export const configureLoadBalancer = async () => {
  // Create Application Load Balancer
  const alb = await elbv2
    .createLoadBalancer({
      Name: 'momento-alb',
      Subnets: ['subnet-12345678', 'subnet-87654321'],
      SecurityGroups: ['sg-12345678'],
      Scheme: 'internet-facing',
      Type: 'application',
    })
    .promise()

  // Create target group
  const targetGroup = await elbv2
    .createTargetGroup({
      Name: 'momento-api-tg',
      Protocol: 'HTTP',
      Port: 3000,
      VpcId: 'vpc-12345678',
      HealthCheckProtocol: 'HTTP',
      HealthCheckPath: '/health',
      HealthCheckIntervalSeconds: 30,
      HealthCheckTimeoutSeconds: 5,
      HealthyThresholdCount: 2,
      UnhealthyThresholdCount: 2,
    })
    .promise()

  // Create listener
  await elbv2
    .createListener({
      LoadBalancerArn: alb.LoadBalancers![0].LoadBalancerArn,
      Protocol: 'HTTPS',
      Port: 443,
      DefaultActions: [
        {
          Type: 'forward',
          TargetGroupArn: targetGroup.TargetGroups![0].TargetGroupArn,
        },
      ],
      Certificates: [
        {
          CertificateArn:
            'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
        },
      ],
    })
    .promise()
}
```

---

**Last Updated:** 2024-12-19

This deployment documentation is reviewed and updated regularly to ensure continued reliability and scalability of the Momento platform.
