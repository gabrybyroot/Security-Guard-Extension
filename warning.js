document.addEventListener("DOMContentLoaded", function() {
  // Listener per il bottone "Torna indietro"
  document.getElementById("cancel").addEventListener("click", function() {
      history.back();
  });

  // Listener per il bottone "Vai avanti"
  document.getElementById("proceed").addEventListener("click", function() {
      const urlParams = new URLSearchParams(window.location.search);
      const originalUrl = urlParams.get("url");
      chrome.runtime.sendMessage({ type: "goForward", url: originalUrl });
  });
});
