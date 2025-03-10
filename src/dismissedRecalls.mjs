export function getDismissedRecalls() {
	return JSON.parse(localStorage.getItem("dismissed") || "[]");
};

const setDismissedRecalls = function(dismissedRecallsArray) {
	localStorage.setItem("dismissed", JSON.stringify(dismissedRecallsArray));
};

export function addDismissedRecall(recallGuid) {
	const currentRecalls = getDismissedRecalls();
	if(currentRecalls.includes(recallGuid)) return;
	currentRecalls.push(recallGuid);
	setDismissedRecalls(currentRecalls);
};