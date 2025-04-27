import { h } from "hastscript";

/**
 * Creates a Friend Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.name - The name of the friend.
 * @param {string} properties.avatar - The avatar URL of the friend.
 * @param {string} properties.url - The URL of the friend's site.
 * @param {string} properties.description - The description of the friend.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Friend Card component.
 */
export function FriendCardComponent(properties, children) {
    if (Array.isArray(children) && children.length !== 0)
        return h("div", { class: "hidden" }, [
            'Invalid directive. ("friend" directive must be leaf type "::friend{name="Name" avatar="/path/to/avatar.jpg" url="https://example.com" description="Description"}")',
        ]);

    if (!properties.name || !properties.avatar || !properties.url)
        return h(
            "div",
            { class: "hidden" },
            'Invalid friend card properties. Required attributes: name, avatar, url'
        );

    const { name, avatar, url, description } = properties;

    return h(
        "div",
        {
            class: `flex flex-col rounded-2xl overflow-hidden transition-all duration-300 bg-[var(--card-bg)] shadow-md border-2 border-[rgba(var(--accent-rgb),0.4)] hover:translate-y-[-5px] hover:shadow-lg hover:border-[rgba(var(--accent-rgb),0.4)] w-full group`,
        },
        [
            h("div", { class: "flex flex-row p-5 gap-4 items-center w-full" }, [
                h("div", {
                    class: "flex flex-shrink-0 justify-center items-center w-[75px] h-[75px] rounded-full overflow-hidden border-2 border-[rgba(var(--accent-rgb),0.3)] bg-[var(--page-bg)] transition-all duration-300 group-hover:border-[rgba(var(--accent-rgb),0.7)]"
                }, [
                    h("img", {
                        src: avatar,
                        alt: `${name}'s avatar`,
                        class: "w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                    })
                ]),
                h("div", { class: "flex-1 flex flex-col justify-center" }, [
                    h("div", { class: "text-2xl font-semibold mb-1 text-[var(--text-bright)]" }, name),
                    description ? h("div", { class: "text-base font-semibold text-[var(--text-dim)] mb-3 italic" }, description) : null,
                    h("a", {
                        href: url,
                        class: "inline-flex items-center gap-2 text-base text-[rgba(var(--accent-rgb),0.8)] hover:text-[rgba(var(--accent-rgb),1)] py-1 group",
                        target: "_blank",
                        rel: "noopener noreferrer"
                    }, [
                        h("span", {}, "访问"),
                        h("span", { class: "transition-transform duration-200 group-hover:translate-x-1" }, "→")
                    ])
                ])
            ])
        ]
    );
}