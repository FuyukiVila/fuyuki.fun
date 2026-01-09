<script lang="ts">
import Giscus from "@giscus/svelte";
import { getCurrentTheme } from "@utils/setting-utils";
import { onMount } from "svelte";
import { twMerge } from "tailwind-merge";
import type { LIGHT_DARK_MODE } from "@/types/config";

let { className = "" }: { className?: string } = $props();

let theme = $state<LIGHT_DARK_MODE>("light");

onMount(() => {
    // 初始化主题
    theme = getCurrentTheme();

    // 监听主题变化
    const observer = new MutationObserver(() => {
        theme = getCurrentTheme();
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });

    return () => observer.disconnect();
});
</script>

<div class={twMerge('mt-8', className)}>
        <Giscus
            id="comments"
            term="Welcome to fuyuki.fun!"
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
</div>
