const config = {
	height: 0.01,
	centerLogBase: 5,
	centerLogDivide: 1000,
	rate: 0.0033333,
	surfaceLevel: 63
};

const byCoordinates = document.querySelectorAll('#by_coordinates input');
const bySize = document.querySelectorAll('#by_size input')
byCoordinates.forEach(element => element.addEventListener('change', updateCostByCoordinates))
bySize.forEach(element => element.addEventListener('change', updateCostBySize))

function updateCostByCoordinates(e) {
	let values = [];
	byCoordinates.forEach((id) => {
		id.value = Math.floor(parseInt(id.value));
		if (!parseInt(id.value)) { id.value = '0' }
		if (parseInt(id.value) > parseInt(id.max)) { id.value = id.max; }
		if (parseInt(id.value) < parseInt(id.min)) { id.value = id.min }
		values[id.id] = parseInt(id.value)
	})
	return updateCost(values);
}

function updateCostBySize() {
	bySize.forEach((id) => {
		id.value = Math.floor(parseInt(id.value));
		if (!parseInt(id.value)) { id.value = '0' }
		if (parseInt(id.value) > parseInt(id.max)) { id.value = id.max; }
		if (parseInt(id.value) < parseInt(id.min)) { id.value = id.min }
	})
	return updateCost({
		x1: parseInt(ids[0].value),
		x2: parseInt(ids[0].value) + parseInt(ids[1].value),
		y1: 63,
		y2: 319,
		z1: 0,
		z2: parseInt(ids[2].value)
	});
}

function updateCost(data) {
	console.log(data)
	const coordinates = ['x', 'y', 'z']
	let min = max = size = [];
	coordinates.forEach((coordinate) => {
		console.log(`${coordinate}_1`, data[`${coordinate}_1`])
		console.log(`${coordinate}_2`, data[`${coordinate}_2`])
		min[coordinate] = Math.min(data[`${coordinate}_1`], data[`${coordinate}_2`]);
		min[coordinate] = Math.max(data[`${coordinate}_1`], data[`${coordinate}_2`]);
		size[coordinate] = max[coordinate] - min[coordinate] + 1;
		document.getElementById(`min_${coordinate}`).innerText = min[coordinate];
		document.getElementById(`max_${coordinate}`).innerText = max[coordinate];
		document.getElementById(`size_${coordinate}`).innerText = size[coordinate];
	})

	document.getElementById('alert').className = (size['x'] < 5 || size['y'] < 5 || size['z'] < 5) ? 'alert alert-danger' : 'd-none'

	let heightRate = (max['y'] > config.surfaceLevel) ? 1 + (config.surfaceLevel - min['y']) * config.height : size['y'] * config.height;
	let useX = Math.min(Math.abs(min['x']), Math.abs(max['x'])) > Math.min(Math.abs(min['z']), Math.abs(max['z']));
	let otherSize = (useX) ? size['z'] : size['x'];
	let loopMin = (useX) ? min['x'] : min['z'];
	let loopMax = (useX) ? max['x'] : max['z'];

	let taxes = [];
	for (let i = loopMin; i <= loopMax; i++) {
		let centerRate = (i == 0) ? 1 : 1.0 - (Math.log(Math.abs(i) / 1000) / Math.log(config.centerLogBase));
		let taxRate = config.rate;
		let blockRate = heightRate * centerRate * taxRate;
		taxes.push(blockRate * otherSize);
	}
	let cost = taxes.reduce((a, b) => a + b, 0) * 1000;
	return document.querySelector('#output').innerText = Math.ceil(cost) / 1000;
}
