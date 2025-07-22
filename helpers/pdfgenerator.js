// pdfGenerator.js
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();
import { createClient } from "pexels";

const client = createClient(`${process.env.PEXEL_KEY}`);

export const createPDF = async (itineraryData, outputPath) => {
  let backgroundPhoto;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const query = itineraryData.city;

    const photos = await client.photos.search({
      query,
      per_page: 1,
      orientation: "landscape",
    });

    if (photos.photos.length > 0) {
      backgroundPhoto = photos.photos[0].src.landscape;
    }

    const html = generateHTML(itineraryData, backgroundPhoto);
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: outputPath, format: "A4", printBackground: true });

    await browser.close();
  } catch (err) {
    console.log(err, "Error");
  }
};

function generateHTML({ city, itinerary }, backgroundPhoto) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500;1,600;1,800;1,900&display=swap" rel="stylesheet">
        <title>${city} Itinerary</title>
        <style>
        * {
            box-sizing: border-box;
          }
          body {
            font-family: "Poppins", sans-serif;
            background: #eaf1e5;
            color: #717ca4;
          }
          .cover {
            background-image: url('${backgroundPhoto}');
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            width: 100%;
            height: 250px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }

          .cover::before {
            content: "";
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1;
          }

          .cover h1 {
            color: white !important;
            font-weight: 700;
            font-style: normal;
            font-size: 40px;
            margin: 0;
            text-align: center;
            z-index: 2;
          }

          h4 {
            font-size: 20px;
            color: #0d239d !important;
            font-weight: 500;
            text-decoration: underline;
          }
        
          h3 {
           color: #0d239d !important;
            margin-bottom: 5px;
            font-size:24px;
            font-weight: 600;
            font-style: normal;
          }
          .route {
            font-size: 16px;
            font-weight: 400;
          }

          .break-page {
            break-before: page;
          }
          .day-section {
            margin-bottom: 40px;
            padding:0 20px;
          }
          .map {
            text-align: center;
            margin: 20px 0;
          }
          .cards {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .card {
            padding: 12px 0;
            width: 100%;
            display:flex;
            align-items: flex-start;
            flex-shrink: 0;
            color: #717ca4;
          }

          strong {
            color: #0d239d !important;
            font-size:18px;
            font-weight:500;
            margin-bottom: 10px;
          }

          .locationimg {
            width: 35% !important;
            height: 200px !important;
            object-fit: cover;
            margin-right: 20px;
            margin-bottom: 8px;
          }

          p {
            font-size: 14px;
            font-weight: 400;
            margin: 0 0 5px 0;
          }

          .links a {
            margin-right: 10px;
            font-size: 14px;
            font-weight: 400;
          }

        </style>
      </head>
      <body>
      <div class="cover">
          <h1>${itinerary.length}-Day ${city} Itinerary</h1>
      </div>

        ${itinerary
          .map(
            (day, index) => `
            ${index > 0 ? '<div class="break-page"></div>' : ""}
            <div class="day-section">
              <h3>📍 Day ${index + 1}</h3>
              <a class="route" href="${
                day.direction_url
              }" target="_blank">View Route</a>
              <div class="map">
                <img src="${day.static_map_url}" alt="Map for Day ${
              index + 1
            }" />
              </div>

              <h4>Activities</h4>
              <div class="cards">
                ${day.activities
                  .map(
                    (act) => `
                    <div class="card">
                      <img src="${act.details.photo}" alt="${act.title}" class="locationimg" />
                      <div>
                      <strong>${act.details.displayName}</strong>
                      <p>📍 ${act.details.formattedAddress}</p>
                      <p>${act.description}</p>
                      <p>${act.tip}</p>
                      <div class="links">
                        <a href="${act.details.googleMapsLinks.placeUri}">Place</a>
                        <a href="${act.details.googleMapsLinks.directionsUri}">Directions</a>
                        <a href="${act.details.googleMapsLinks.reviewsUri}">Reviews</a>
                      </div>
                      </div>
                    </div>`
                  )}
              </div>

              <h4>Restaurants</h4>
              <div class="cards">
                ${day.restaurants
                  .map(
                    (rest) => `
                    <div class="card">
                      <img src="${rest.details.photo}" alt="${rest.name}" class="locationimg" />
                      <div>
                      <strong>${rest.details.displayName}</strong>
                      <p>📍 ${rest.details.formattedAddress}</p>
                      <div class="links">
                        <a href="${rest.details.googleMapsLinks.placeUri}">Place</a>
                        <a href="${rest.details.googleMapsLinks.directionsUri}">Directions</a>
                        <a href="${rest.details.googleMapsLinks.reviewsUri}">Reviews</a>
                      </div>
                      </div>
                    </div>`
                  )}
              </div>

              <h4>Nearby Recommendations</h4>
              <div class="cards">
                ${day.nearby_recommendations
                  .map(
                    (near) => `
                    <div class="card">
                      <img src="${near.details.photo}" alt="${near.name}" class="locationimg"/>
                      <div>
                      <strong>${near.details.displayName}</strong>
                      <p>📍 ${near.details.formattedAddress}</p>
                      <p>${near.description}</p>
                      <p>${near.tip}</p>
                      <div class="links">
                        <a href="${near.details.googleMapsLinks.placeUri}">Place</a>
                        <a href="${near.details.googleMapsLinks.directionsUri}">Directions</a>
                        <a href="${near.details.googleMapsLinks.reviewsUri}">Reviews</a>
                      </div>
                      </div>
                    </div>`
                  )}
              </div>
            </div>`
          )}
      </body>
    </html>
  `;
}
