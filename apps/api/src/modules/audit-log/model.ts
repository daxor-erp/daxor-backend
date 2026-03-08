import { model, Schema } from 'mongoose'

const auditLogSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	action: { type: String, required: true },
	entityType: { type: String, required: true },
	entityId: { type: Schema.Types.ObjectId },
	oldValues: { type: Schema.Types.Mixed },
	newValues: { type: Schema.Types.Mixed },
	ipAddress: { type: String },
	userAgent: { type: String },
	createdAt: { type: Date, default: Date.now },
}, { timestamps: false })

auditLogSchema.index({ userId: 1 })
auditLogSchema.index({ entityType: 1 })
auditLogSchema.index({ entityId: 1 })
auditLogSchema.index({ createdAt: -1 })

export const AuditLog = model('AuditLog', auditLogSchema)
