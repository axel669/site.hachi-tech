import { html, render, signal, effect, computed }
from "https://cdn.jsdelivr.net/npm/preact-htm-signals-standalone/dist/standalone.js"

const channel = new BroadcastChannel("wheel")

const options = signal(localStorage.options ?? "")
effect(
    () => localStorage.options = options.value
)
const items = computed(
    () =>
        options.value
        .trim()
        .split(/\r?\n/)
        .filter(opt => opt.trim() !== "")
)
// effect(() => console.log(items.value))
effect(
    () => channel.postMessage({ items: items.value })
)

const spin = signal(false)
const spinWheel = () => {
    if (spin.value === false) {
        spin.value = 10 + Math.random() * 5
        return
    }
    spin.value = false
}
effect(
    () => channel.postMessage({ spin: spin.value })
)

const App = () => {
    const opts = (evt) => options.value = evt.target.value
    return html`
        <ws-screen>
            <ws-paper ws-x="r[0px]">
                <ws-flex>
                    <label ws-x="@control $color[warning]">
                        <span ws-x="$text">Options<//>
                        <textarea ws-x="h[15em]" value=${options} onInput=${opts}><//>
                    <//>
                    <button ws-x="@fill $color[warning]" onClick=${spinWheel}>
                        ${spin.value === false ? "Spin!" : "Reset"}
                    <//>
                <//>
            <//>
        <//>
    `
}

render(html`<${App} />`, document.body)
