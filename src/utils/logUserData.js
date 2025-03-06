import { ref, push } from "firebase/database";
import { db } from "../firebase";
import axios from "axios";

export const logUserData = async () => {
  try {
    // Get browser information
    const browserInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };

    // Get location data using an IP API
    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    const ipAddress = ipResponse.data.ip;

    const locationResponse = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
    const locationData = {
      ip: ipAddress,
      city: locationResponse.data.city,
      region: locationResponse.data.region,
      country: locationResponse.data.country_name,
      timezone: locationResponse.data.timezone,
    };

    // Combine browser and location data
    const logData = {
      timestamp: new Date().toISOString(),
      browser: browserInfo,
      location: locationData,
    };

    // Save log data to Realtime Database
    const logsRef = ref(db, "visitorLogs");
    push(logsRef, logData);
    console.log("Log data saved successfully!");
  } catch (error) {
    console.error("Error logging user data:", error);
  }
};