import { model, Schema } from 'mongoose'

const deliveryItemSchema = new Schema(
	{
		itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
		itemName: { type: String, required: true },
		quantity: { type: Number, required: true, min: 0 },
		unit: { type: String, default: 'unit' },
		notes: { type: String },
	},
	{ _id: false },
)

/**
 * Delivery / shipment document for a sales order. Tracks logistics + status.
 */
const deliveryOrderSchema = new Schema(
	{
		organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
		docNumber: { type: String, required: true, index: true },
		salesOrderId: { type: Schema.Types.ObjectId, ref: 'SalesOrder' },
		customerId: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
		customerName: { type: String },
		deliveryDate: { type: Date, required: true, index: true },
		expectedArrival: { type: Date },
		actualArrival: { type: Date },
		shippingAddress: { type: String },
		carrier: { type: String },
		trackingNumber: { type: String },
		vehicleNumber: { type: String },
		driverName: { type: String },
		driverPhone: { type: String },
		items: { type: [deliveryItemSchema], default: [] },
		totalQuantity: { type: Number, default: 0 },
		status: {
			type: String,
			enum: ['DRAFT', 'READY', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED'],
			default: 'DRAFT',
			index: true,
		},
		dispatchedAt: { type: Date },
		deliveredAt: { type: Date },
		signedBy: { type: String },
		signedAt: { type: Date },
		notes: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
)

deliveryOrderSchema.index({ organizationId: 1, docNumber: 1 }, { unique: true })

export const DeliveryOrder = model('DeliveryOrder', deliveryOrderSchema)
