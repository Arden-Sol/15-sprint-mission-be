import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

export const Products = mongoose.model('Products', productSchema);

// product schema
// id: string
// name: string
// description: string
// price: number
// tags: array(string)
// createdAt: date
// updatedAt: date
