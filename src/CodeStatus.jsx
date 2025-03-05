import { useEffect, useState } from "react";
import { DeleteButton } from "./DeleteButton";
import StatusDesc from "./StatusDesc";

const verboseCodeTypes = {
	"ean_13": "Code-barres"
};

export default function CodeStatus({type, value, label, forceRefresh}) {
	const [status, setStatus] = useState("loading");
	const [data, setData] = useState(null);
	const [errorDesc, setErrorDesc] = useState(null);

	const onFetchFailure = function(reason) {
		if(reason === "Cleaned up") return Promise.reject(reason);
		console.error("Fetch failure on barcode", type, value, "\n", reason);
		setStatus("error");

		return Promise.reject();
	};

	const onResponseParsingFailure = function(reason) {
		if(reason === "Cleaned up") return;
		console.error("Fetch failure on barcode", type, value, "\n", reason);
		setStatus("error");
	};

	const onRequestSuccess = function(fetchedData) {
		setData(fetchedData.results);
		setStatus(fetchedData.total_count > 0 ? "warning" : "clear");
	};

	useEffect(() => {
		const controller = new AbortController(), signal = controller.signal;
		const fetchUrl = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-trie/records?where=gtin%3D${value}`;
		fetch(fetchUrl, {signal}).then(response => response.json(), onFetchFailure).then(onRequestSuccess, onResponseParsingFailure);

		return () => controller.abort("Cleaned up");
	}, [value]);

	return <div className={`codeStatus ${status}`} data-height={data?.length || 1}>
		<div className="codeHeader">
			<DeleteButton codeType={type} codeValue={value} forceRefresh={forceRefresh} />
			<span className="codeLabel">{label}</span><br />
			<span className="codeDetails">{verboseCodeTypes[type]} {value}</span>
		</div>
		{data && data.map(recall => <StatusDesc key={recall.rappel_guid} recall={recall} />)}
		{status === "clear" && <span className="statusDesc">Aucun rappel signalé !</span>}
		{status === "error" && <span className="statusDesc">Erreur lors de l'obtention des résultats.<br />{errorDesc}</span>}
	</div>
};