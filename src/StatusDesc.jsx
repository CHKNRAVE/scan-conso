export default function StatusDesc({recall}) {
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
	return <div className="statusDesc">
		<span className="recallReason">{recall.motif_rappel}</span>
		<img className="productImage" src={recall.liens_vers_les_images.split("|")[0]} onError={ev => ev.target.style.display = "none"} />
		<span>
			<span className="brandName">{recall.marque_produit}</span> — <span className="productName">{recall.modeles_ou_references}</span>
		</span>
		<div>
			<span></span>
			<table>
				<thead><tr>
					<th>Code-barres</th>
					{hasSetNumber && <th>Lot</th>}
					{hasExpirationDate && <th>Date limite</th>}
				</tr></thead>
				<tbody>{identificationStrings.map((article, index) => <tr key={index}>
					<td>{article.barcode}</td>
					{hasSetNumber && <td>{article.setNumber}</td>}
					{hasExpirationDate && <td>{article.expirationDate}</td>}
				</tr>)}</tbody>
			</table>
		</div>
		<a className="fullInfoLink" href={recall.lien_vers_la_fiche_rappel}>Voir sur Rappel Conso</a>
	</div>
};