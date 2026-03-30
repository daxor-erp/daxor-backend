import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { config } from '~/config'
import { logger } from '../lib/logger'
import { User } from '../modules/user/model'
import { Organization } from '../modules/organization/model'
import { ROLES } from '../modules/role/permissions'

const DEFAULT_PASSWORD = 'Daxor@123'

const SEED_USERS = [
  { role: ROLES.SUPER_ADMIN,         firstName: 'Super',      lastName: 'Admin',      email: 'superadmin@daxor.com' },
  { role: ROLES.ERP_ADMIN,           firstName: 'ERP',        lastName: 'Admin',      email: 'erpadmin@daxor.com' },
  { role: ROLES.EXTRACTION_MANAGER,  firstName: 'Extraction', lastName: 'Manager',    email: 'extraction@daxor.com' },
  { role: ROLES.PRODUCTION_MANAGER,  firstName: 'Production', lastName: 'Manager',    email: 'production@daxor.com' },
  { role: ROLES.PURCHASE_MANAGER,    firstName: 'Purchase',   lastName: 'Manager',    email: 'purchase@daxor.com' },
  { role: ROLES.INVENTORY_MANAGER,   firstName: 'Inventory',  lastName: 'Manager',    email: 'inventory@daxor.com' },
  { role: ROLES.QUALITY_MANAGER,     firstName: 'Quality',    lastName: 'Manager',    email: 'quality@daxor.com' },
  { role: ROLES.FINANCE_MANAGER,     firstName: 'Finance',    lastName: 'Manager',    email: 'finance@daxor.com' },
  { role: ROLES.HR_PAYROLL_MANAGER,  firstName: 'HR',         lastName: 'Manager',    email: 'hr@daxor.com' },
  { role: ROLES.SALES_MANAGER,       firstName: 'Sales',      lastName: 'Manager',    email: 'sales@daxor.com' },
  { role: ROLES.WAREHOUSE_SUPERVISOR,firstName: 'Warehouse',  lastName: 'Supervisor', email: 'warehouse@daxor.com' },
  { role: ROLES.ASSET_MANAGER,       firstName: 'Asset',      lastName: 'Manager',    email: 'asset@daxor.com' },
]

async function seedUsers() {
  try {
    await mongoose.connect(config.mongoDatabaseUrl)
    logger.info('Connected to MongoDB')

    // Upsert default organization
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
    const results: { email: string; role: string; status: string }[] = []

    for (const u of SEED_USERS) {
      const existing = await User.findOne({ email: u.email })
      if (existing) {
        // Patch organizationId if missing
        if (!existing.organizationId) {
          await User.updateOne({ _id: existing._id }, { organizationId })
          results.push({ email: u.email, role: u.role, status: 'patched (organizationId added)' })
        } else {
          results.push({ email: u.email, role: u.role, status: 'skipped (already exists)' })
        }
        continue
      }

      await User.create({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        passwordHash,
        roles: [u.role],
        organizationId,
        status: 'active',
      })

      results.push({ email: u.email, role: u.role, status: 'created' })
    }

    logger.info('\n=== Seed Users Summary ===')
    logger.info(`Default password for all users: ${DEFAULT_PASSWORD}\n`)
    results.forEach(r => {
      logger.info(`  [${r.status}]  ${r.email.padEnd(30)} role: ${r.role}`)
    })

    await mongoose.disconnect()
    logger.info('\nDisconnected from MongoDB')
    process.exit(0)
  } catch (error) {
    logger.error('Error seeding users:', error)
    process.exit(1)
  }
}

seedUsers()
