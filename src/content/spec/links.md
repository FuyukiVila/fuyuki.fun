> ***Yuki snows the night***
>
> ***but the white is not as pure as it had been***
>
> ***Hikari illuminates the world***
>
> ***but the light is not as bright as it had been***

# My Friends

<div class="friend-links-container">
    <a href="https://masttf.fun" class="friend-link-item" target="_blank">
        <img src="/avatars/masttf.jpg">
        <span>Masttf</span> 
    </a>
</div>

<style>
    /* 默认样式 */
    .friend-links-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem; /* 设置间距 */
    }

    .friend-link-item {
        display: flex;
        align-items: center;
        font-size: 1.5rem; /* 修改为相对单位 */
        flex: 0 0 calc(33.333% - 1rem); /* 每个项占据三分之一减去间距 */
        box-sizing: border-box; /* 确保内边距和边框包含在宽度内 */
    }

    .friend-link-item img {
        width: 3.75rem;
        height: auto;
        margin: 0.5rem;
        border-radius: auto;
    }

    /* 移动端优化 */
    @media (max-width: 768px) {
        .friend-link-item {
            flex: 0 0 calc(50% - 1rem); /* 每行显示2个 */
        }
    }

    @media (max-width: 480px) {
        .friend-link-item {
            flex: 0 0 100%; /* 每行显示1个 */
        }
    }
</style>
