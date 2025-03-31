import { BarcodeDetector } from "barcode-detector";
import { createRef, useEffect, useRef, useState } from "react"
import { createCode } from "./codes.mjs";

export default function PictureForm() {
	const [uploadedImage, setUploadedImage] = useState(null);
	const [fileValidated, setFileValidated] = useState(false);
	const [cameraModeAllowed, setCameraModePermission] = useState(false);
	const [cameraModeEnabled, setCameraMode] = useState(false);
	const [codeType, setCodeType] = useState(null);
	const [codeValue, setCodeValue] = useState(null);
	const [codeLabel, setCodeLabel] = useState("");

	const videoElementRef = useRef(null);
	const submittedImageRef = createRef(null);

	useEffect(() => {
		const beforeUnloadListener = function(ev) {
			ev.preventDefault();
			ev.returnValue = "";
		};
		window.addEventListener("beforeunload", beforeUnloadListener);
		
		const userMediaAvailable = "getUserMedia" in navigator?.mediaDevices;
		if(userMediaAvailable) navigator.permissions.query({name: "camera"}).then(cameraPermissionStatus => {
			if(cameraPermissionStatus.state !== "denied") setCameraModePermission(true);
		}, console.warn);

		return () => window.removeEventListener("beforeunload", beforeUnloadListener);
	}, []);

	useEffect(() => {
		if(!cameraModeEnabled) return;

		let cameraSnapshotInterval;

		navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: "environment"}}}).then(stream => {
			videoElementRef.current.srcObject = stream;

			cameraSnapshotInterval = setInterval(() => {
				new BarcodeDetector({
					formats: ["ean_13"]
				}).detect(videoElementRef.current).then(data => {
					if(!data.length) return;
					const liveCodeType = data[0].format;
					const liveCodeValue = Number(data[0].rawValue);
					const liveCodeLabel = prompt(`Rentrez un nom pour le code-barres ${liveCodeValue}`);
					if(liveCodeLabel !== null) createCode(liveCodeType, liveCodeValue, liveCodeLabel);
				});
			}, 500);
		}, console.warn);
		return () => clearInterval(cameraSnapshotInterval);
	}, [cameraModeEnabled]);

	const reset = function() {
		setUploadedImage(null);
		setFileValidated(false);
		setCameraMode(false);
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

	const requestCameraAccess = function() {
		navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: "environment"}}}).then(() => setCameraMode(true), console.warn);
	};

	return <>
		<h2>Scanner un code</h2>
		<div id="uploadField">
			<input type="file" accept="/image" value={""} onInput={onFileInput} />
			{cameraModeAllowed && <div className="cameraDiv">
				<video ref={videoElementRef} width={300} height={300} autoPlay hidden={!cameraModeEnabled} />
				{cameraModeEnabled && <p>L'image en direct est utilisée localement 2 fois par seconde.</p>}
				{!cameraModeEnabled && <button onClick={requestCameraAccess}>Autoriser la caméra</button>}
			</div>}
			{!uploadedImage && !codeType && <p id="uploadInfo">
				Vos photos ne sont ni conservées, ni mises en ligne.<br />
				Le code-barres va être lu localement.<br />
				Vous pouvez recevoir un avertissement avant de quitter la page, il sert à empêcher une actualisation automatique après avoir pris une photo.
			</p>}
		</div>
		<img ref={submittedImageRef} src={uploadedImage} id="submittedImage" />
		{uploadedImage && !fileValidated && <button onClick={onPictureSubmission}>Trouver un code</button>}
		<form onSubmit={onFormSubmission}>
			{fileValidated && <div>Type de code trouvé : {codeType || "aucun"}</div>}
			{fileValidated && codeType && <div>Code trouvé : {codeValue}</div>}
			{fileValidated && codeType && <label>Surnom : <input value={codeLabel} required id="codeLabel" onChange={ev => setCodeLabel(ev.target.value)}/></label>}
			{fileValidated && codeType && <button>Ajouter</button>}
		</form>
	</>
}