import { definePlugin } from "@expressive-code/core";
import type { Element } from "hast";

export function pluginCustomRunButton() {
    return definePlugin({
        name: "Custom Run Button",
        hooks: {
            postprocessRenderedBlock: (context) => {
                // 只为 JavaScript/TypeScript 代码块添加运行按钮
                const language = context.codeBlock.language.toLowerCase();
                const jsLanguages = [
                    "js",
                    "javascript",
                    "jsx",
                    "ts",
                    "typescript",
                    "tsx",
                ];
                const isJavaScript = jsLanguages.includes(language);

                if (!isJavaScript) {
                    return; // 不是 JS 代码,不添加运行按钮
                }

                function traverse(node: Element) {
                    if (node.type === "element" && node.tagName === "pre") {
                        processCodeBlock(node);
                        return;
                    }
                    if (node.children) {
                        for (const child of node.children) {
                            if (child.type === "element") traverse(child);
                        }
                    }
                }

                function processCodeBlock(node: Element) {
                    const runButton = {
                        type: "element" as const,
                        tagName: "button",
                        properties: {
                            className: ["run-btn"],
                            "aria-label": "Run code",
                            "data-run": "true",
                        },
                        children: [
                            {
                                type: "element" as const,
                                tagName: "div",
                                properties: {
                                    className: ["run-btn-icon"],
                                },
                                children: [
                                    {
                                        type: "element" as const,
                                        tagName: "svg",
                                        properties: {
                                            viewBox: "0 -960 960 960",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: [
                                                "run-btn-icon",
                                                "run-icon",
                                            ],
                                        },
                                        children: [
                                            {
                                                type: "element" as const,
                                                tagName: "path",
                                                properties: {
                                                    d: "M320-273.78v-412.44q0-17.67 11.18-28.61 11.17-10.95 27.6-10.95 6.03 0 11.69 1.74 5.66 1.73 11.03 5.69l326.24 206.22q9.19 6.04 13.78 15.11 4.59 9.08 4.59 19.02t-4.59 19.02q-4.59 9.07-13.78 15.11L381.5-237.65q-5.37 3.96-11.03 5.69-5.66 1.74-11.69 1.74-16.43 0-27.6-10.95Q320-252.11 320-273.78Z",
                                                },
                                                children: [],
                                            },
                                        ],
                                    },
                                    {
                                        type: "element" as const,
                                        tagName: "svg",
                                        properties: {
                                            viewBox: "0 -960 960 960",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: [
                                                "run-btn-icon",
                                                "success-icon",
                                            ],
                                        },
                                        children: [
                                            {
                                                type: "element" as const,
                                                tagName: "path",
                                                properties: {
                                                    d: "m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z",
                                                },
                                                children: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    } as Element;

                    if (!node.children) {
                        node.children = [];
                    }
                    node.children.push(runButton);
                }

                traverse(context.renderData.blockAst);
            },
        },
    });
}
