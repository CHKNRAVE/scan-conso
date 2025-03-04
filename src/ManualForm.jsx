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
			<label>
				<span>Code : </span>
				<input type="number" value={codeValue} required onChange={ev => setCodeValue(ev.target.value)}/>
			</label>
			<label><
				span>Type : </span>
				<select value={codeType} onChange={ev => setCodeType(ev.target.value)}>
					<option label="Code-barres" value="ean_13" />
				</select>
			</label>
			<label>
				<span>Surnom : </span>
				<input value={codeLabel} required id="codeLabel" onChange={ev => setCodeLabel(ev.target.value)}/></label>
			<button>Valider</button>
		</form>
	</>
};