import InformationLink from "./InformationLink";
import ScanButton from "./ScanButton";

export default function Header({scanButton = true, openScanPanel, scanPanelOpenState}) {
	return <header className="solidBlueBackground" aria-hidden={scanPanelOpenState}>
		<h1 id="title"><a href="./">Scan Conso</a></h1>
		<InformationLink />
		{scanButton && <ScanButton openScanPanel={openScanPanel}/>}
	</header>
};