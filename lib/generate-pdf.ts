import puppeteer from "puppeteer"

interface ItineraryData {
  enquiryId: string
  itineraryId: string
  formData: {
    destinations: string
    startDate: string
    endDate: string
    travelType: string
    adults: number
    children: number
    under6: number
    from7to12: number
    budget: number
    currency: string
    dailyItinerary: Array<{
      day: number
      date: string
      activities: string[]
      accommodation?: string
      meals?: string[]
    }>
    accommodation: Array<{
      name: string
      location: string
      checkIn: string
      checkOut: string
      roomType: string
    }>
  }
  enquiryData: {
    name: string
    email: string
    phone: string
    locations: string
    tourType: string
    budget: number
    currency: string
  }
}

export async function generateItineraryPDF(data: ItineraryData): Promise<{ pdfBuffer: Buffer; filename: string }> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  try {
    const page = await browser.newPage()

    // Calculate group size
    const groupSize = data.formData.adults + data.formData.children + data.formData.under6 + data.formData.from7to12

    // Format dates
    const formatDate = (dateStr: string) => {
      if (!dateStr) return ""
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    }

    const startDate = formatDate(data.formData.startDate)
    const endDate = formatDate(data.formData.endDate)

    // Generate HTML content matching the PDF template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.4;
          color: #333;
        }
        
        .header-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #2c5530 0%, #4a7c59 50%, #8fbc8f 100%);
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200"><path d="M0,100 C300,150 600,50 900,100 C1050,125 1150,75 1200,100 L1200,200 L0,200 Z" fill="rgba(255,255,255,0.1)"/></svg>');
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
        }
        
        .header-title {
          color: white;
          font-size: 36px;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header-logo {
          color: white;
          font-size: 24px;
          font-weight: bold;
        }
        
        .enquiry-section {
          background: #2c5530;
          color: white;
          padding: 15px 40px;
        }
        
        .enquiry-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        
        .enquiry-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .enquiry-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .enquiry-label {
          font-weight: 500;
        }
        
        .enquiry-value {
          font-weight: normal;
        }
        
        .itinerary-section {
          background: #2c5530;
          color: white;
          padding: 15px 40px;
          margin-top: 20px;
        }
        
        .itinerary-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .itinerary-subtitle {
          font-size: 14px;
          margin-bottom: 20px;
          opacity: 0.9;
        }
        
        .day-item {
          background: white;
          color: #333;
          margin-bottom: 20px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .day-header {
          background: #f8f9fa;
          padding: 12px 20px;
          border-left: 4px solid #2c5530;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .day-number {
          background: #2c5530;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }
        
        .day-title {
          font-weight: bold;
          font-size: 16px;
        }
        
        .day-date {
          color: #666;
          font-size: 14px;
          margin-left: auto;
        }
        
        .day-content {
          padding: 20px;
        }
        
        .activity-list {
          list-style: none;
        }
        
        .activity-item {
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }
        
        .activity-item:before {
          content: "•";
          color: #2c5530;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        @media print {
          .header-image {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .enquiry-section, .itinerary-section {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <!-- Header with mountain background -->
      <div class="header-image">
        <div class="header-title">${data.formData.destinations || "Kashmir Bliss"}</div>
        <div class="header-logo">elneera</div>
      </div>
      
      <!-- Enquiry Details Section -->
      <div class="enquiry-section">
        <div class="enquiry-title">Enquiry Details</div>
        <div class="enquiry-grid">
          <div>
            <div class="enquiry-item">
              <span class="enquiry-label">Traveler Name</span>
              <span class="enquiry-value">${data.enquiryData.name}</span>
            </div>
            <div class="enquiry-item">
              <span class="enquiry-label">Travel Dates</span>
              <span class="enquiry-value">${startDate} - ${endDate}</span>
            </div>
            <div class="enquiry-item">
              <span class="enquiry-label">Destination(s)</span>
              <span class="enquiry-value">${data.formData.destinations}</span>
            </div>
            <div class="enquiry-item">
              <span class="enquiry-label">Group Size</span>
              <span class="enquiry-value">${groupSize}</span>
            </div>
            <div class="enquiry-item">
              <span class="enquiry-label">Travel Type</span>
              <span class="enquiry-value">${data.formData.travelType || "Family"}</span>
            </div>
            <div class="enquiry-item">
              <span class="enquiry-label">Budget Range</span>
              <span class="enquiry-value">${data.formData.currency}${data.formData.budget}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Day-Wise Itinerary Section -->
      <div class="itinerary-section">
        <div class="itinerary-title">Day-Wise Itinerary</div>
        <div class="itinerary-subtitle">Your Day-by-Day Journey</div>
        
        ${
          data.formData.dailyItinerary && data.formData.dailyItinerary.length > 0
            ? data.formData.dailyItinerary
                .map(
                  (day, index) => `
            <div class="day-item">
              <div class="day-header">
                <div class="day-number">${day.day || index + 1}</div>
                <div class="day-title">Day ${day.day || index + 1}</div>
                <div class="day-date">${day.date || ""}</div>
              </div>
              <div class="day-content">
                <ul class="activity-list">
                  ${
                    day.activities && day.activities.length > 0
                      ? day.activities.map((activity) => `<li class="activity-item">${activity}</li>`).join("")
                      : '<li class="activity-item">Activities to be planned</li>'
                  }
                </ul>
                ${day.accommodation ? `<p style="margin-top: 15px; font-weight: bold;">Accommodation: ${day.accommodation}</p>` : ""}
                ${day.meals && day.meals.length > 0 ? `<p style="margin-top: 10px;">Meals: ${day.meals.join(", ")}</p>` : ""}
              </div>
            </div>
          `,
                )
                .join("")
            : `
            <div class="day-item">
              <div class="day-header">
                <div class="day-number">1</div>
                <div class="day-title">Day 1</div>
                <div class="day-date">${startDate}</div>
              </div>
              <div class="day-content">
                <ul class="activity-list">
                  <li class="activity-item">Arrive in ${data.formData.destinations} and check into your hotel</li>
                  <li class="activity-item">Explore the local area and get oriented</li>
                  <li class="activity-item">Welcome dinner at a local restaurant</li>
                  <li class="activity-item">Rest and prepare for tomorrow's adventures</li>
                </ul>
              </div>
            </div>
            
            <div class="day-item">
              <div class="day-header">
                <div class="day-number">2</div>
                <div class="day-title">Day 2</div>
                <div class="day-date">${new Date(new Date(data.formData.startDate).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
              </div>
              <div class="day-content">
                <ul class="activity-list">
                  <li class="activity-item">Full day sightseeing tour</li>
                  <li class="activity-item">Visit major attractions and landmarks</li>
                  <li class="activity-item">Local cuisine experience</li>
                  <li class="activity-item">Evening at leisure</li>
                </ul>
              </div>
            </div>
          `
        }
      </div>
    </body>
    </html>
    `

    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfUint8Array = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    })

    const pdfBuffer = Buffer.from(pdfUint8Array)
    const filename = `itinerary-${data.enquiryData.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`

    return { pdfBuffer, filename }
  } finally {
    await browser.close()
  }
}
