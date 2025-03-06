let barcodes = {};
let lastChecked = new Date();

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener('message', ev => {
	const barcodesJson = ev.data.data;
	barcodes = JSON.parse(barcodesJson);
	lastChecked = new Date();
	// console.log("Ready for periodic sync");
});

self.addEventListener("periodicsync", (ev) => {
	const fetchPromises = Promise.all(Object.keys(barcodes).map(gtin => {
		return new Promise((resolve, reject) => {
			const fetchUrl = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-trie/records?where=gtin%3D${gtin}`;
			fetch(fetchUrl).then(response => response.json(), Promise.reject).then(resolve, reject);
		});
	}));
	fetchPromises.then(dataArray => {
		const gtinWithRecentRecalls = dataArray.filter(data => {
			return data.results.some(result => {
				const publicationDate = new Date(result.date_publication);
				return Number(publicationDate) > Number(lastChecked);
			});
		});
		lastChecked = new Date();
		if(gtinWithRecentRecalls.length > 0) ev.target.registration.showNotification("Scan Conso", {
			body: "Un nouveau rappel a été trouvé dans vos articles !",
			badge: "./favicon.svg",
			icon: "./favicon.svg",
			lang: "FR",
			renotify: false,
			requireInteraction: true,
			vibrate: true
		});
	}, console.warn);
});