const mongoose = require('mongoose');

const impactReportSchema = new mongoose.Schema(
  {
    report_id: { type: String, required: true, unique: true, index: true },
    order_id: { type: String, required: true, index: true },
    products: { type: [String], default: [] },
    quantities: { type: [Number], default: [] },
    materials: { type: [String], default: [] },
    plastic_saved_kg: { type: Number },
    carbon_avoided_kg: { type: Number },
    local_sourcing_summary: { type: String },
    impact_statement: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('ImpactReport', impactReportSchema);
