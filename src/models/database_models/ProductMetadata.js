const mongoose = require('mongoose');

const productMetadataSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    material: {
      type: String,
    },
    usage: {
      type: String,
    },
    brand: {
      type: String,
    },
    primary_category: {
      type: String,
      required: true,
      enum: ['Packaging', 'Kitchen', 'Personal Care', 'Office Supplies', 'Cleaning', 'Lifestyle'],
    },
    sub_category: {
      type: String,
      required: true,
    },
    seo_tags: {
      type: [String],
      default: [],
    },
    sustainability_filters: {
      type: [String],
      default: [],
      validate: {
        validator: function (filters) {
          const allowed = [
            'plastic-free', 'compostable', 'vegan', 'recycled',
            'biodegradable', 'organic', 'carbon-neutral',
          ];
          return filters.every((f) => allowed.includes(f));
        },
        message: 'Invalid sustainability filter value',
      },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('ProductMetadata', productMetadataSchema);
