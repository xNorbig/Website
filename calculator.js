const config = {
	height: 0.01,
	centerLogBase: 5,
	centerLogDivide: 1000,
	rate: 0.0022222,
	surfaceLevel: 63,
	coordinatePattern: '<span class="fw-bold">{min}</span> do <span class="fw-bold">{max}</span> (<span class="fw-bold">{size}</span> bloków)',
	costPattern: '<span class="fw-bold">{cost}</span> D'
};

const byCoordinates = document.querySelectorAll('#by_coordinates input');
const bySize = document.querySelectorAll('#by_size input');
byCoordinates.forEach(element => element.addEventListener('change', updateCostByCoordinates));
bySize.forEach(element => element.addEventListener('change', updateCostBySize));

function updateCostByCoordinates() {
	let values = [];
	byCoordinates.forEach((id) => {
		id.value = Math.floor(parseInt(id.value || 0));
		if (!parseInt(id.value)) { id.value = '0'; }
		if (parseInt(id.value) > parseInt(id.max)) { id.value = id.max; }
		if (parseInt(id.value) < parseInt(id.min)) { id.value = id.min; }
		values[id.id] = parseInt(id.value);
	});
	return updateCost(values);
}

function updateCostBySize() {
	bySize.forEach((id) => {
		id.value = Math.floor(parseInt(id.value));
		if (!parseInt(id.value)) { id.value = '0'; }
		if (parseInt(id.value) > parseInt(id.max)) { id.value = id.max; }
		if (parseInt(id.value) < parseInt(id.min)) { id.value = id.min; }
	});
	return updateCost({
		x_1: parseInt(bySize[0].value),
		x_2: parseInt(bySize[0].value) + parseInt(bySize[1].value),
		y_1: 63,
		y_2: 319,
		z_1: 0,
		z_2: parseInt(bySize[2].value)
	});
}

function updateCost(data) {

	document.getElementById('output').classList.remove('d-none');

	//parse min value, max value, size of cuboid
	const coordinates = ['x', 'y', 'z'];
	let min = [], max = [], size = [];
	coordinates.forEach((coordinate) => {
		min[coordinate] = Math.min(data[coordinate + '_1'], data[coordinate + '_2']);
		max[coordinate] = Math.max(data[coordinate + '_1'], data[coordinate + '_2']);
		size[coordinate] = max[coordinate] - min[coordinate] + 1;
		document.getElementById(`output_${coordinate}`).innerHTML = config.coordinatePattern
			.replace('{min}', min[coordinate])
			.replace('{max}', max[coordinate])
			.replace('{size}', size[coordinate]);
	});

	// display alert if cuboid too small
	let alert = document.getElementById('alert');
	alert.classList.add('d-none');
	if (size['x'] < 5 || size['y'] < 5 || size['z'] < 5) alert.classList.remove('d-none');

	// calculate cost
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

	// display cost
	let cost = taxes.reduce((a, b) => a + b, 0) * 1000;
	return document.getElementById('output_cost').innerHTML = config.costPattern.replace('{cost}', Math.ceil(cost) / 1000);
}
