const axios = require("axios");

async function getRecommendation(activity, history) {
  try {
    const response = await axios.post(
      "http://localhost:8001/recommend",
      {
        activity,
        history
      }
    );

    return response.data;
  } catch (error) {
    console.error("Python service error:", error.message);
  }
}

module.exports = { getRecommendation };