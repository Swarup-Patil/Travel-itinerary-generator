// placeDetail.js
import axios from "axios";

export const placeDetail = async (query) => {
  try {
    const response = await axios.post(
      `https://places.googleapis.com/v1/places:searchText?key=${process.env.API_KEY}`,
      {
        textQuery: `${query}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.googleMapsLinks,places.photos",
        },
      }
    );

    const place = response.data?.places?.[0];
    if (!place) return null;

    const photoName = place.photos?.[0]?.name;
    const photoURL = photoName
      ? `https://places.googleapis.com/v1/${photoName}/media?key=${process.env.API_KEY}&maxHeightPx=400`
      : null;

    return {
      ...place,
      photoURL,
    };
  } catch (error) {
    console.error("Error fetching place detail:", error.response?.data || error.message);
    return null;
  }
};
