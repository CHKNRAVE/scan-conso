import { BarcodeDetector } from "barcode-detector";
import { createRef, useEffect, useState } from "react"
import { createCode } from "./codes.mjs";

export default function PictureForm() {
	const [uploadedImage, setUploadedImage] = useState(null);
	const [fileValidated, setFileValidated] = useState(false);
	const [codeType, setCodeType] = useState(null);
	const [codeValue, setCodeValue] = useState(null);
	const [codeLabel, setCodeLabel] = useState("");


	const submittedImageRef = createRef();

	useEffect(() => {
		const beforeUnloadListener = function(ev) {
			ev.preventDefault();
			ev.returnValue = "";
		};
		window.addEventListener("beforeunload", beforeUnloadListener);
		return () => window.removeEventListener("beforeunload", beforeUnloadListener);
	}, []);

	const reset = function() {
		setUploadedImage(null);
		setFileValidated(false);
		setCodeLabel(null);
		setCodeValue(null);
		setCodeLabel("");
	};

	const onFileInput = function(ev) {
		const firstFile = ev?.target?.files[0];
		if(!firstFile) return;
		const objectUrl = URL.createObjectURL(firstFile)
		setUploadedImage(objectUrl);
		setFileValidated(false);
	};

	const onPictureSubmission = function() {
		new BarcodeDetector({
			formats: ["ean_13"]
		}).detect(submittedImageRef.current).then(data => {
			setFileValidated(true);
			setCodeType(data[0]?.format);
			setCodeValue(data[0]?.rawValue);
		});
	};

	const onFormSubmission = function(ev) {
		ev.preventDefault();
		createCode(codeType, codeValue, codeLabel);
		alert("Code enregistré !");
		reset();
	};

	return <>
		<h2>Scanner un code</h2>
		<div id="uploadField">
			<input type="file" accept="/image" onInput={onFileInput} />
			<p>
				Vos photos ne sont ni conservées, ni mises en ligne.<br />
				Le code-barres va être lu localement.<br />
				Vous allez recevoir un avertissement avant de quitter la page, il sert à empêcher une actualisation automatique après avoir pris une photo.
			</p>
		</div>
		<img ref={submittedImageRef} src={uploadedImage} id="submittedImage" /><br />
		{uploadedImage && !fileValidated && <button onClick={onPictureSubmission}>Trouver un code</button>}
		<form onSubmit={onFormSubmission}>
			{fileValidated && <div>Type de code trouvé : {codeType || "aucun"}</div>}
			{fileValidated && codeType && <div>Code trouvé : {codeValue}</div>}
			{fileValidated && codeType && <label>Surnom : <input value={codeLabel} required id="codeLabel" onChange={ev => setCodeLabel(ev.target.value)}/></label>}
			{fileValidated && codeType && <button>Ajouter</button>}
		</form>
	</>
}