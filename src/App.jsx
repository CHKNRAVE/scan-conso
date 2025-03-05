import { useState } from 'react'
import Scan from './Scan';
import Header from './Header';
import CodeList from './CodeList';
import Tutorial from './Tutorial';

export default function App() {
	const [scanPanelOpenState, setScanPanelOpenState]= useState(false);
	const openScanPanel = () => setScanPanelOpenState(true);
	const closeScanPanel = () => setScanPanelOpenState(false);
	
	return <>
		<Header openScanPanel={openScanPanel}/>
		{scanPanelOpenState && <>
			<div id="panelDarkBackground" onClick={closeScanPanel}></div>
			<Scan />
		</>}
		<CodeList />
		<Tutorial />
	</>
};
