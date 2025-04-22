import { useEffect, useRef, useState } from "react";
import { createCode } from "./codes.mjs";

export default function LiveInput() {
	const [cameraModeAllowed, setCameraModePermission] = useState(false);
	const [mediaStream, setMediaStream] = useState(null);

	const videoElementRef = useRef(null);

	useEffect(() => {
		const userMediaAvailable = "getUserMedia" in navigator?.mediaDevices;
		if(userMediaAvailable) navigator.permissions.query({name: "camera"}).then(cameraPermissionStatus => {
			if(cameraPermissionStatus.state !== "denied") setCameraModePermission(true);
		}, console.warn);
	}, []);

	useEffect(() => {
		if(!mediaStream) return;
		
		videoElementRef.current.srcObject = mediaStream;
		const cameraSnapshotInterval = setInterval(() => {
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

		return () => {
			clearInterval(cameraSnapshotInterval);
			mediaStream.getTracks().forEach(track => track.stop());
		};
	}, [mediaStream]);

	const requestCameraAccess = function() {
		navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: "environment"}}}).then(setMediaStream, console.warn);
	};

	if(cameraModeAllowed) return <div className="cameraDiv">
		<video ref={videoElementRef} autoPlay hidden={!mediaStream} />
		{mediaStream ? <p>L'image en direct est utilisée localement 2 fois par seconde.</p> : <button type="button" onClick={requestCameraAccess}>Autoriser la caméra</button>}
	</div>
	return <></>
};