// Source: https://stackoverflow.com/questions/62914824/c-sharp-split-integer-in-parts-given-part-weights-algorithm
function splitIntoBuckets(count, weights) {
	let solution = [];
	let weightSum = weights.reduce((a, b) => a + b, 0);
	// for every weight except the last...
	let sum = 0;
	for (let i = 0; i < weights.length - 1; i++) {
		const calc = Math.round((weights[i] / weightSum) * count);
		solution.push(calc);
		sum += calc;
	}
	// calculate the last bucket by subtracting:
	solution[weights.length - 1] = count - sum;
	return solution;
}

export function calculatePrice(price, adults, children) {
	const result = splitIntoBuckets(price, [...Array(adults).fill(2), ...Array(children).fill(1)]);
	return {
		adultsPrices: result.slice(0, adults),
		childrenPrices: result.slice(adults, adults + children)
	};
}
