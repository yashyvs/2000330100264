const express = require("express");
const axios = require("axios");
const async = require("async");

const app = express();
const port = 8008;

app.get("/numbers", async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res
      .status(400)
      .json({ error: 'Invalid or missing "url" parameter.' });
  }

  const validUrls = urls.filter((url) => isValidUrl(url));

  if (validUrls.length === 0) {
    return res.status(400).json({ error: "No valid URLs provided." });
  }

  try {
    const numbersArray = await fetchNumbersFromUrls(validUrls);
    const mergedNumbers = mergeAndSortNumbers(numbersArray);
    return res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ error: "Error processing the request." });
  }
});

function isValidUrl(url) {
  // Add your validation logic here if required
  return true;
}

async function fetchNumbersFromUrls(urls) {
  const promises = urls.map((url) => {
    return axios
      .get(url)
      .then((response) => response.data.numbers)
      .catch(() => []); // Ignore errors and return an empty array for invalid URLs or timeouts
  });

  const timeout = 500; // Timeout in milliseconds
  const options = { timeout };

  return await async.timeout(async.parallel(promises), timeout, options);
}

function mergeAndSortNumbers(numbersArray) {
  const mergedSet = new Set();
  numbersArray.forEach((numbers) => {
    numbers.forEach((number) => mergedSet.add(number));
  });

  return Array.from(mergedSet).sort((a, b) => a - b);
}

app.listen(port, () => {
  console.log(
    `Number Management Service listening at http://localhost:${port}`
  );
});
