import DismissButton from "./DismissButton";

export default function StatusDesc({recall, forceReload}) {
	let hasExpirationDate, hasSetNumber;
	const identificationStrings = recall.identification_produits.split("|").map(string => {
		const dollarSplit = string.split("$");
		const barcode = dollarSplit[0];
		const setNumber = dollarSplit[1];
		hasSetNumber = !!setNumber;
		const hasNoExpirationDate = !dollarSplit[3] && !dollarSplit[4];
		const isOneExpirationDate = dollarSplit[3] && !dollarSplit[4];
		const isExpirationDateRange = dollarSplit[3] && dollarSplit[4];
		hasExpirationDate = !hasNoExpirationDate;
		let expirationDate;
		if(hasNoExpirationDate) expirationDate = null;
		if(isOneExpirationDate) expirationDate = new Date(dollarSplit[3]).toLocaleDateString();
		if(isExpirationDateRange) expirationDate = `${new Date(dollarSplit[3]).toLocaleDateString()} à ${new Date(dollarSplit[4]).toLocaleDateString()}`;
		return {barcode, setNumber, expirationDate};
	});
	const altText = `${recall.marque_produit} — ${recall.modeles_ou_references}`;
	const linkTitle = `Consulter la fiche rappel de : ${recall.marque_produit} — ${recall.modeles_ou_references}`;
	return <div className="statusDesc">
		<div className="recallTitle">
			<span className="recallReason">{recall.motif_rappel}</span>
			<DismissButton guid={recall.rappel_guid} forceReload={forceReload}/>
		</div>
		<figure>
			<img className="productImage" src={recall.liens_vers_les_images.split("|")[0]} onError={ev => ev.target.style.display = "none"} alt={altText} />
			<figcaption>
				<span className="brandName">{recall.marque_produit}</span> — <span className="productName">{recall.modeles_ou_references}</span>
			</figcaption>
		</figure>
		<div>
			<span></span>
			<table>
				<thead><tr>
					<th scope="col">Code-barres</th>
					{hasSetNumber && <th scope="col">Lot</th>}
					{hasExpirationDate && <th scope="col">Date limite</th>}
				</tr></thead>
				<tbody>{identificationStrings.map((article, index) => <tr key={index}>
					<td title={`Code-barres ${article.barcode}`} headers="code-barres">{article.barcode}</td>
					{hasSetNumber && <td headers="lots">{article.setNumber}</td>}
					{hasExpirationDate && <td headers="dates limites"><time dateTime={article.expirationDate.split("/").toReversed().join("-")}>{article.expirationDate}</time></td>}
				</tr>)}</tbody>
			</table>
		</div>
		<a className="fullInfoLink" href={recall.lien_vers_la_fiche_rappel} title={linkTitle}>Voir sur Rappel Conso</a>
	</div>
};