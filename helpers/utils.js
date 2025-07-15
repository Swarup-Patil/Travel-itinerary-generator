import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { createPDF } from './pdfgenerator.js';

//download image from url to temp folder
export const downloadImage = async (imageUrl, destFolder, filename) => {
  try {
    const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imagePath = path.join(destFolder, filename);
    await fs.writeFile(imagePath, res.data);
    return imagePath;
  } catch (error) {
    console.error('Failed to download image:', error.message);
    throw error;
  }
};

//create a temp folder to store images with id
export const createTempFolder = async () => {
  const id = uuidv4();
  const folderPath = path.join('tmp', `itinerary-${id}`);
  await fs.mkdir(folderPath, { recursive: true });
  return folderPath;
};

//delete temo folder to remove all our images
export const cleanUpFolder = async (folderPath) => {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    // console.log(`Cleaned up ${folderPath}`);
  } catch (err) {
    console.error(`Failed to clean up ${folderPath}`, err);
  }
};

//pdf generation 
export const processItineraryToPDF = async (images, itineraryData) => {
  const tempFolder = await createTempFolder();
  try {
    const downloadedImages = [];
    for (const img of images) {
      const imgPath = await downloadImage(img.url, tempFolder, img.name);
      downloadedImages.push({ ...img, path: imgPath });
    }

     for (const day of itineraryData.itinerary) {
      // Activities.
      for (const act of day.activities || []) {
        if (act.id) {
          const match = downloadedImages.find(img => img.name === act.id);
          if (match) act.details.photo = match.path;
        }
      }

      // Restaurants
      for (const rest of day.restaurants || []) {
        if (rest.id) {
          const match = downloadedImages.find(img => img.name === rest.id);
          if (match) rest.details.photo = match.path;
        }
      }

      // Nearby Recommendations
      for (const near of day.nearby_recommendations || []) {
        if (near.id) {
          const match = downloadedImages.find(img => img.name === near.id);
          if (match) near.details.photo = match.path;
        }
      }

    }

    const pdfPath = path.join(tempFolder, 'itinerary.pdf');
    await createPDF(itineraryData, pdfPath);

    return pdfPath;
  } catch (error) {
    console.error('Error processing itinerary:', error);
    return error;
  } 
  finally {
    setTimeout(() => cleanUpFolder(tempFolder), 10000); 
  }
};
