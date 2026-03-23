self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("Service Worker Active");
});

self.addEventListener("fetch", event => {
});
