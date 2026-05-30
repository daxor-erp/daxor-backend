import { model, Schema } from 'mongoose'

const enabledModuleSchema = new Schema(
	{
		moduleKey: { type: String, required: true },
		submoduleKey: { type: String, required: true },
	},
	{ _id: false },
)

const packageAssignmentSchema = new Schema(
	{
		packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
		enabledModules: { type: [enabledModuleSchema], default: [] },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true },
)

packageAssignmentSchema.index({ packageId: 1, organizationId: 1 }, { unique: true })

export const PackageAssignment = model('PackageAssignment', packageAssignmentSchema)
