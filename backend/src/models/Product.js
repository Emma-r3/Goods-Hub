import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    customId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    name: {
      en: { type: String, required: true },
      id: { type: String, required: true },
    },
    description: {
      en: { type: String, default: '' },
      id: { type: String, default: '' },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['electronics', 'fashion', 'home', 'beauty', 'sports', 'books'],
      lowercase: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    emoji: {
      type: String,
      default: '📦',
    },
    bg: {
      type: String,
      default: '#f3f4f6',
    },
    image: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual id that defaults to customId or _id
productSchema.virtual('id').get(function () {
  return this.customId !== undefined ? this.customId : this._id.toHexString();
});

const Product = mongoose.model('Product', productSchema);
export default Product;

