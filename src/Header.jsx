import InformationLink from "./InformationLink";
import ScanButton from "./ScanButton";

export default function Header({scanButton = true, openScanPanel}) {
	return <header className="solidBlueBackground">
		<h1 href="./" id="title">Scan Conso</h1>
		<InformationLink />
		{scanButton && <ScanButton openScanPanel={openScanPanel}/>}
	</header>
};