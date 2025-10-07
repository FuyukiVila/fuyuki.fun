document.addEventListener("DOMContentLoaded", () => {
    setupCodeRunner();
});

function setupCodeRunner() {
    document.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const runBtn = target.closest(".run-btn") as HTMLButtonElement;

        if (!runBtn || !runBtn.dataset.run) return;

        const preElement = runBtn.closest("pre");
        if (!preElement) return;

        const codeElement = preElement.querySelector("code");
        if (!codeElement) return;

        runCode(codeElement, runBtn, preElement);
    });
}

function runCode(
    codeElement: HTMLElement,
    runBtn: HTMLButtonElement,
    preElement: HTMLElement,
) {
    // 移除之前的输出
    const existingOutput =
        preElement.parentElement?.querySelector(".code-output");
    if (existingOutput) {
        existingOutput.remove();
    }

    // 直接显示 success 状态
    showSuccessState(runBtn);

    // 获取代码文本 (排除行号)
    const code = Array.from(
        codeElement.querySelectorAll(".code:not(summary *)") ?? [],
    )
        .map((el) => el.textContent)
        .map((t) => (t === "\n" ? "" : t))
        .join("\n");

    // 创建输出容器
    const outputDiv = document.createElement("div");
    outputDiv.className = "code-output";

    const titleDiv = document.createElement("div");
    titleDiv.className = "code-output-title";
    titleDiv.textContent = "Console Output:";

    const contentDiv = document.createElement("div");
    contentDiv.className = "code-output-content";

    outputDiv.appendChild(titleDiv);
    outputDiv.appendChild(contentDiv);

    // 捕获 console 输出
    const logs: string[] = [];
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
    };

    const createLogger =
        (type: string, isError = false) =>
        (...args: unknown[]) => {
            const message = args
                .map((arg) => {
                    if (typeof arg === "object") {
                        try {
                            return JSON.stringify(arg, null, 2);
                        } catch {
                            return String(arg);
                        }
                    }
                    return String(arg);
                })
                .join(" ");

            logs.push(isError ? `[${type}] ${message}` : message);
            originalConsole[type as keyof typeof originalConsole](...args);
        };

    // 重写 console 方法
    console.log = createLogger("log");
    console.error = createLogger("error", true);
    console.warn = createLogger("warn", true);
    console.info = createLogger("info");

    try {
        // 在沙盒中运行代码
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
        const sandboxedFunction = new AsyncFunction(code);

        Promise.resolve(sandboxedFunction())
            .then(() => {
                displayOutput(logs, contentDiv, false);
            })
            .catch((error: Error) => {
                logs.push(`Error: ${error.message}`);
                displayOutput(logs, contentDiv, true);
            })
            .finally(() => {
                restoreConsole();
            });
    } catch (error) {
        logs.push(`Error: ${(error as Error).message}`);
        displayOutput(logs, contentDiv, true);
        restoreConsole();
    }

    function showSuccessState(button: HTMLButtonElement) {
        // 清除之前的 timeout
        const timeoutId = button.getAttribute("data-timeout-id");
        if (timeoutId) {
            clearTimeout(Number.parseInt(timeoutId));
        }

        button.classList.add("success");

        // 设置新的 timeout 并保存 ID
        const newTimeoutId = setTimeout(() => {
            button.classList.remove("success");
        }, 1000);

        button.setAttribute("data-timeout-id", newTimeoutId.toString());
    }

    function restoreConsole() {
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;
    }

    function displayOutput(
        logs: string[],
        container: HTMLElement,
        hasError: boolean,
    ) {
        if (logs.length === 0) {
            container.textContent = "(No output)";
        } else {
            container.textContent = logs.join("\n");
            if (hasError) {
                container.classList.add("code-output-error");
            }
        }
        preElement.parentElement?.appendChild(outputDiv);
    }
}

// 支持 Swup 页面切换
interface WindowWithSwup {
    swup?: {
        hooks: {
            on: (event: string, callback: () => void) => void;
        };
    };
}

const windowWithSwup = window as unknown as WindowWithSwup;
if (windowWithSwup.swup) {
    windowWithSwup.swup.hooks.on("page:view", () => {
        setupCodeRunner();
    });
}
