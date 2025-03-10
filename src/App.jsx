import { useMemo, useState } from 'react'
import Scan from './Scan';
import Header from './Header';
import CodeList from './CodeList';
import Tutorial from './Tutorial';
import InstallPrompt from './InstallPrompt';
import initializeServiceWorker, { deleteServiceWorkers } from './serviceWorker.mjs';
import NotificationPrompt from './NotificationPrompt';


export default function App() {
	const [scanPanelOpenState, setScanPanelOpenState]= useState(false);
	const openScanPanel = () => setScanPanelOpenState(true);
	const closeScanPanel = () => setScanPanelOpenState(false);
	
	useMemo(() => {
		const serviceWorkerAllowed = Notification.permission === "granted";
		if(serviceWorkerAllowed) initializeServiceWorker();
		if(!serviceWorkerAllowed && navigator.serviceWorker?.controller) {
			deleteServiceWorkers();
			alert("Scan Conso a détecté que vous avez désactivé les notifications. La vérification périodique est supprimée.")
		};
	}, [Notification?.permission]);
	const canInstallApp = "onbeforeinstallprompt" in window;
	const notificationsNotAsked = Notification?.permission === "default";
	
	return <>
		<Header openScanPanel={openScanPanel}/>
		{scanPanelOpenState && <>
			<div id="panelDarkBackground" onClick={closeScanPanel}></div>
			<Scan />
		</>}
		<CodeList />
		{canInstallApp && <InstallPrompt />}
		{notificationsNotAsked && <NotificationPrompt />}
		<Tutorial />
	</>
};
