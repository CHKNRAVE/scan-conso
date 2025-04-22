import PictureForm from "./PictureForm";
import ManualForm from "./ManualForm";
import ScanPanelCloseButton from "./ScanPanelCloseButton";

export default function Scan({closeScanPanel}) {
	return <aside id="scanPanel" onClick={ev => ev.stopPropagation()}>
		<h2>Scanner un code</h2>
		<ScanPanelCloseButton closeScanPanel={closeScanPanel}/>
		<PictureForm />
		<h4 aria-hidden={true}>ou</h4>
		<ManualForm />
	</aside>
};