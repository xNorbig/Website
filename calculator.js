const config = {
	"height": 0.01,
	"centerLogBase": 5,
	"centerLogDivide": 1000,
	"rate": 0.005,
	"surfaceLevel": 63,
	"list": ["#x1", "#x2", "#y1", "#y2", "#z1", "#z2"]
};

function updateCostByCoordinates() {
	const id = document.querySelectorAll(config.list);
	let values = [];
	id.forEach((item) => {
		values[item.id] = item.value;
	});
	return updateCost(values);
}

function updateCostBySize() {
	const id = document.querySelectorAll(["#distance", "#length", "#width"]);
	return updateCost({
		"x1": id[0].value,
		"x2": parseInt(id[0].value) + parseInt(id[1].value),
		"y1": 63,
		"y2": 319,
		"z1": 0,
		"z2": id[2].value
	});
}

function updateCost(data) {
	const minX = Math.min(data["x1"], data["x2"]); document.getElementById("minX").innerHTML = minX;
	const maxX = Math.max(data["x1"], data["x2"]); document.getElementById("maxX").innerHTML = maxX;
	const minY = Math.min(data["y1"], data["y2"]); document.getElementById("minY").innerHTML = minY;
	const maxY = Math.max(data["y1"], data["y2"]); document.getElementById("maxY").innerHTML = maxY;
	const minZ = Math.min(data["z1"], data["z2"]); document.getElementById("minZ").innerHTML = minZ;
	const maxZ = Math.max(data["z1"], data["z2"]); document.getElementById("maxZ").innerHTML = maxZ;
	const sizeX = maxX - minX + 1; document.getElementById("sizeX").innerHTML = sizeX;
	const sizeY = maxY - minY + 1; document.getElementById("sizeY").innerHTML = sizeY;
	const sizeZ = maxZ - minZ + 1; document.getElementById("sizeZ").innerHTML = sizeZ;
	
	let heightRate = (maxY > config.surfaceLevel) ? 1 + (config.surfaceLevel - minY) * config.height : sizeY * config.height;
	let useX = Math.min(Math.abs(minX), Math.abs(maxX)) > Math.min(Math.abs(minZ), Math.abs(maxZ));
	let otherSize = (useX) ? sizeZ : sizeX;
	let loopMin = (useX) ? minX : minZ;
	let loopMax = (useX) ? maxX : maxZ;

	let taxes = [];
	for (let i = loopMin; i <= loopMax; i++) {
		let centerRate = 1.0 - Math.log(Math.abs(i) / 1000) / Math.log(config.centerLogBase);
		let taxRate = config.rate;
		let blockRate = heightRate * centerRate * taxRate;

		taxes.push(blockRate * otherSize);
	}

	const cost = taxes.reduce((a, b) => a + b, 0) * 1000;
	return document.querySelector("#output").innerHTML = (cost === Infinity) ? 0 : Math.ceil(cost) / 1000;
}

updateCostByCoordinates();
updateCostBySize();