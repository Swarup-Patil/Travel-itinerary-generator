import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

import { buildPrompt } from "../helpers/buildprompt.js";
import { placeDetail } from "../helpers/API/placedetail.js";
import { responseJsonSchema } from "../helpers/responseschema.js";
import { processItineraryToPDF } from "../helpers/utils.js";
import { buildDirectionURL, buildStaticMapURL } from "../helpers/map.js";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const MODEL = "gemini-2.5-flash-lite-preview-06-17";

export const generateItinerary = async (req, res) => {
  try {
    const { city, startDate, endDate, interests, budget, pace } = req.body;
    const imageList = [];

    if (!city || !startDate || !endDate || !interests || !budget || !pace) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = buildPrompt(req.body);

    //Use Gemini to generate content
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseJsonSchema,
      },
    });

    let responseText = await result.text;
    let cleanedText = responseText.replace(/```json|```/g, "").trim();
    let parsed = JSON.parse(cleanedText);

    // Normalize to array
    let itinerary;
    if (Array.isArray(parsed)) {
      itinerary = parsed;
    } else if (parsed?.itinerary) {
      itinerary = Array.isArray(parsed.itinerary)
        ? parsed.itinerary
        : [parsed.itinerary];
    } else if (parsed?.date && parsed?.activities) {
      itinerary = [parsed];
    } else {
      throw new Error("Invalid itinerary format received from Gemini.");
    }

    // let itinerary = airesult.itinerary;
    // console.log(itinerary , "itinerary")

    //get details for all places
    for (const day of itinerary) {
      const date = day.date;
      const allPlaces = [];

      for (const activity of day.activities) {
        const query = `${activity.title}, ${activity.location}`;
        const detail = await placeDetail(query);
        if (detail?.photoURL) {
          imageList.push({
            url: detail.photoURL,
            name: `${detail.id}`,
          });
        }
        if (detail?.id) allPlaces.push(detail.id);
        if (detail) {
          // console.log(detail, "Detail toh aya ");
          activity.details = {
            id: detail.id,
            formattedAddress: detail.formattedAddress,
            googleMapsUri: detail.googleMapsUri,
            googleMapsLinks: detail.googleMapsLinks,
            displayName: detail.displayName?.text,
            photo: detail.photoURL || null,
          };
        }
      }

      for (const rest of day.restaurants) {
        const query = `${rest.name}, ${rest.location}`;
        const detail = await placeDetail(query);
        if (detail?.photoURL) {
          imageList.push({
            url: detail.photoURL,
            name: `${detail.id}`,
          });
        }
        if (detail?.id) allPlaces.push(detail.id);
        if (detail) {
          rest.details = {
            id: detail.id,
            formattedAddress: detail.formattedAddress,
            googleMapsUri: detail.googleMapsUri,
            googleMapsLinks: detail.googleMapsLinks,
            displayName: detail.displayName?.text,
            photo: detail.photoURL || null,
          };
        }
      }

      for (const nearby of day.nearby_recommendations) {
        const query = `${nearby.name}, ${nearby.location}`;
        const detail = await placeDetail(query);
        if (detail?.photoURL) {
          imageList.push({
            url: detail.photoURL,
            name: `${detail.id}`,
          });
        }
        if (detail?.id) allPlaces.push(detail.id);
        if (detail) {
          nearby.details = {
            id: detail.id,
            formattedAddress: detail.formattedAddress,
            googleMapsUri: detail.googleMapsUri,
            googleMapsLinks: detail.googleMapsLinks,
            displayName: detail.displayName?.text,
            photo: detail.photoURL || null,
          };
        }
      }

      day.direction_url = buildDirectionURL(allPlaces);
      day.static_map_url = buildStaticMapURL(
        day.activities.map((a) => a.location)
      );
    }

    // console.log(JSON.stringify(itinerary, null, 2));

    const pdfPath = await processItineraryToPDF(imageList, {
      itinerary,
      city,
      startDate,
      endDate,
    });

    return res.download(path.resolve(pdfPath), "itinerary.pdf");
  } catch (err) {
    console.error(err, "error found");
    res.status(500).json({ error: "Server Error found , Please try again", errormessage: err.message });
  }
};
