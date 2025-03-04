import PictureForm from "./PictureForm";
import ManualForm from "./ManualForm";

export default function Scan() {
	return <div id="scanPanel" onClick={ev => ev.stopPropagation()}>
		<PictureForm />
		<span>ou</span>
		<ManualForm />
	</div>
};