import PictureForm from "./PictureForm";
import ManualForm from "./ManualForm";
import ScanPanelCloseButton from "./ScanPanelCloseButton";

export default function Scan({closeScanPanel}) {
	return <aside id="scanPanel" onClick={ev => ev.stopPropagation()}>
		<PictureForm />
		<h4>ou</h4>
		<ManualForm />
		<ScanPanelCloseButton closeScanPanel={closeScanPanel}/>
	</aside>
};