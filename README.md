# 🧭 AI-Powered Travel Itinerary Generator

Generate beautiful, day-wise travel itineraries with maps, real-time data, and downloadable PDFs — powered by **Gemini AI** and **Google Places API**.

## ✨ Features

- 🤖 **AI-generated itineraries** based on user preferences
- 🗺️ **Static maps** for each day’s route using Google Static Maps
- 📍 **Real-time place details** using Google Places API (SearchText + Place Photos)
- 🖼️ Auto-fetched **images**, maps, reviews, and directions
- 📄 **Stylish PDF generation** using Puppeteer and HTML/CSS
- 🔗 Clickable route links and place pages in the PDF
- 🛡️ Rate limiting to prevent abuse (max 5 requests per session)

---

## 🛠️ Tech Stack

| Layer              | Technology                                      |
|-------------------|-------------------------------------------------|
| Backend            | Node.js, Express.js                            |
| AI Integration     | Gemini 2.5 Flash Lite Preview (Google AI Studio) |
| External APIs      | Google Places API, Google Maps Static API      |
| PDF Generation     | Puppeteer, HTML, CSS                           |
| Rate Limiting      | express-rate-limit                             |

---

## 📬 API Usage

### Endpoint

```
POST /api/itinerary
```

### Example Input

```json
{
  "city": "London",
  "startDate": "2025-08-01",
  "endDate": "2025-08-02",
  "interests": ["iconic", "market", "bar"],
  "budget": "flexible",
  "pace": "slow"
}
```

### Example Output

- Server responds with a downloadable PDF file:
  ```
  Content-Disposition: attachment; filename="itinerary.pdf"
  ```

- Contains:
  - Day-wise activities, restaurants, and nearby places
  - Google Maps links (place page, reviews, directions)
  - Static map snapshot
  - Clickable route link for each day

---

## 🖼️ Screenshots 

- 🔗 Postman
![Image](https://github.com/user-attachments/assets/b4429903-05b5-46c1-bac8-ec04a09994d7)
- 📍 3-column layout with image, name, address, and buttons
![Image](https://github.com/user-attachments/assets/50130fbb-b507-4b50-a2d8-4a8013538c5c)
![Image](https://github.com/user-attachments/assets/09d1c005-588b-42d8-b3f6-8a2c30f2ff6c)
- 🗺️ Static map preview with markers
![Image](https://github.com/user-attachments/assets/16e39498-f406-47a4-bbc0-d5d856a3e500)

---

## 🔐 Rate Limiting

To protect against abuse and stay within Google & Gemini API limits, we use `express-rate-limit`.

- Limit: `5 requests per session`
- Resets on server restart (for now)

---

## 🧠 Gemini Model Used

- Model: `gemini-2.5-flash-lite-preview-06-17`
- Cost-efficient and fast response
- Supports up to **64,000 tokens per minute** input

---

## 💡 Future Scope

- ✈️ Real-time flight info
- 🏨 Hotel availability & pricing
- 🌐 Public frontend with shareable trip links
- 📌 Map preview using Google Maps UI Kit

---

## 🤝 Author

**Swarup Patil**  
🔗 [LinkedIn](https://www.linkedin.com/in/swarup-santosh-patil/)  
💻 [GitHub](https://github.com/Swarup-Patil)

---

## 📄 License

This project is licensed under the MIT License.

---