import { useState } from "react";
import { codesByType } from "./codes.mjs"
import CodeStatus from "./CodeStatus";

export default function CodeList() {
	const [_, forceRefresh] = useState(0);

	const codeTypes = [
		"ean_13"
	];
	
	return <div className="codeList">
		{codeTypes.map(codeType => {
			return Object.entries(codesByType(codeType)).map(([codeValue, codeLabel]) => {
				return <CodeStatus key={`${codeType}#${codeValue}`} type={codeType} value={codeValue} label={codeLabel} forceRefresh={forceRefresh} />
			});
		})}
	</div>
};