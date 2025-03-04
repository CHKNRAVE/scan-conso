export function codesByType(codeType) {
	return JSON.parse(localStorage.getItem(codeType)) || {};
};

export function createCode(codeType, codeValue, codeLabel) {
	const currentCodes = codesByType(codeType);
	currentCodes[codeValue] = codeLabel;
	localStorage.setItem(codeType, JSON.stringify(currentCodes));
};

export function deleteCode(codeType, codeValue) {
	const currentCodes = codesByType(codeType);
	if(!currentCodes[codeValue]) throw new Error("Tried to delete a nonexistent code value!");
	delete currentCodes[codeValue];
	localStorage.setItem(codeType, JSON.stringify(currentCodes));
};