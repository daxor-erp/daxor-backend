import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { config } from '~/config'
import { logger } from '../lib/logger'
import { User } from '../modules/user/model'
import { Organization } from '../modules/organization/model'
import { ROLES } from '../modules/role/permissions'

/** Shared password for all seeded E2E / demo users (reset on every seed run). */
const DEFAULT_PASSWORD = 'Daxor@123'

type SeedUser = {
  role: string
  firstName: string
  lastName: string
  email: string
  /** Optional second role (e.g. employee + manager). */
  extraRoles?: string[]
  userType?: string
  envKey?: string
}

/**
 * All role kinds used by the ERP + dedicated E2E accounts.
 * Password is always reset to DEFAULT_PASSWORD so forgotten credentials are recoverable.
 */
const SEED_USERS: SeedUser[] = [
  // Platform
  { role: ROLES.SUPER_ADMIN, firstName: 'Super', lastName: 'Admin', email: 'superadmin@daxor.com', envKey: 'E2E_USER_SUPER_ADMIN' },
  { role: ROLES.ERP_ADMIN, firstName: 'ERP', lastName: 'Admin', email: 'erpadmin@daxor.com', envKey: 'E2E_USER_ERP_ADMIN' },

  // Tenant admin (primary E2E actor for most flows)
  { role: ROLES.ORG_ADMIN, firstName: 'Org', lastName: 'Admin', email: 'orgadmin@daxor.com', envKey: 'E2E_USER_ORG_ADMIN' },

  // Functional managers
  { role: ROLES.EXTRACTION_MANAGER, firstName: 'Extraction', lastName: 'Manager', email: 'extraction@daxor.com', envKey: 'E2E_USER_EXTRACTION' },
  { role: ROLES.PRODUCTION_MANAGER, firstName: 'Production', lastName: 'Manager', email: 'production@daxor.com', envKey: 'E2E_USER_PRODUCTION' },
  { role: ROLES.PURCHASE_MANAGER, firstName: 'Purchase', lastName: 'Manager', email: 'purchase@daxor.com', envKey: 'E2E_USER_PURCHASE' },
  { role: ROLES.INVENTORY_MANAGER, firstName: 'Inventory', lastName: 'Manager', email: 'inventory@daxor.com', envKey: 'E2E_USER_INVENTORY' },
  { role: ROLES.QUALITY_MANAGER, firstName: 'Quality', lastName: 'Manager', email: 'quality@daxor.com', envKey: 'E2E_USER_QUALITY' },
  { role: ROLES.FINANCE_MANAGER, firstName: 'Finance', lastName: 'Manager', email: 'finance@daxor.com', envKey: 'E2E_USER_FINANCE' },
  { role: ROLES.HR_PAYROLL_MANAGER, firstName: 'HR', lastName: 'Manager', email: 'hr@daxor.com', envKey: 'E2E_USER_HR' },
  { role: ROLES.SALES_MANAGER, firstName: 'Sales', lastName: 'Manager', email: 'sales@daxor.com', envKey: 'E2E_USER_SALES' },
  { role: ROLES.WAREHOUSE_SUPERVISOR, firstName: 'Warehouse', lastName: 'Supervisor', email: 'warehouse@daxor.com', envKey: 'E2E_USER_WAREHOUSE' },
  { role: ROLES.ASSET_MANAGER, firstName: 'Asset', lastName: 'Manager', email: 'asset@daxor.com', envKey: 'E2E_USER_ASSET' },

  // Standard / employee users for login + leave flows
  {
    role: ROLES.SALES_MANAGER,
    firstName: 'Standard',
    lastName: 'User',
    email: 'user@daxor.com',
    userType: 'Staff',
    envKey: 'E2E_USER_STANDARD',
  },
  {
    role: ROLES.HR_PAYROLL_MANAGER,
    firstName: 'New',
    lastName: 'User',
    email: 'newuser@daxor.com',
    userType: 'employee',
    envKey: 'E2E_USER_NEW',
  },
]

async function seedUsers() {
  try {
    await mongoose.connect(config.mongoDatabaseUrl)
    logger.info('Connected to MongoDB')

    let org = await Organization.findOne({ code: 'DAXOR' })
    if (!org) {
      org = await Organization.create({
        code: 'DAXOR',
        name: 'Daxor Organization',
        status: 'active',
      })
      logger.info(`Created default organization: ${org.name} (${org._id})`)
    } else {
      logger.info(`Using existing organization: ${org.name} (${org._id})`)
    }

    const organizationId = org._id
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10)
    const results: { email: string; role: string; status: string; envKey?: string }[] = []

    for (const u of SEED_USERS) {
      const roles = [u.role, ...(u.extraRoles ?? [])]
      const existing = await User.findOne({ email: u.email.toLowerCase() })

      if (existing) {
        await User.updateOne(
          { _id: existing._id },
          {
            $set: {
              firstName: u.firstName,
              lastName: u.lastName,
              passwordHash,
              roles,
              organizationId,
              status: 'active',
              ...(u.userType ? { userType: u.userType } : {}),
            },
          },
        )
        results.push({ email: u.email, role: roles.join(','), status: 'updated (password reset)', envKey: u.envKey })
        continue
      }

      await User.create({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email.toLowerCase(),
        passwordHash,
        roles,
        organizationId,
        status: 'active',
        ...(u.userType ? { userType: u.userType } : {}),
      })

      results.push({ email: u.email, role: roles.join(','), status: 'created', envKey: u.envKey })
    }

    // Also reset legacy E2E emails if they already exist in DB (keep working with old .env)
    const legacy = [
      { email: 'diokid@gmail.com', roles: [ROLES.ORG_ADMIN], firstName: 'Diokid', lastName: 'Admin', envKey: 'E2E_USER_ORG_ADMIN_LEGACY' },
      { email: 'vinay@gmail.com', roles: [ROLES.SALES_MANAGER], firstName: 'Vinay', lastName: 'User', envKey: 'E2E_USER_STANDARD_LEGACY' },
      { email: 'newuser@gmail.com', roles: [ROLES.SALES_MANAGER], firstName: 'New', lastName: 'Gmail', envKey: 'E2E_USER_NEW_LEGACY' },
    ]
    for (const u of legacy) {
      const existing = await User.findOne({ email: u.email.toLowerCase() })
      if (!existing) continue
      await User.updateOne(
        { _id: existing._id },
        {
          $set: {
            passwordHash,
            roles: u.roles,
            organizationId,
            status: 'active',
            firstName: u.firstName,
            lastName: u.lastName,
          },
        },
      )
      results.push({ email: u.email, role: u.roles.join(','), status: 'legacy updated (password reset)', envKey: u.envKey })
    }

    // Wire org-admin as approver for every module workflow used by E2E flows.
    const orgAdmin = await User.findOne({ email: 'orgadmin@daxor.com' })
    if (orgAdmin) {
      const moduleKeys = ['purchases', 'sales', 'quotations', 'payroll', 'payables', 'vendors']
      await Organization.findByIdAndUpdate(organizationId, {
        $set: {
          moduleApprovers: moduleKeys.map((moduleKey) => ({
            moduleKey,
            approverUserIds: [orgAdmin._id],
            approverUserId: orgAdmin._id,
          })),
        },
      })
      logger.info(`Configured moduleApprovers for org ${organizationId} → orgadmin`)
    }

    logger.info('\n=== Seed Users Summary ===')
    logger.info(`Default password for ALL users: ${DEFAULT_PASSWORD}\n`)
    results.forEach((r) => {
      logger.info(`  [${r.status}]  ${r.email.padEnd(32)} role: ${r.role}`)
    })

    // Print env snippet for copy into daxor-frontend/.env.e2e.local
    logger.info('\n=== .env.e2e.local snippet ===')
    logger.info(`E2E_SHARED_PASSWORD=${DEFAULT_PASSWORD}`)
    for (const u of SEED_USERS) {
      if (!u.envKey) continue
      logger.info(`${u.envKey}_EMAIL=${u.email}`)
      logger.info(`${u.envKey}_PASSWORD=${DEFAULT_PASSWORD}`)
    }

    await mongoose.disconnect()
    logger.info('\nDisconnected from MongoDB')
    process.exit(0)
  } catch (error) {
    logger.error('Error seeding users:', error)
    process.exit(1)
  }
}

seedUsers()
