import { model, Schema } from 'mongoose'

const attendanceSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true },
	checkIn: { type: Date },
	checkOut: { type: Date },
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	status: { type: String, enum: ['present', 'absent', 'leave', 'deleted'], default: 'present' },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

attendanceSchema.index({ userId: 1 })
attendanceSchema.index({ date: 1 })
attendanceSchema.index({ organizationId: 1 })
attendanceSchema.index({ deletedAt: 1 })

export const Attendance = model('Attendance', attendanceSchema)
