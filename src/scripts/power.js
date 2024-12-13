let a_idx = 0;
jQuery(document).ready(($) => {
    $("body").click((e) => {
        const a = new Array("Ciallo～(∠·ω< )⌒★");
        const $i = $("<span/>").text(a[a_idx]);
        a_idx = (a_idx + 1) % a.length;
        const x = e.pageX;
        const y = e.pageY;
        $i.css({
            "z-index": 9999,
            "top": y - 20,
            "left": x,
            "position": "absolute",
            "font-weight": "bold",
            "color": `#${Math.floor(Math.random() * 0xffffff).toString(16)}`
        });
        $("body").append($i);
        $i.animate({
            "top": y - 180,
            "opacity": 0
        },
            1500,
            () => {
                $i.remove();
            });
    });
});