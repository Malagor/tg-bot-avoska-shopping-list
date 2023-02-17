/**
 *
 * @param {[]}buttons
 * @param {number} [column]
 */
export function keyboardLayout(buttons, column = 0) {
	if (buttons.length <= 3) {
		return buttons;
	}

	const col = column || 2;
	const length = buttons.length;
	let start = 0;
	let end = col;

	const res = [];

	while (start < length) {
		res.push(buttons.slice(start, end));

		start = end;
		end = end + col < length ? end + col : length;
	}

	return res;
}
