import { model, Schema } from 'mongoose'

const bankSchema = new Schema(
	{
		bankName: { type: String },
		accountNumber: { type: String },
		ifscCode: { type: String },
		branchName: { type: String },
	},
	{ _id: false },
)

const emergencyContactSchema = new Schema(
	{
		name: { type: String },
		relation: { type: String },
		phone: { type: String },
	},
	{ _id: false },
)

const employeeMasterSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		employeeCode: { type: String, required: true, index: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		dateOfBirth: { type: Date },
		gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] },
		bloodGroup: { type: String },
		nationality: { type: String },
		maritalStatus: { type: String, enum: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] },
		// Contact
		personalEmail: { type: String },
		workEmail: { type: String, index: true },
		phone: { type: String },
		alternatePhone: { type: String },
		address: { type: String },
		city: { type: String },
		state: { type: String },
		country: { type: String, default: 'India' },
		pincode: { type: String },
		// Employment
		designation: { type: String },
		department: { type: String },
		reportsToUserId: { type: Schema.Types.ObjectId, ref: 'User' },
		dateOfJoining: { type: Date, required: true },
		dateOfConfirmation: { type: Date },
		dateOfRelieving: { type: Date },
		employmentType: { type: String, enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'CONSULTANT'], default: 'FULL_TIME' },
		workLocation: { type: String },
		shiftMasterId: { type: Schema.Types.ObjectId, ref: 'HrMaster' },
		// Compensation
		basicSalary: { type: Number, default: 0, min: 0 },
		currency: { type: String, default: 'INR' },
		// Identity (India specifics — minimal)
		panNumber: { type: String },
		aadhaarNumber: { type: String },
		uanNumber: { type: String },
		esiNumber: { type: String },
		// Bank
		bankDetails: { type: bankSchema },
		emergencyContact: { type: emergencyContactSchema },
		// Status
		status: {
			type: String,
			enum: ['ACTIVE', 'ON_LEAVE', 'NOTICE_PERIOD', 'TERMINATED', 'RESIGNED', 'RETIRED', 'PROBATION'],
			default: 'ACTIVE',
			index: true,
		},
		notes: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

employeeMasterSchema.index({ organizationId: 1, employeeCode: 1 }, { unique: true })
employeeMasterSchema.index({ organizationId: 1, workEmail: 1 })

export const EmployeeMaster = model('EmployeeMaster', employeeMasterSchema)
