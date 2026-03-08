import { Schema, SchemaOptions } from 'mongoose';

/**
 * Default schema options for all collections
 */
export const defaultSchemaOptions: SchemaOptions = {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret: any) => {
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
  },
};

/**
 * Create a standard timestamp schema
 */
export const createTimestampSchema = () => ({
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
    index: true,
  },
});

/**
 * Create a standard audit schema
 */
export const createAuditSchema = () => ({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  ...createTimestampSchema(),
});

/**
 * Add soft delete middleware to schema
 */
export const addSoftDeleteMiddleware = (schema: Schema) => {
  // Automatically exclude soft-deleted documents from queries
  schema.pre(/^find/, function (this: any) {
    if (!this.getOptions().includeSoftDeleted) {
      this.where({ deletedAt: null });
    }
  });

  // Automatically exclude soft-deleted documents from aggregation
  schema.pre('aggregate', function (this: any) {
    if (!this.options.includeSoftDeleted) {
      this.pipeline().unshift({ $match: { deletedAt: null } });
    }
  });
};

/**
 * Add index middleware to schema
 */
export const addIndexes = (schema: Schema, indexes: Array<[any, any]>) => {
  indexes.forEach(([fields, options]) => {
    schema.index(fields, options);
  });
};

/**
 * Create a reference field
 */
export const createRefField = (
  refModel: string,
  options: any = {}
) => ({
  type: Schema.Types.ObjectId,
  ref: refModel,
  ...options,
});

/**
 * Create an embedded array schema
 */
export const createEmbeddedArraySchema = (itemSchema: any) => ({
  type: [itemSchema],
  default: [],
});

/**
 * Create a decimal field (stored as Number in MongoDB)
 */
export const createDecimalField = (options: any = {}) => ({
  type: Number,
  default: 0,
  ...options,
});

/**
 * Create an enum field
 */
export const createEnumField = (values: string[], defaultValue?: string) => ({
  type: String,
  enum: values,
  default: defaultValue || values[0],
});

/**
 * Create a unique string field
 */
export const createUniqueStringField = (options: any = {}) => ({
  type: String,
  unique: true,
  sparse: true,
  ...options,
});

/**
 * Create a standard status field
 */
export const createStatusField = (
  values: string[] = ['active', 'inactive', 'suspended'],
  defaultValue: string = 'active'
) => createEnumField(values, defaultValue);

/**
 * Create a currency field
 */
export const createCurrencyField = (defaultValue: string = 'SGD') => ({
  type: String,
  default: defaultValue,
  maxlength: 3,
});

/**
 * Create a phone field
 */
export const createPhoneField = (options: any = {}) => ({
  type: String,
  maxlength: 20,
  ...options,
});

/**
 * Create an email field
 */
export const createEmailField = (options: any = {}) => ({
  type: String,
  lowercase: true,
  match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ...options,
});

/**
 * Create a date field
 */
export const createDateField = (options: any = {}) => ({
  type: Date,
  ...options,
});

/**
 * Create a boolean field with default
 */
export const createBooleanField = (defaultValue: boolean = false) => ({
  type: Boolean,
  default: defaultValue,
});

/**
 * Create a sequence field for ordering
 */
export const createSequenceField = () => ({
  type: Number,
  default: 1,
});

/**
 * Create a notes/description field
 */
export const createNotesField = () => ({
  type: String,
  default: null,
});

/**
 * Create a percentage field
 */
export const createPercentageField = (options: any = {}) => ({
  type: Number,
  min: 0,
  max: 100,
  default: 0,
  ...options,
});

/**
 * Create a rating field (0-5)
 */
export const createRatingField = () => ({
  type: Number,
  min: 0,
  max: 5,
  default: 0,
});

/**
 * Create a code field (unique, uppercase)
 */
export const createCodeField = (options: any = {}) => ({
  type: String,
  unique: true,
  sparse: true,
  uppercase: true,
  ...options,
});

/**
 * Create a JSON field
 */
export const createJsonField = (options: any = {}) => ({
  type: Schema.Types.Mixed,
  default: {},
  ...options,
});
