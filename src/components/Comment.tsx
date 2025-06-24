import Giscus from "@giscus/react";
import * as React from "react";

const Comment = ({ className }: { className?: string }) => {
	const [mounted, setMounted] = React.useState(false);
	const [theme, setTheme] = React.useState<"light" | "dark">("light");
	const [key, setKey] = React.useState(0);

	React.useEffect(() => {
		setMounted(true);

		const storedTheme = localStorage.getItem("theme");
		setTheme(storedTheme === "dark" ? "dark" : "light");

		const handleThemeChange = () => {
			const currentTheme = localStorage.getItem("theme");
			setTheme(currentTheme === "dark" ? "dark" : "light");
			setKey((prevKey) => prevKey + 1);
		};

		window.addEventListener("storage", (e) => {
			if (e.key === "theme") {
				handleThemeChange();
			}
		});

		const handleCustomThemeChange = (e: Event) => {
			handleThemeChange();
		};
		document.addEventListener("themeChanged", handleCustomThemeChange);

		return () => {
			window.removeEventListener("storage", handleThemeChange);
			document.removeEventListener("themeChanged", handleCustomThemeChange);
		};
	}, []);

	return (
		<div className={`mt-8 ${className}`}>
			{mounted ? (
				<Giscus
					key={key}
					id="comment"
					repo="fuyukivila/fuyuki.fun"
					repoId="R_kgDONb2-tA"
					category="Announcements"
					categoryId="DIC_kwDONb2-tM4CphCt"
					mapping="pathname"
					strict="0"
					reactionsEnabled="1"
					emitMetadata="0"
					inputPosition="top"
					theme={theme}
					lang="zh-CN"
					loading="lazy"
				/>
			) : null}
		</div>
	);
};

export default Comment;
