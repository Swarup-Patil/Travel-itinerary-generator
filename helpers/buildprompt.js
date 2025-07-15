import { differenceInCalendarDays, parseISO } from 'date-fns';

export const buildPrompt = ({ city, startDate, endDate, interests, budget, pace }) => {
  const daysCount = differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1;

  return `
You are a travel itinerary expert. Generate a ${pace.toLowerCase()} ${budget.toLowerCase()} ${daysCount}-day travel itinerary for a user visiting ${city} from ${startDate} to ${endDate}, focusing on the following interests: ${interests.join(", ")}.

Each day must include the following in structured JSON:
- date and day_of_week
- hotel_suggestion: { name, location }
- activities (morning, afternoon, evening):
  - For each activity: { title (just the place name, no action words), location, type (e.g. landmark, ${interests.join(", ")} etc.) , time_of_day , description (2 line short summary), tip (one liner)} - Do NOT include food or restaurant-based activities
- restaurants: an array of 3 { name, location } suggestions (breakfast, lunch, dinner if possible) - Ensure these restaurants are located close to or near the activities of that day
- nearby_recommendations: 2 locations { name, location, type,  description (2 line short summary), tip (one liner) }
- estimated_cost: a realistic string in INR (e.g., "₹6500")

Respond ONLY in structured JSON. Do not include any explanations, markdown, or extra text.`;
};
