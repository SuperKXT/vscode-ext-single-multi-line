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
	if (newlineRegEx.test(string)) {
		return string.replace(/[\r\n\t]/g, '');
	}

	// If Single-line, Make Multi-line
	const separatorIndexes = findNewLineIndexes(string);
	const stringArray = string.split('');

	const addLineBreak =
		(index: number, isComma: boolean) => {
			isCommaOnNewLine && isComma
				? stringArray[index] = '\n' + stringArray[index]
				: stringArray[index] += '\n';
		};

	separatorIndexes.forEach(
		({ index, isComma }) => addLineBreak(index, isComma)
	);

	const returnString = stringArray.join("");

	return returnString;

};

// Find All The Indexes Where A Newline Needs To Be Placed.
const findNewLineIndexes = (string: string): { index: number, isComma: boolean }[] => {

	let isInString: boolean = false,
		currentQuoteMark = '',
		separatorIndexArray = [];

	for (let i = 0; i < string.length; i++) {

		const currentCharacter = string[i]
			, nextCharacter = string[i + 1];

		const shouldAddNewLine =
			startBracketRegEx.test(currentCharacter)
			|| (endBracketRegEx.test(currentCharacter) && ![',', ';'].includes(nextCharacter))
			|| endBracketRegEx.test(nextCharacter)
			|| [',', ';'].includes(currentCharacter);

		if (shouldAddNewLine && !isInString) {
			separatorIndexArray.push({
				index: i,
				isComma: currentCharacter === ','
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
