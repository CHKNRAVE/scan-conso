import { useEffect, useState } from "react";
import { DeleteButton } from "./DeleteButton";
import StatusDesc from "./StatusDesc";
import { getDismissedRecalls } from "./dismissedRecalls.mjs";

const verboseCodeTypes = {
	"ean_13": "Code-barres"
};

export default function CodeStatus({type, value, label, forceRefresh}) {
	const [status, setStatus] = useState("loading");
	const [data, setResults] = useState(null);
	const [errorDesc, setErrorDesc] = useState(null);
	const [forcedReloadCount, forceReload] = useState(0);
	const [ignoredCount, setIgnoredCount] = useState(0);

	const onFetchFailure = function(reason) {
		if(reason === "Cleaned up") return;
		console.error("Fetch failure on barcode", type, value, "\n", reason);
		setStatus("error");
		setErrorDesc(reason.message);
	};
	
	const onResponseBadStatusCode = function(response) {
		console.error("Bad response status code", response);
		setStatus("error");
		setErrorDesc(`Erreur ${response.status} dans la réponse de Signal Conso.`);
	};

	const onResponseParsingFailure = function(reason) {
		if(reason === "Cleaned up") return;
		console.error("Response parsing failure on barcode", type, value, "\n", reason);
		setStatus("error");
		setErrorDesc("Erreur inconnue à l'obtention des résultats.");
	};

	const onRequestSuccess = function(fetchedData) {
		const dismissedRecalls = getDismissedRecalls();
		const results = fetchedData?.results.filter(data => !dismissedRecalls.includes(data.rappel_guid));
		setResults(results);
		setIgnoredCount(fetchedData.results.length - results.length);
		setStatus(results.length > 0 ? "warning" : "clear");
	};

	useEffect(() => {
		const controller = new AbortController(), signal = controller.signal;
		const fetchUrl = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-trie/records?where=gtin%3D${value}`;
		fetch(fetchUrl, {signal}).then(response => {
			if(response.ok) return response.json().then(onRequestSuccess, onResponseParsingFailure);
			return onResponseBadStatusCode(response);
		}, onFetchFailure);

		return () => controller.abort("Cleaned up");
	}, [value, forcedReloadCount]);

	const ariaLabel = [verboseCodeTypes[type], ...value.split("")].join(" ");

	return <section className={`codeStatus ${status}`} data-height={data?.length || 1}>
		<div className="codeHeader">
			<h2 className="codeLabel">{label}</h2><br />
			<span aria-label={ariaLabel} className="codeDetails">{`${verboseCodeTypes[type]} ${value}`}</span>
			<DeleteButton codeType={type} codeValue={value} forceRefresh={forceRefresh} />
		</div>
		{data && data.map(recall => <StatusDesc key={recall.rappel_guid} recall={recall} forceReload={forceReload} />)}
		{status === "clear" && ignoredCount === 0 && <span className="statusDesc">Aucun rappel signalé !</span>}
		{status === "clear" && ignoredCount === 1 && <span className="statusDesc">1 rappel masqué</span>}
		{status === "clear" && ignoredCount > 1 && <span className="statusDesc">{`${ignoredCount} rappels masqués`}</span>}
		{status === "error" && <span className="statusDesc">Une erreur a été rencontrée.<br />{errorDesc}</span>}
	</section>
};