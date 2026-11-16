/**
 * Shared JSDoc type definitions for @magic/core.
 *
 * Import from other files with a JSDoc \@import tag
 *
 *   @import { Config } from './types.mjs'
 */

/**
 * A virtual dom node, as produced by @magic/hyperapp.
 * `children` is `unknown`, as vdom trees are built dynamically.
 *
 * @typedef {Object} VNode
 * @property {string} name
 * @property {{ [key: string]: unknown }} [props]
 * @property {unknown} [children]
 */

/**
 * A list of virtual dom children.
 *
 * @typedef {VNodeChild[]} VNodeList
 */

/**
 * A single virtual dom child: a node, a primitive, or a list of children.
 *
 * @typedef {VNode | string | number | boolean | null | undefined | VNodeList} VNodeChild
 */

/**
 * Props (or state) object passed to modules.
 *
 * @typedef {{ [key: string]: unknown }} ModuleProps
 */

/**
 * The result of a module View.
 * `boolean` is included, as modules may short-circuit on prop checks,
 * and hyperapp drops falsy children.
 *
 * @typedef {VNodeChild | boolean} ViewResult
 */

/**
 * A module View function: `(props, children) => vdom`,
 * with optional sub modules and module data attached.
 *
 * @typedef {{ (props?: ModuleProps | VNodeChild, children?: VNodeChild | VNodeList): ViewResult, [key: string]: unknown }} ModuleView
 */

/**
 * The first argument of an html tag helper:
 * a props object, or a child if children are passed first.
 *
 * @typedef {ModuleProps | VNodeChild | (() => VNodeChild)} TagInput
 */

/**
 * An html tag helper: `div(props, children)`.
 * Parameters are permissive, as tag helpers accept arbitrary vdom.
 *
 * @typedef {{ (props?: unknown, children?: unknown): VNode }} Tag
 */

/**
 * A hyperapp subscription.
 *
 * @typedef {((actions: { [key: string]: unknown }, state: { [key: string]: unknown }) => (() => void) | boolean | void) | string} Subscription
 */

/**
 * A hyperapp style app object: `{ state, actions, effects, subscriptions }`,
 * plus whatever the user app or themes add.
 *
 * @typedef {{ state?: { [key: string]: unknown }, actions?: { [key: string]: unknown }, effects?: { [key: string]: unknown }, helpers?: { [key: string]: unknown }, subscriptions?: Subscription[] | Record<string, unknown>, modules?: { [key: string]: unknown }, lib?: { [key: string]: unknown }, pages?: PageObject[], files?: string[], hoisted?: unknown, blog?: string[], View: (page: PageObject, hashes: Hashes) => (state: unknown) => ViewResult, config?: Config, client?: string, css?: { [key: string]: unknown }, hashes?: Hashes, sw?: string, style?: unknown, links?: string[], tags?: { [key: string]: unknown }, init?: unknown, cookies?: { [key: string]: unknown }, dependencies?: { [key: string]: unknown }, lambdas?: { [key: string]: unknown }, build?: { [key: string]: unknown }, static?: { [key: string]: unknown }, server?: { [key: string]: unknown }, [key: string]: unknown }} AppObject
 * @property {{ [key: string]: unknown }} [server]
 */

/**
 * A module as registered in app.modules: a View function and/or a plain object
 * with attached properties (propTypes, View, style, ...).
 *
 * @typedef {{ global?: Record<string, unknown>, globals?: Record<string, unknown>, state?: Record<string, unknown>, actions?: Record<string, unknown>, effects?: Record<string, unknown>, helpers?: Record<string, unknown>, subscriptions?: unknown[], cookies?: Record<string, unknown>, init?: unknown, View?: unknown, style?: unknown, server?: unknown, propTypes?: unknown, [key: string]: unknown }} ModuleDecl
 */

/**
 * A page object as produced by the prepare tasks.
 * Keys like `name`, `path`, `file`, `View`, `Head` get added along the way.
 *
 * @typedef {{ state?: Record<string, unknown>, name?: string, path?: string, file?: string, View?: ModuleView, Head?: ModuleView, style?: unknown, hash?: string, link?: string, rendered?: string, [key: string]: unknown }} PageObject
 */

/**
 * An `Error` as produced by Node.js, which attaches a `code`
 * (e.g. `MODULE_NOT_FOUND`) to some errors.
 *
 * @typedef {Error & { code?: string, url?: string }} NodeError
 */

/**
 * Directories used by the config.
 *
 * @typedef {Object} ConfigDir
 * @property {string} PAGES
 * @property {string} PUBLIC
 * @property {string} ASSETS
 * @property {string} MODULES
 * @property {string | string[]} STATIC
 * @property {string} THEMES
 * @property {string} API
 * @property {string[]} LIB
 */

/**
 * SRI hashes, keyed by resource path, eg `/magic.js`.
 *
 * @typedef {{ [key: string]: string }} Hashes
 */

/**
 * Theme variables passed to style functions.
 *
 * @typedef {Object} ThemeVars
 * @property {{ [key: string]: unknown }} [colors]
 * @property {{ [key: string]: unknown }} [text]
 * @property {{ [key: string]: unknown }} [neutral]
 * @property {string} [buttonBackgroundColor]
 * @property {string} [buttonColor]
 * @property {string} [buttonBackgroundColorHover]
 * @property {string} [buttonColorHover]
 */

/**
 * A blog archive, as prepared by tasks/prepare/blog.mjs:
 * year → month → day → posts.
 *
 * A single blog post entry in the blog index.
 *
 * @typedef {{ name?: string, state?: Record<string, unknown>, path?: string, [key: string]: unknown }} BlogPostEntry
 */

/**
 * A blog archive, as prepared by tasks/prepare/blog.mjs:
 * year → month → day → posts.
 *
 * @typedef {{ [year: string]: { [month: string]: { [day: string]: BlogPostEntry[] } } }} BlogData
 */

/**
 * A script tag source as configured in PREPEND/APPEND_SCRIPTS.
 *
 * @typedef {Object} ScriptSrc
 * @property {string} src
 * @property {string} [integrity]
 * @property {string} [crossorigin]
 */

/**
 * A tag configured in PREPEND/APPEND_TAGS.
 *
 * @typedef {Object} TagConfig
 * @property {string} name
 * @property {{ [key: string]: unknown }} [props]
 * @property {VNodeChild} [children]
 */

/**
 * The magic config object, as returned by `runConfig()`.
 *
 * The config is dynamic: keys get added from the user's config file
 * (`magic.mjs`) and from CLI arguments, hence the index signature.
 * Keys that `runConfig` normalizes are required, user-provided keys optional.
 *
 * @typedef {Object} ConfigBase
 * @property {string} CONFIG_FILE_PATH
 * @property {string} ROOT
 * @property {unknown} [NO_CHECK_LINKS]
 * @property {unknown} [NO_CHECK_LINKS_REMOTE]
 * @property {unknown} [NO_CHECK_LINKS_EXIT]
 * @property {ConfigDir} DIR
 * @property {string} CLIENT_LIB_NAME
 * @property {string} NODE_MODULES
 * @property {string} CLIENT_SERVICE_WORKER_NAME
 * @property {string} HOST
 * @property {number} PORT
 * @property {string | false} [URL]
 * @property {string | false} CNAME
 * @property {boolean} ROBOTS_TXT
 * @property {boolean} SITEMAP
 * @property {string} [API_DIR]
 * @property {ThemeVars} [THEME_VARS]
 * @property {string} HASH_FILE_NAME
 * @property {Hashes} HASHES
 * @property {string} [WEB_ROOT]
 * @property {number} [URL_WARNING]
 * @property {ScriptSrc[]} PREPEND_SCRIPTS
 * @property {ScriptSrc[]} APPEND_SCRIPTS
 * @property {string[]} PREPEND_JS
 * @property {string[]} APPEND_JS
 * @property {string[]} PREPEND_CSS
 * @property {string[]} APPEND_CSS
 * @property {TagConfig[]} PREPEND_TAGS
 * @property {TagConfig[]} APPEND_TAGS
 * @property {string[]} INCLUDED_HASH_EXTENSIONS
 * @property {string | string[]} THEME
 * @property {string | string[]} [ADD_STATIC]
 * @property {{ ZIPPABLE: string[], IMAGES: string[] }} FILETYPES
 * @property {string} ENV
 * @property {boolean} IS_PROD
 * @property {boolean} IS_DEV
 * @property {string[]} IGNORED_STATIC
 * @property {string} [BLOG_DIR]
 * @property {string} TMP_DIR
 * @property {string | string[]} HOIST
 * @property {unknown} [KEEP_CONSOLE]
 * @property {unknown} [KEEP_DEBUGGER]
 * @property {string[]} [__DEPRECATED__]
 */

/**
 * The config with its dynamic (CLI-arg and user-file) keys allowed.
 *
 * @typedef {ConfigBase & { [key: string]: unknown }} Config
 */

/**
 * The config while it is still being built in `runConfig()`.
 * All keys are optional, as they are filled in along the way.
 *
 * @typedef {Object} ConfigDraftBase
 * @property {string} [CONFIG_FILE_PATH]
 * @property {string} [ROOT]
 * @property {{ PUBLIC?: string }} [DIR]
 * @property {string} [PUBLIC]
 * @property {string} [API_DIR]
 * @property {string} [WEB_ROOT]
 * @property {string | false} [URL]
 * @property {{ [key: string]: string }} [HASHES]
 * @property {{ colors?: { [key: string]: unknown } }} [THEME_VARS]
 * @property {string | string[]} [ADD_STATIC]
 * @property {string | string[]} [IGNORED_STATIC]
 * @property {string} [BLOG_DIR]
 * @property {string} [TMP_DIR]
 * @property {string} [HASH_FILE_NAME]
 */

/**
 * The draft config with its dynamic (CLI-arg and user-file) keys allowed.
 *
 * @typedef {ConfigDraftBase & { [key: string]: unknown }} ConfigDraft
 */

/**
 * The result of `saveImport()` for a user file:
 * either the module namespace, or an Error.
 *
 * @typedef {{ [key: string]: unknown } | Error | null} ImportedModule
 */

/**
 * A theme module export: `{ state, actions, effects, subscriptions }`.
 *
 * @typedef {Object} ThemeModule
 * @property {{ [key: string]: unknown }} [state]
 * @property {{ [key: string]: unknown }} [actions]
 * @property {{ [key: string]: unknown }} [effects]
 * @property {Subscription[]} [subscriptions]
 */

/**
 * Props for a module, as checked by `CHECK_PROPS`.
 *
 * @typedef {ModuleProps} Props
 */

/**
 * A single propType entry as used by `CHECK_PROPS`.
 *
 * @typedef {Object} PropTypeDecl
 * @property {string} [key]
 * @property {string | string[]} [type]
 * @property {boolean | string[]} [required]
 * @property {unknown[]} [oneOf]
 * @property {unknown[]} [someOf]
 * @property {unknown} [default]
 * @property {number} [min]
 * @property {number} [max]
 * @property {{ type: string | string[], keys?: { key: string, type: string }[] }} [item]
 */

/**
 * The propTypeDecl object passed to `CHECK_PROPS`:
 * maps module names to arrays of `PropTypeDecl`.
 *
 * @typedef {{ [key: string]: PropTypeDecl[] | PropTypeDecl }} PropTypeDecls
 */

/**
 * SWC AST span.
 * @typedef {{ start?: number, end?: number, ctxt?: number }} SwcSpan */

/**
 * A permissive structural view of SWC AST nodes.
 * All fields are optional; the visitor narrows by `type` and uses
 * guards/casts where a field is known to exist for a given node.
 *
 * @typedef {{
 *   type?: string,
 *   span?: SwcSpan,
 *   body?: SwcNode,
 *   stmts?: (SwcNode | undefined)[],
 *   declarations?: (SwcNode | undefined)[],
 *   specifiers?: (SwcNode | undefined)[],
 *   properties?: (SwcNode | undefined)[],
 *   elements?: (SwcNode | undefined)[],
 *   quasis?: (SwcNode | undefined)[],
 *   params?: (SwcNode | undefined)[],
 *   arguments?: (SwcNode | undefined)[],
 *   expressions?: (SwcNode | undefined)[],
 *   expression?: SwcNode,
 *   callee?: SwcNode,
 *   left?: SwcNode,
 *   right?: SwcNode,
 *   test?: SwcNode,
 *   consequent?: SwcNode,
 *   alternate?: SwcNode,
 *   id?: SwcNode,
 *   init?: SwcNode,
 *   argument?: SwcNode,
 *   key?: SwcNode,
 *   value?: SwcNode | string,
 *   property?: SwcNode,
 *   object?: SwcNode,
 *   block?: SwcNode,
 *   handler?: SwcNode,
 *   param?: SwcNode,
 *   update?: SwcNode,
 *   label?: SwcNode,
 *   local?: SwcNode,
 *   orig?: SwcNode,
 *   pat?: SwcNode,
 *   decorators?: SwcNode,
 *   expr?: SwcNode,
 *   raw?: unknown,
 *   cooked?: unknown,
 *   name?: string,
 *   optional?: boolean,
 *   spread?: unknown,
 *   typeArguments?: unknown
 * }} SwcNode */

/**
 * Tracks which modules and object members a piece of code uses.
 * @typedef {{ modules: string[], lib: string[], actions: string[], effects: string[], subscriptions: string[], helpers: string[], [key: string]: string[] }} UsedObject */

/**
 * A message that can be logged by `CHECK_PROPS`.
 *
 * @typedef {string | (Error & { code?: string })} LogMessage
 */

/**
 * A logger as accepted by `CHECK_PROPS`.
 * @magic/log's default export is assignable to this.
 *
 * @typedef {((...msg: LogMessage[]) => void) & { error?: (error: Error & { code?: string }, ...msg: unknown[]) => boolean, warn?: (title: string, ...msg: unknown[]) => boolean }} LogLike
 */
