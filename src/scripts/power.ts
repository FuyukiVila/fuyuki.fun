const EventString = ["Ciallo～(∠·ω< )⌒★"];

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e: MouseEvent) => {
        const $i: HTMLSpanElement = document.createElement("span");
        $i.textContent = getRandomElement(EventString);
        const x: number = e.pageX;
        const y: number = e.pageY;
        $i.style.cssText = `
            z-index: 9999;
            top: ${y - 20}px;
            left: ${x}px;
            position: absolute;
            font-weight: bold;
            color: #${Math.floor(Math.random() * 0xffffff).toString(16)};
        `;
        document.body.appendChild($i);
        $i.animate(
            [
                { top: `${y - 20}px`, opacity: 1 },
                { top: `${y - 180}px`, opacity: 0 },
            ],
            {
                duration: 2000,
                easing: "ease-out",
                fill: "forwards",
            },
        ).finished.then(() => {
            $i.remove();
        });
    });
});

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}
