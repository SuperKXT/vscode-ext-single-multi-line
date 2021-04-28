const newlineReg = /[\r\n]/;
const startBracketReg = /[\{\[\(]/;
const endBracketReg = /[\}\]\)]/;
const quoteReg = /['"`]/;

/**
 * Switches The Selected Text Between Single And Multi Line.
 * Works On Arrays, Objects, Assignments, & Other Comma-Separated Text.
 * @export
 * @param selectedText The Text To Switch Between Single Or Multi Line
 * @param isCommaOnNewLine Flag To Decide Whether To Put The Comma On New Line Or Not
 * @returns The Transformed Text
 */
export default (selectedText: string, isCommaOnNewLine?: boolean): string => {

	const string = selectedText.trim();

	if (!string.length) {
		return selectedText;
	}

	// If Already Multi-line, Make Single-line
	if (newlineReg.test(string)) {
		return string.replace(/[\r\n]/g, '');
	}

	// If Single-line, Make Multi-line
	const separatorIndexes = findNewLineIndexes(string);
	const stringArray = string.split('');

	const addLineBreak =
		(index: number) => {
			isCommaOnNewLine
				? stringArray[index] = '\n' + stringArray[index]
				: stringArray[index] += '\n';
		};

	separatorIndexes.forEach(addLineBreak);

	const returnString = stringArray.join("");

	return returnString;

};

// Find All The Indexes Where A Newline Needs To Be Placed.
const findNewLineIndexes = (string: string): number[] => {

	let isInString: boolean = false,
		currentQuoteMark = '',
		separatorIndexArray = [];

	for (let i = 0; i < string.length; i++) {

		const currentCharacter = string[i]
			, nextCharacter = string[i + 1];

		const addNewLine =
			startBracketReg.test(currentCharacter)
			|| endBracketReg.test(nextCharacter)
			|| (currentCharacter === ',' && !isInString);

		if (addNewLine) {
			separatorIndexArray.push(i);
		}
		else if (quoteReg.test(currentCharacter)) {
			if (!isInString) {
				currentQuoteMark = currentCharacter;
				isInString = true;
			}
			else if (currentQuoteMark === currentCharacter) {
				isInString = false;
			}
		}

	}

	return separatorIndexArray;

};
