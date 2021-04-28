const newlineRegEx = /[\r\n]/;
const startBracketRegEx = /[\{\[\(]/;
// tslint:disable-next-line: semicolon
const endBracketRegEx = /[\}\]\)]/;
// tslint:disable-next-line: semicolon
const quoteRegEx = /['"`]/;

/**
 * Switches The Selected Text Between Single And Multi Line.
 * Works On Arrays, Objects, Assignments, & Other Comma-Separated Or Semicolon-Separated Text.
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
	if (isStringMultiLine(string)) {
		return string.replace(/[\r\n]/g, '');
	}

	// If Single-line, Make Multi-line
	const separatorIndexes = findNewLineIndexes(string);
	const stringArray = string.split('');

	const addLineBreak =
		(index: number, isSemiColon: boolean) => {
			isCommaOnNewLine && !isSemiColon
				? stringArray[index] = '\n' + stringArray[index]
				: stringArray[index] += '\n';
		};

	separatorIndexes.forEach(
		({ index, isSemiColon }) => addLineBreak(index, isSemiColon)
	);

	const returnString = stringArray.join("");

	return returnString;

};

// Returns True If A Line Break Is Found On The String
const isStringMultiLine = (string: string): boolean => {

	let isInString: boolean = false,
		currentQuoteMark = '';

	for (let i = 0; i < string.length; i++) {

		const currentCharacter = string[i];

		if (newlineRegEx.test(currentCharacter) && !isInString) {
			return true;
		}
		if (quoteRegEx.test(currentCharacter)) {
			if (!isInString) {
				currentQuoteMark = currentCharacter;
				isInString = true;
			}
			else if (currentQuoteMark === currentCharacter) {
				isInString = false;
			}
		}

	}

	return false;

};

// Find All The Indexes Where A Newline Needs To Be Placed.
const findNewLineIndexes = (string: string): { index: number, isSemiColon: boolean }[] => {

	let isInString: boolean = false,
		currentQuoteMark = '',
		separatorIndexArray = [];

	for (let i = 0; i < string.length; i++) {

		const currentCharacter = string[i]
			, nextCharacter = string[i + 1];

		const addNewLine =
			startBracketRegEx.test(currentCharacter)
			|| endBracketRegEx.test(nextCharacter)
			|| ([',', ';'].includes(currentCharacter) && !isInString);

		if (addNewLine) {
			separatorIndexArray.push({
				index: i,
				isSemiColon: currentCharacter === ';'
			});
		}
		else if (quoteRegEx.test(currentCharacter)) {
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
