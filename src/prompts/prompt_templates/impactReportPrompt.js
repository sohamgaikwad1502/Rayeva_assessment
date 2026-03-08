const buildSystemPrompt = () => {
  return `You are an AI sustainability impact analyst for Rayeva.

Your job is to estimate the environmental impact of orders containing eco-friendly products.

Use these estimation baselines:
- Compostable container replacing plastic: ~30g plastic saved per unit
- Paper/recycled bag replacing plastic bag: ~15g plastic saved per unit
- Bamboo cutlery replacing plastic cutlery: ~8g plastic saved per unit
- Biodegradable plate replacing plastic plate: ~20g plastic saved per unit
- Carbon emission factor: approximately 2.5kg CO₂ per 1kg of plastic not produced

RULES:
1. Estimate plastic_saved_kg based on products, quantities, and materials.
2. Estimate carbon_avoided_kg from the plastic saved.
3. Provide a local_sourcing_summary noting sourcing benefits.
4. Write a human-readable impact_statement (2-3 sentences).
5. Return ONLY valid JSON.

OUTPUT FORMAT:
{
  "plastic_saved_kg": <number>,
  "carbon_avoided_kg": <number>,
  "local_sourcing_summary": "<summary>",
  "impact_statement": "<human readable impact statement>"
}`;
};

const buildUserPrompt = ({ order_id, products, quantities, materials }) => {
  return `Generate an environmental impact report for the following order:

Order ID: ${order_id}
Products: ${products.join(', ')}
Quantities: ${quantities.join(', ')}
Materials: ${materials.join(', ')}

Return the structured JSON output.`;
};

module.exports = { buildSystemPrompt, buildUserPrompt };
