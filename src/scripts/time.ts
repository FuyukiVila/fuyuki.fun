let timer: NodeJS.Timer | null = null;

function secondToDate(second: number): string {
	if (!second) {
		return "0秒";
	}

	const timeUnits = [
		{ unit: "年", value: 365 * 24 * 3600 },
		{ unit: "天", value: 24 * 3600 },
		{ unit: "时", value: 3600 },
		{ unit: "分", value: 60 },
		{ unit: "秒", value: 1 },
	];

	let remainingSeconds = second;
	let result = "";

	for (const { unit, value } of timeUnits) {
		if (remainingSeconds >= value) {
			const count = Math.floor(remainingSeconds / value);
			remainingSeconds %= value;
			result += `${count}${unit}`;
		}
	}

	return result;
}

function setTime() {
	const create_time = Math.round(
		new Date(Date.UTC(2024, 11, 9, 0, 0, 0)).getTime() / 1000,
	);
	const timestamp = Math.round(
		(new Date().getTime() + 8 * 60 * 60 * 1000) / 1000,
	);
	const currentTime = secondToDate(timestamp - create_time);
	const htmerTimeElement = document.getElementById("htmer_time");
	if (htmerTimeElement) {
		htmerTimeElement.innerHTML = currentTime;
	}
}

if (timer === null) {
	timer = setInterval(setTime, 1000);
}
