export default function initializeServiceWorker() {
	// console.log("Initialize service worker");
	if ("serviceWorker" in navigator) {
		// console.log("Browser can use service workers");
		if(!navigator.serviceWorker.controller) {
			// console.log("Doesn't have a controller yet");
			navigator.serviceWorker.register("/service-worker.js").then(registration => {
				registration.showNotification("Scan Conso", {
					body: "Les vérifications périodiques sont activées, et voilà à quoi ressemblent vos notifications !",
					badge: "./favicon.svg",
					icon: "./favicon.svg",
					lang: "FR",
					renotify: false,
					requireInteraction: true,
					vibrate: true
				});
				navigator.serviceWorker.ready.then(onServiceWorkerReady);
				
			}, err => console.error("SW Registration Failed:", err));
		} else {
			// console.log("Already has a controller");
			navigator.serviceWorker.ready.then(registration => {
				registration.update();
				onServiceWorkerReady(registration);
			});	
		};
	};
};
const onServiceWorkerReady = function(registration) {
	// console.log("Service worker is ready");
	sendBarcodesToWorker(registration);
	const appIsInstalled = window.matchMedia('(display-mode: standalone)').matches;
	if(appIsInstalled) registerPeriodicSync(registration);
};

const sendBarcodesToWorker = function(registration) {
	const data = localStorage.getItem("ean_13") || {};
	// console.log("Sending barcodes to worker...");
	registration.active.postMessage({ type: "ean_13", data });
};

const registerPeriodicSync = function(registration) {
	// console.log("Registering periodic sync");
	const twelveHours = 12 * 60 * 60 * 1000;
	registration.periodicSync.register("sync-data", {
		minInterval: twelveHours
	});
};

export function deleteServiceWorkers() {
	navigator.serviceWorker.getRegistrations().then(registrations => {
		registrations.forEach(reg => reg.unregister());
	});
};