import { html, render, signal, effect, computed }
from "https://cdn.jsdelivr.net/npm/preact-htm-signals-standalone/dist/standalone.js"

const channel = new BroadcastChannel("wheel")

channel.addEventListener(
    "message",
    (evt) => {
        const { data } = evt
        if (data.items !== undefined) {
            items.value = data.items
            return
        }
        spin.value = data.spin
        result.value = ""
    }
)

const items = signal([])
const spin = signal(false)
const showResult = (evt) => {
    const p = (spin.value - 0.25) % 1
    const i = Math.round((items.value.length * p) + (1 / items.value.length))
    result.value = items.value[i]
    // console.log("picked:", p, i, items.value[i])
}
const result = signal("")

const Wheel = () => {
    const hacchanSize = 340
    const className = spin.value ? "spin" : ""
    const parts = items.value.map(
        (option, index) => {
            const angle = (index / items.value.length) * 360
            const offset = Math.PI / items.value.length
            const [x, y] = [
                Math.cos(-offset) * 220,
                Math.sin(-offset) * 220,
            ]
            const style = `transform: translate(240px, 240px) rotate(${angle}deg);`
            return html`
                <g style=${style}>
                    <path
                        d="M 0 0 L ${x} ${y} A 220 220 0 0 1 ${x} ${-y} Z"
                        stroke="black"
                        stroke-width="2"
                        fill="white"
                    />
                    <text x="210">
                        ${option.trim()}
                    <//>
                <//>
            `
        }
    )

    return html`
        <svg style="background-color: transparent; width: var(--size); height: var(--size); --size:800px;" viewBox="0 0 480 480">
            ${parts}
            <image
                href="hachi-pointer.png"
                width=${hacchanSize} height=${hacchanSize}
                x="240"
                y="240"
                style="--end: ${360 * spin.value}deg; --y: 220px;"
                onAnimationEnd=${showResult}
                class=${className}
            />
            <text style="alignment-baseline: hanging; text-anchor: middle; font-size: 16px;" x="240">
                ${result.value}
            <//>
        </svg>
    `
}

const App = () => {
    // const opts = (evt) => options.value = evt.target.value
    return html`
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Arbutus&display=swap');

            text {
                text-anchor: end;
                alignment-baseline: middle;
                font-size: 8px;
                font-family: 'Arbutus', cursive;
            }

            image {
                transform: translate(-170px, -200px);
            }
            image.spin {
                animation-name: spin;
                animation-duration: 5s;
                animation-fill-mode: forwards;
                transform-origin: 240px 240px;
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg) translate(-170px, -200px);
                    animation-timing-function: linear;
                }
                8% {
                    transform: rotate(-30deg) translate(-170px, -200px);
                    animation-timing-function: ease-out;
                }
                100% {
                    transform: rotate(var(--end)) translate(-170px, -200px);
                }
            }
        </style>
        <${Wheel} />
    `
}

render(html`<${App} />`, document.body)
