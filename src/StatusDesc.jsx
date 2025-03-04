export default function StatusDesc({recall}) {
	const identificationStrings = recall.identification_produits.split("|").map(string => {
		const possibleSplits = [
			"$date limite de consommation$",
			"$date de durabilité minimale$"
		];
		let split;
		for(const splitString of possibleSplits) {
			if(!string.includes(splitString)) continue;
			split = string.split(splitString);

		}
		if(split) return {
			barcode: split[0].split("$")[0],
			bunchNumber: split[0].split("$")[1],
			expirationDate: new Date(split[1].slice(0, -1)).toLocaleDateString()
		};
		console.warn("Couldn't split string", string);
		return {barcode: null, expirationDate: null};
	});
	console.log(identificationStrings);
	return <div className="statusDesc">
		<span className="recallReason">{recall.motif_rappel}</span>
		<img className="productImage" src={recall.liens_vers_les_images} onError={ev => ev.target.style.display = "none"} />
		<span>
			<span className="brandName">{recall.marque_produit}</span> — <span className="productName">{recall.modeles_ou_references}</span>
		</span>
		<div>
			<span></span>
			<table>
				<thead><tr><th>Code-barres</th><th>Lot</th><th>Date limite</th></tr></thead>
				<tbody>{identificationStrings.map((article, index) => <tr key={index}>
					<td>{article.barcode}</td><td>{article.bunchNumber}</td><td>{article.expirationDate}</td>
				</tr>)}</tbody>
			</table>
		</div>
		<a className="fullInfoLink" href={recall.lien_vers_la_fiche_rappel}>Voir sur Rappel Conso</a>
	</div>
};