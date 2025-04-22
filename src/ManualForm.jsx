import { useState } from "react";
import { createCode } from "./codes.mjs";

export default function ManualForm() {
	const [codeValue, setCodeValue] = useState('');
	const [codeType, setCodeType] = useState("ean_13");
	const [codeLabel, setCodeLabel] = useState("");

	const reset = function() {
		setCodeValue('');
		setCodeType("ean_13");
		setCodeLabel("");
	};

	const onFormSubmission = function(ev) {
		ev.preventDefault();
		createCode(codeType, codeValue, codeLabel);
		alert("Code enregistré !");
		reset();
	};

	return <>
		<h2>Entrer un code manuellement</h2>
		<form onSubmit={onFormSubmission} id="manualForm">
			<label aria-hidden={true} htmlFor="codeValue">Code :</label>
			<input aria-label="Champ d'entrée du code" id="codeValue" type="number" value={codeValue} required onChange={ev => setCodeValue(ev.target.value)}/>
			<label htmlFor="codeType" aria-hidden={true}>Type :</label>
			<select aria-label="Champ d'entrée du type de code" id="codeType" aria-hidden={true} value={codeType} onChange={ev => setCodeType(ev.target.value)} disabled>
				<option label="Code-barres" value="ean_13" selected />
			</select>
			<label aria-hidden={true} htmlFor="codeLabel">Surnom :</label>
			<input aria-label="Champ d'entrée du surnom" value={codeLabel} required id="codeLabel" onChange={ev => setCodeLabel(ev.target.value)}/>
			<button>Valider</button>
		</form>
	</>
};