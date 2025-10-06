import Giscus from "@giscus/react";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

const Comment = ({ className }: { className?: string }) => {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // 根据 DOM 的 class 判断当前主题
    const getCurrentTheme = (): "light" | "dark" => {
        return document.documentElement.classList.contains("dark")
            ? "dark"
            : "light";
    };

    useEffect(() => {
        setMounted(true);
        setTheme(getCurrentTheme());

        // 使用 MutationObserver 监听 DOM 的 class 变化
        const observer = new MutationObserver(() => {
            setTheme(getCurrentTheme());
        });

        // 开始监听 document.documentElement 的属性变化
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"], // 只监听 class 属性
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className={twMerge("mt-8", className)}>
            {mounted ? (
                <Giscus
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
                />
            ) : null}
        </div>
    );
};

export default Comment;
