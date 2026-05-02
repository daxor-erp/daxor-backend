import { model, Schema } from 'mongoose'

const roleSchema = new Schema({
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  description: { type: String },
  permissions: [{
    resource: { type: String, required: true },
    actions: [{ type: String, enum: ['create', 'read', 'update', 'delete'] }]
  }],
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  isSystemRole: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
}, { timestamps: false })

roleSchema.index({ name: 1, organizationId: 1 }, { unique: true })
roleSchema.index({ organizationId: 1 })
roleSchema.index({ deletedAt: 1 })

export const Role = model('Role', roleSchema)
