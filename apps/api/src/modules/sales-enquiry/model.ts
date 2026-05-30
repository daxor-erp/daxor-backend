import { model, Schema } from 'mongoose'

const salesEnquirySchema = new Schema({
	seqNo: { type: String },
	enquiryNumber: { type: String, required: true, maxlength: 50 },
	customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
	/** Bill-to / party id (customer id for new rows). */
	clientId: { type: Schema.Types.ObjectId, ref: 'Customer' },
	enquirySource: { type: String, maxlength: 50 },
	subject: { type: String, maxlength: 255 },
	projectType: { type: String, maxlength: 100 },
	projectScope: { type: String },
	location: { type: String, maxlength: 255 },
	estimatedStartDate: { type: Date },
	estimatedEndDate: { type: Date },
	budget: { type: Number },
	currency: { type: String, maxlength: 3, default: 'SGD' },
	status: { 
		type: String, 
		enum: ['new', 'under_review', 'quoted', 'negotiation', 'won', 'lost', 'submitted', 'approval_declined'], 
		default: 'new' 
	},
	assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
	priority: { 
		type: String, 
		enum: ['low', 'normal', 'high', 'urgent'], 
		default: 'normal' 
	},
	notes: { type: String },
	approvalStatus: {
		type: String,
		enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'],
		default: 'DRAFT',
		index: true,
	},
	approvalRequestedAt: { type: Date },
	approvedAt: { type: Date },
	approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now, immutable: true },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
}, { timestamps: false })

salesEnquirySchema.index({ seqNo: 1 }, { unique: true, sparse: true })
salesEnquirySchema.index({ enquiryNumber: 1 }, { unique: true })
salesEnquirySchema.index({ clientId: 1 })
salesEnquirySchema.index({ status: 1 })
salesEnquirySchema.index({ assignedTo: 1 })
salesEnquirySchema.index({ createdAt: 1 })
salesEnquirySchema.index({ deletedAt: 1 })
salesEnquirySchema.index({ organizationId: 1 })

export const SalesEnquiry = model('SalesEnquiry', salesEnquirySchema)
