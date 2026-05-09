const axios = require("axios");

async function getRecommendation(activity, history) {
  try {
    const response = await axios.post("https://habit-ai-service.onrender.com/recommend", {
      activity,
      history,
    });

    return response.data;
  } catch (error) {
    console.error("Python service error:", error.response?.data || error.message);
    return null;
  }
}

module.exports = { getRecommendation }; 
