export const responseJsonSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      date: { type: "string" },
      day_of_week: { type: "string" },
      hotel_suggestion: {
        type: "object",
        properties: {
          name: { type: "string" },
          location: { type: "string" }
        },
        required: ["name", "location"]
      },
      activities: {
        type: "array",
        items: {
          type: "object",
          properties: {
            time_of_day: { type: "string" },
            title: { type: "string" },
            location: { type: "string" },
            type: { type: "string" },
            description: { type: "string" },
            tip: { type: "string"},
          },
          required: ["time_of_day", "title", "location", "type" , "description" , "tip"]
        }
      },
      restaurants: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            location: { type: "string" }
          },
          required: ["name", "location"]
        },
        minItems: 3,
        maxItems: 3
      },
      nearby_recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            type: { type: "string" },
            description: { type: "string" },
            tip: { type: "string"},
          },
          required: ["name", "type", "description" , "tip"]
        }
      },
      estimated_cost: { type: "string" }
    },
    required: [
      "date",
      "day_of_week",
      "hotel_suggestion",
      "activities",
      "restaurants",
      "nearby_recommendations",
      "estimated_cost"
    ]
  }
};
