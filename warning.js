document.addEventListener("DOMContentLoaded", function() {
  // Listener for the "Back "button"
  document.getElementById("cancel").addEventListener("click", function() {
      history.back();
  });

  // Listener for the "Go Ahead button"
  document.getElementById("proceed").addEventListener("click", function() {
      const urlParams = new URLSearchParams(window.location.search);
      const originalUrl = urlParams.get("url");
      chrome.runtime.sendMessage({ type: "goForward", url: originalUrl });
  });
});
