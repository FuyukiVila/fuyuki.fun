<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Giscus from '@giscus/svelte';
    import { twMerge } from 'tailwind-merge';

    let { className = '' }: { className?: string } = $props();

    let mounted = $state(false);
    let theme = $state<'light' | 'dark'>('light');

    const getCurrentTheme = (): 'light' | 'dark' => {
        return document.documentElement.classList.contains('dark')
            ? 'dark'
            : 'light';
    };

    onMount(() => {
        mounted = true;
        theme = getCurrentTheme();

        // 使用 MutationObserver 监听 DOM 的 class 变化
        const observer = new MutationObserver(() => {
            theme = getCurrentTheme();
        });

        // 开始监听 document.documentElement 的属性变化
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'], // 只监听 class 属性
        });

        onDestroy(() => {
            observer.disconnect();
        });
    });
</script>

<div class={twMerge('mt-8', className)}>
    {#if mounted}
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
    {/if}
</div>
