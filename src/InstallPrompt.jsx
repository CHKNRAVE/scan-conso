import { useMemo, useState } from "react";

export default function InstallPrompt() {
	const [installPromptEvent, setInstallPromptEvent] = useState(null);

	const handleBeforeInstallPromptEvent = function(ev) {
		ev.preventDefault();
		setInstallPromptEvent(ev);
	};

	useMemo(() => {
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPromptEvent);
		return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPromptEvent);
	}, []);

	const promptInstall = function() {
		installPromptEvent.prompt();
	};

	const showInstallPrompt = !!installPromptEvent;

	return showInstallPrompt && <div id="installPrompt">
		<h2>Le saviez-vous ?</h2>
		<p>Votre navigateur peut installer des sites en tant qu'applis.<br />Vous pourrez ainsi y accéder comme vous accédez à une appli, au lieu de taper l'adresse !</p>
		<button onClick={() => promptInstall()}>Installer Scan Conso</button>
	</div>
};