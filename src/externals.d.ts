declare module '@magic/hyperapp' {
  // vdom values are plain JS objects at runtime; keep the boundary
  // permissive so JSDoc-typed values from the codebase can flow in.
  // VNodeProps / VNodeChild stay module-local: the dts test probes every
  // exported symbol, and global names with the same identifier would collide
  // in the generated probe file.
  type VNodeProps = { [key: string]: unknown }
  type VNodeChild = unknown
  export interface VNode {
    name: string
    props: VNodeProps
    children: unknown
    [key: string]: unknown
  }
  export function h(
    name: string | ((props: unknown, children: unknown) => unknown),
    props?: unknown,
    ...children: unknown[]
  ): VNode
  export function renderToString(view: VNodeChild, state?: unknown, actions?: unknown): string
  export function renderToStream(view: VNodeChild, state?: unknown, actions?: unknown): unknown
  export function escapeHtml(value: unknown): string
  export function concatClassNames(value: unknown): string
  export function stringifyStyles(style: unknown): string
  export function renderer(
    view: VNodeChild,
    state?: unknown,
    actions?: unknown,
  ): (depth?: number) => string
  export const Lazy: (props: VNodeProps) => VNode
  export const hyperapp: { [key: string]: unknown }
}

declare module '@magic/transmute' {
  export interface Transmuted {
    rendered: string
    originalState?: unknown
    [key: string]: unknown
  }
  const transmute: {
    markdown: (content: string, state?: { [key: string]: unknown }) => Transmuted
    html: (content: string, state?: { [key: string]: unknown }) => Transmuted
    [key: string]: unknown
  }
  export default transmute
}

// ---------------------------------------------------------------------------
// Globals injected at build time by tasks/prepare/globals (registerModule)
// and available in the client bundle and the Node server-render context.
// ---------------------------------------------------------------------------

type VNodeProps = { [key: string]: unknown }
type VNodeList = VNodeChild[]
type VNodeChild = unknown
// tag helpers and module views accept arbitrary vdom at runtime,
// so the ambient declarations keep their parameters permissive
type Tag = (props?: unknown, children?: unknown) => import('@magic/hyperapp').VNode
type ViewResult = VNodeChild | boolean
type ModuleView = {
  (props?: unknown, children?: unknown): ViewResult
  [key: string]: unknown
}
type AppObject = {
  state?: VNodeProps
  actions?: VNodeProps
  effects?: VNodeProps
  helpers?: VNodeProps
  subscriptions?: unknown[]
  modules?: VNodeProps
  lib?: VNodeProps
  static?: VNodeProps
  hoisted?: unknown
  [key: string]: unknown
}

// app state and helpers
declare const app: AppObject
/**
 * Runtime libraries object. Automatically loaded from @magic-libraries/*,
 * npm packages matching magic-library-* / magic-libraries-*, and
 * /assets/lib(.mjs) files. Available as `lib` in client and server code.
 */
declare let lib: {
  is: ((e: unknown, type?: string) => boolean) & {
    number: (e: unknown) => boolean
    integer: (e: unknown) => boolean
    float: (e: unknown) => boolean
    array: (e: unknown) => boolean
    regexp: (e: unknown) => boolean
    date: (e: unknown) => boolean
    error: (e: unknown) => boolean
    nil: (e: unknown) => boolean
    null: (e: unknown) => boolean
    promise: (e: unknown) => boolean
    objectNative: (e: unknown) => boolean
  }
  [key: string]: unknown
}
declare const C: (name: string) => Tag
declare const component: (name: string) => Tag
declare const actions: VNodeProps
declare const effects: VNodeProps
declare const helpers: VNodeProps
declare const state: VNodeProps
declare const subscriptions: unknown[]
declare const cookies: VNodeProps
declare const server: VNodeProps
declare const blog: VNodeProps
declare const magic: VNodeProps
declare const page: VNodeProps

// prop checking, see lib/CHECK_PROPS.mjs
declare const CHECK_PROPS: (
  props: VNodeProps,
  propTypeDecl?: { [key: string]: unknown },
  name?: string,
  log?: unknown,
) => boolean

// built-in modules, see modules/index.mjs
declare const BlogArchive: ModuleView
declare const BlogMonth: ModuleView
declare const BlogPost: ModuleView
declare const BlogTeaser: ModuleView
declare const BlogYear: ModuleView
declare const Credits: ModuleView
declare const Footer: ModuleView
declare const Header: ModuleView
declare const Img: ModuleView
declare const Link: ModuleView
declare const Logo: ModuleView
declare const Menu: ModuleView
declare const MenuItem: ModuleView
declare const Page: ModuleView
declare const Seo: ModuleView
declare const SkipLink: ModuleView

// html tags, see @magic/tags
declare const a: Tag
declare const abbr: Tag
declare const address: Tag
declare const area: Tag
declare const article: Tag
declare const aside: Tag
declare const audio: Tag
declare const b: Tag
declare const bdi: Tag
declare const bdo: Tag
declare const blockquote: Tag
declare const body: Tag
declare const br: Tag
declare const button: Tag
declare const canvas: Tag
declare const caption: Tag
declare const cite: Tag
declare const code: Tag
declare const col: Tag
declare const colgroup: Tag
declare const data: Tag
declare const datalist: Tag
declare const dd: Tag
declare const del: Tag
declare const details: Tag
declare const dfn: Tag
declare const dialog: Tag
declare const div: Tag
declare const dl: Tag
declare const dt: Tag
declare const em: Tag
declare const embed: Tag
declare const fieldset: Tag
declare const figcaption: Tag
declare const figure: Tag
declare const footer: Tag
declare const form: Tag
declare const h1: Tag
declare const h2: Tag
declare const h3: Tag
declare const h4: Tag
declare const h5: Tag
declare const h6: Tag
declare const header: Tag
declare const hgroup: Tag
declare const hr: Tag
declare const i: Tag
declare const iframe: Tag
declare const img: Tag
declare const input: Tag
declare const ins: Tag
declare const kbd: Tag
declare const label: Tag
declare const legend: Tag
declare const li: Tag
declare const main: Tag
declare const map: Tag
declare const mark: Tag
declare const math: Tag
declare const menu: Tag
declare const meter: Tag
declare const nav: Tag
declare const noscript: Tag
declare const object: Tag
declare const ol: Tag
declare const optgroup: Tag
declare const option: Tag
declare const output: Tag
declare const p: Tag
declare const param: Tag
declare const picture: Tag
declare const pre: Tag
declare const progress: Tag
declare const q: Tag
declare const rb: Tag
declare const rp: Tag
declare const rt: Tag
declare const rtc: Tag
declare const ruby: Tag
declare const s: Tag
declare const samp: Tag
declare const script: Tag
declare const search: Tag
declare const section: Tag
declare const select: Tag
declare const selectedcontent: Tag
declare const slot: Tag
declare const small: Tag
declare const source: Tag
declare const span: Tag
declare const strong: Tag
declare const style: Tag
declare const sub: Tag
declare const summary: Tag
declare const sup: Tag
declare const table: Tag
declare const tbody: Tag
declare const td: Tag
declare const template: Tag
declare const textarea: Tag
declare const tfoot: Tag
declare const th: Tag
declare const thead: Tag
declare const time: Tag
declare const tr: Tag
declare const track: Tag
declare const u: Tag
declare const ul: Tag
declare const video: Tag
declare const wbr: Tag
declare const base: Tag
declare const head: Tag
declare const html: Tag
declare const link: Tag
declare const meta: Tag
declare const title: Tag

// svg tags, see @magic/tags
declare const animate: Tag
declare const animateMotion: Tag
declare const animateTransform: Tag
declare const circle: Tag
declare const clipPath: Tag
declare const defs: Tag
declare const desc: Tag
declare const discard: Tag
declare const ellipse: Tag
declare const feBlend: Tag
declare const feColorMatrix: Tag
declare const feComponentTransfer: Tag
declare const feComposite: Tag
declare const feConvolveMatrix: Tag
declare const feDiffuseLighting: Tag
declare const feDisplacementMap: Tag
declare const feDistantLight: Tag
declare const feDropShadow: Tag
declare const feFlood: Tag
declare const feFuncA: Tag
declare const feFuncB: Tag
declare const feFuncG: Tag
declare const feFuncR: Tag
declare const feGaussianBlur: Tag
declare const feImage: Tag
declare const feMerge: Tag
declare const feMergeNode: Tag
declare const feMorphology: Tag
declare const feOffset: Tag
declare const fePointLight: Tag
declare const feSpecularLighting: Tag
declare const feSpotLight: Tag
declare const feTile: Tag
declare const feTurbulence: Tag
declare const filter: Tag
declare const foreignObject: Tag
declare const g: Tag
declare const hatch: Tag
declare const hatchpath: Tag
declare const image: Tag
declare const line: Tag
declare const linearGradient: Tag
declare const marker: Tag
declare const mask: Tag
declare const mesh: Tag
declare const meshgradient: Tag
declare const meshpatch: Tag
declare const meshrow: Tag
declare const metadata: Tag
declare const mpath: Tag
declare const path: Tag
declare const pattern: Tag
declare const polygon: Tag
declare const polyline: Tag
declare const radialGradient: Tag
declare const rect: Tag
declare const set: Tag
declare const solidcolor: Tag
// NOTE: no `stop` tag declaration: the dts test program includes the DOM
// lib, whose global `stop()` (window.stop) would redeclare the name.
declare const svg: Tag
declare const symbol: Tag
declare const text: Tag
declare const textPath: Tag
declare const tspan: Tag
declare const use: Tag
declare const view: Tag
