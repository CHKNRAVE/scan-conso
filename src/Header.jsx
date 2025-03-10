import InformationLink from "./InformationLink";
import ScanButton from "./ScanButton";

export default function Header({scanButton = true, openScanPanel}) {
	return <header className="solidBlueBackground">
		<a href="./" id="title">Scan Conso</a>
		<InformationLink />
		{scanButton && <ScanButton openScanPanel={openScanPanel}/>}
	</header>
};