import PictureForm from "./PictureForm";
import ManualForm from "./ManualForm";

export default function Scan() {
	return <div id="scanPanel" onClick={ev => ev.stopPropagation()}>
		<PictureForm />
		<h4>ou</h4>
		<ManualForm />
	</div>
};