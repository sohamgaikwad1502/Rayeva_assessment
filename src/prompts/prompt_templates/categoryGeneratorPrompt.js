const VALID_CATEGORIES = [
  'Packaging',
  'Kitchen',
  'Personal Care',
  'Office Supplies',
  'Cleaning',
  'Lifestyle',
];

const VALID_SUSTAINABILITY_FILTERS = [
  'plastic-free',
  'compostable',
  'vegan',
  'recycled',
  'biodegradable',
  'organic',
  'carbon-neutral',
];

const buildSystemPrompt = () => {
  return `You are an AI product categorization engine for Rayeva, a sustainability-focused e-commerce platform.

Your job is to analyze eco-friendly product information and return structured metadata.

RULES:
1. You MUST assign a primary_category from EXACTLY this list: ${VALID_CATEGORIES.join(', ')}.
2. You MUST suggest a descriptive sub_category (e.g., "Compostable Food Containers", "Bamboo Toothbrush", "Reusable Bags").
3. You MUST generate 5 to 10 SEO tags as lowercase strings relevant to the product and sustainability.
4. You MUST select sustainability_filters ONLY from this list: ${VALID_SUSTAINABILITY_FILTERS.join(', ')}.
5. Return ONLY valid JSON — no markdown, no explanation, no extra text.

OUTPUT FORMAT (strict JSON):
{
  "primary_category": "<one of the valid categories>",
  "sub_category": "<descriptive sub-category>",
  "seo_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "sustainability_filters": ["filter1", "filter2"]
}`;
};

const buildUserPrompt = ({ product_name, description, material, usage, brand }) => {
  return `Analyze the following eco-friendly product and generate categorization metadata:

Product Name: ${product_name}
Description: ${description || 'N/A'}
Material: ${material || 'N/A'}
Usage: ${usage || 'N/A'}
Brand: ${brand || 'N/A'}

Return the structured JSON output.`;
};

module.exports = {
  buildSystemPrompt,
  buildUserPrompt,
  VALID_CATEGORIES,
  VALID_SUSTAINABILITY_FILTERS,
};
