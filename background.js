// Array to store blocked domains
let blockedDomains = [];

// Timestamp for the last fetch and duration to cache the fetched data (in milliseconds)
let lastFetchTime = null;
const cacheDuration = 60 * 1000; // 60 seconds

// Temporarily allowed domain
let temporarilyAllowedDomain = null;

// Function to fetch blocked domains from the server API
async function fetchBlockedDomains() {
  const currentTime = new Date().getTime();

  // Check if the data is already in the cache and not expired
  if (blockedDomains.length > 0 && lastFetchTime && currentTime - lastFetchTime < cacheDuration) {
    return blockedDomains;
  }

  try {
    // Fetch data from the server API
    const response = await fetch("API_URL_HERE"); // Replace "API_URL_HERE" with the actual API endpoint
    if (!response.ok) {
      throw new Error("Error in server API request");
    }

    // Parse the response JSON and update the blocked domains array
    const data = await response.json();
    blockedDomains = data.map(item => item.domain);
    lastFetchTime = new Date().getTime();
    return blockedDomains;
  } catch (error) {
    console.error("Error retrieving blocked domains:", error);
    return [];
  }
}

// Function to extract the top-level domain from a URL
function extractDomain(url) {
  if (!url) {
    return null;
  }

  const domain = url.split("://").pop().split("/")[0];
  const domainParts = domain.split(".");
  const tld = domainParts.slice(-2).join(".");
  return tld;
}

// Event listener for handling navigation before it happens
async function onBeforeNavigate(details) {
  // Fetch the current list of blocked domains
  const currentBlockedDomains = await fetchBlockedDomains();
  const domain = extractDomain(details.url);

  // Check if the domain is in the list of blocked domains and not temporarily allowed
  if (details.url && currentBlockedDomains.includes(domain) && domain !== temporarilyAllowedDomain) {
    // Redirect the tab to a warning page
    chrome.tabs.update(details.tabId, {
      url: `warning.html?url=${encodeURIComponent(details.url)}`
    });
  }
}

// Register the event listener for web navigation before it happens
chrome.webNavigation.onBeforeNavigate.addListener(onBeforeNavigate);

// Event listener for handling runtime messages
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "goForward") {
    // Extract the domain from the message URL and temporarily allow it
    const domain = extractDomain(message.url);
    if (domain) {
      temporarilyAllowedDomain = domain;
      // Update the tab to navigate forward to the specified URL
      chrome.tabs.update(sender.tab.id, { url: message.url });
    }
  }
});
