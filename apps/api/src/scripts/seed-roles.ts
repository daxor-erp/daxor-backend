import { RoleService } from '../modules/role/service'
import { logger } from '../lib/logger'
import mongoose from 'mongoose'
import { config } from '../config'

async function seedRoles() {
  try {
    await mongoose.connect(config.mongoDatabaseUrl)
    logger.info('Connected to MongoDB')

    const roleService = new RoleService()
    const roles = await roleService.seedSystemRoles()

    logger.info(`Seeded ${roles.length} system roles:`)
    roles.forEach(role => {
      logger.info(`  - ${role.name}: ${role.displayName}`)
    })

    await mongoose.disconnect()
    logger.info('Disconnected from MongoDB')
    process.exit(0)
  } catch (error) {
    logger.error('Error seeding roles:', error)
    process.exit(1)
  }
}

seedRoles()
