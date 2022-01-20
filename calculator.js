const config = {
	"height": 0.01,
	"centerLogBase": 5,
	"centerLogDivide": 1000,
	"rate": 0.005,
	"surfaceLevel": 63,
	"list": ["#x1", "#x2", "#y1", "#y2", "#z1", "#z2"]
};

function updateCostByCoordinates() {
	let ids = document.querySelectorAll(config.list);
	let values = [];
	ids.forEach((id) => {
		if (!parseInt(id.value)) { id.value = "0" }
		if (parseInt(id.value) > parseInt(id.max)) { id.value = id.max; }
		if (parseInt(id.value) < parseInt(id.min)) { id.value = id.min }
		values[id.id] = parseInt(id.value)
	})
	return updateCost(values);
}

function updateCostBySize() {
	let ids = document.querySelectorAll(["#distance", "#length", "#width"]);
	ids.forEach((id) => {
		id.value = Math.floor(parseInt(id.value));
		if (!parseInt(id.value)) { id.value = "0" }
		if (parseInt(id.value) > parseInt(id.max)) { id.value = id.max; }
		if (parseInt(id.value) < parseInt(id.min)) { id.value = id.min }
	})
	return updateCost({
		"x1": parseInt(ids[0].value),
		"x2": parseInt(ids[0].value) + parseInt(ids[1].value),
		"y1": 63,
		"y2": 319,
		"z1": 0,
		"z2": parseInt(ids[2].value)
	});
}

function updateCost(data) {
	console.log(data)
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
		let centerRate = (i == 0) ? 1 : 1.0 - (Math.log(Math.abs(i) / 1000) / Math.log(config.centerLogBase));
		console.log(i, centerRate)
		let taxRate = config.rate;
		let blockRate = heightRate * centerRate * taxRate;
		taxes.push(blockRate * otherSize);
	}
	let cost = taxes.reduce((a, b) => a + b, 0) * 1000;
	return document.querySelector("#output").innerHTML = Math.ceil(cost) / 1000;
}