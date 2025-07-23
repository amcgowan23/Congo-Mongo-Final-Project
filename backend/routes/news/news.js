import express from "express";
import fetch from "node-fetch";
const router = express.Router();

const baseUrl = "https://newsapi.org/v2/top-headlines";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.log(
    "Please set the API_KEY environment variable with a valid newsapi.org apiKey and restart the server!"
  );
  process.exit(0);
}

function addApiKey(queryObject) {
  return { ...queryObject, apiKey: apiKey };
}

function createUrlFromQueryObject(queryObjectWithApiKey) {
  const queryString = new URLSearchParams(queryObjectWithApiKey).toString();
  const url = baseUrl + "?" + queryString;
  return url;
}

async function fetchData(url) {
  let data = null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// ✅ GET: use hardcoded query
router.get("/", async (req, res) => {
  let fixedQueryObject = {
    country: "us",
    q: "news",
  };
  let queryObject = addApiKey(fixedQueryObject);
  let url = createUrlFromQueryObject(queryObject);
  let newsArticles = await fetchData(url);
  res.send(newsArticles);
});

// ✅ POST: accept query object from request body
router.post("/", async (req, res) => {
  let query = req.body;
  let queryObjectWithApiKey = addApiKey(query);
  let url = createUrlFromQueryObject(queryObjectWithApiKey);
  let newsArticles = await fetchData(url);
  res.send(newsArticles);
});

export default router;
