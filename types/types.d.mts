/**
 * A virtual dom node, as produced by
 */
export type VNode = {
  name: string
  props?:
    | {
        [key: string]: unknown
      }
    | undefined
  children?: unknown
}
/**
 * A list of virtual dom children.
 */
export type VNodeList = VNodeChild[]
/**
 * A single virtual dom child: a node, a primitive, or a list of children.
 */
export type VNodeChild = VNode | string | number | boolean | null | undefined | VNodeList
/**
 * Props (or state) object passed to modules.
 */
export type ModuleProps = {
  [key: string]: unknown
}
/**
 * The result of a module View.
 * `boolean` is included, as modules may short-circuit on prop checks,
 * and hyperapp drops falsy children.
 */
export type ViewResult = VNodeChild | boolean
/**
 * A module View function: `(props, children) => vdom`,
 * with optional sub modules and module data attached.
 */
export type ModuleView = {
  (props?: ModuleProps | VNodeChild, children?: VNodeChild | VNodeList): ViewResult
  [key: string]: unknown
}
/**
 * The first argument of an html tag helper:
 * a props object, or a child if children are passed first.
 */
export type TagInput = ModuleProps | VNodeChild | (() => VNodeChild)
/**
 * An html tag helper: `div(props, children)`.
 * Parameters are permissive, as tag helpers accept arbitrary vdom.
 */
export type Tag = {
  (props?: unknown, children?: unknown): VNode
}
/**
 * A hyperapp subscription.
 */
export type Subscription =
  | ((
      actions: {
        [key: string]: unknown
      },
      state: {
        [key: string]: unknown
      },
    ) => (() => void) | boolean | void)
  | string
/**
 * A hyperapp style app object: `{ state, actions, effects, subscriptions }`,
 * plus whatever the user app or themes add.
 */
export type AppObject = {
  state?: {
    [key: string]: unknown
  }
  actions?: {
    [key: string]: unknown
  }
  effects?: {
    [key: string]: unknown
  }
  helpers?: {
    [key: string]: unknown
  }
  subscriptions?: Subscription[] | Record<string, unknown>
  modules?: {
    [key: string]: unknown
  }
  lib?: {
    [key: string]: unknown
  }
  pages?: PageObject[]
  files?: string[]
  hoisted?: unknown
  blog?: string[]
  View: (page: PageObject, hashes: Hashes) => (state: unknown) => ViewResult
  config?: Config
  client?: string
  css?: {
    [key: string]: unknown
  }
  hashes?: Hashes
  sw?: string
  style?: unknown
  links?: string[]
  tags?: {
    [key: string]: unknown
  }
  init?: unknown
  cookies?: {
    [key: string]: unknown
  }
  dependencies?: {
    [key: string]: unknown
  }
  lambdas?: {
    [key: string]: unknown
  }
  build?: {
    [key: string]: unknown
  }
  static?: {
    [key: string]: unknown
  }
  server?: {
    [key: string]: unknown
  }
  [key: string]: unknown
}
/**
 * A module as registered in app.modules: a View function and/or a plain object
 * with attached properties (propTypes, View, style, ...).
 */
export type ModuleDecl = {
  global?: Record<string, unknown>
  globals?: Record<string, unknown>
  state?: Record<string, unknown>
  actions?: Record<string, unknown>
  effects?: Record<string, unknown>
  helpers?: Record<string, unknown>
  subscriptions?: unknown[]
  cookies?: Record<string, unknown>
  init?: unknown
  View?: unknown
  style?: unknown
  server?: unknown
  propTypes?: unknown
  [key: string]: unknown
}
/**
 * A page object as produced by the prepare tasks.
 * Keys like `name`, `path`, `file`, `View`, `Head` get added along the way.
 */
export type PageObject = {
  state?: Record<string, unknown>
  name?: string
  path?: string
  file?: string
  View?: ModuleView
  Head?: ModuleView
  style?: unknown
  hash?: string
  link?: string
  rendered?: string
  [key: string]: unknown
}
/**
 * An `Error` as produced by Node.js, which attaches a `code`
 * (e.g. `MODULE_NOT_FOUND`) to some errors.
 */
export type NodeError = Error & {
  code?: string
  url?: string
}
/**
 * Directories used by the config.
 */
export type ConfigDir = {
  PAGES: string
  PUBLIC: string
  ASSETS: string
  MODULES: string
  STATIC: string | string[]
  THEMES: string
  API: string
  LIB: string[]
}
/**
 * SRI hashes, keyed by resource path, eg `/magic.js`.
 */
export type Hashes = {
  [key: string]: string
}
/**
 * Theme variables passed to style functions.
 */
export type ThemeVars = {
  colors?:
    | {
        [key: string]: unknown
      }
    | undefined
  text?:
    | {
        [key: string]: unknown
      }
    | undefined
  neutral?:
    | {
        [key: string]: unknown
      }
    | undefined
  buttonBackgroundColor?: string | undefined
  buttonColor?: string | undefined
  buttonBackgroundColorHover?: string | undefined
  buttonColorHover?: string | undefined
}
/**
 * A blog archive, as prepared by tasks/prepare/blog.mjs:
 * year → month → day → posts.
 *
 * A single blog post entry in the blog index.
 */
export type BlogPostEntry = {
  name?: string
  state?: Record<string, unknown>
  path?: string
  [key: string]: unknown
}
/**
 * A blog archive, as prepared by tasks/prepare/blog.mjs:
 * year → month → day → posts.
 */
export type BlogData = {
  [year: string]: {
    [month: string]: {
      [day: string]: BlogPostEntry[]
    }
  }
}
/**
 * A script tag source as configured in PREPEND/APPEND_SCRIPTS.
 */
export type ScriptSrc = {
  src: string
  integrity?: string | undefined
  crossorigin?: string | undefined
}
/**
 * A tag configured in PREPEND/APPEND_TAGS.
 */
export type TagConfig = {
  name: string
  props?:
    | {
        [key: string]: unknown
      }
    | undefined
  children?: VNodeChild
}
/**
 * The magic config object, as returned by `runConfig()`.
 *
 * The config is dynamic: keys get added from the user's config file
 * (`magic.mjs`) and from CLI arguments, hence the index signature.
 * Keys that `runConfig` normalizes are required, user-provided keys optional.
 */
export type ConfigBase = {
  CONFIG_FILE_PATH: string
  ROOT: string
  NO_CHECK_LINKS?: unknown
  NO_CHECK_LINKS_REMOTE?: unknown
  NO_CHECK_LINKS_EXIT?: unknown
  DIR: ConfigDir
  CLIENT_LIB_NAME: string
  NODE_MODULES: string
  CLIENT_SERVICE_WORKER_NAME: string
  HOST: string
  PORT: number
  URL?: string | false | undefined
  CNAME: string | false
  ROBOTS_TXT: boolean
  SITEMAP: boolean
  API_DIR?: string | undefined
  THEME_VARS?: ThemeVars | undefined
  HASH_FILE_NAME: string
  HASHES: Hashes
  WEB_ROOT?: string | undefined
  URL_WARNING?: number | undefined
  PREPEND_SCRIPTS: ScriptSrc[]
  APPEND_SCRIPTS: ScriptSrc[]
  PREPEND_JS: string[]
  APPEND_JS: string[]
  PREPEND_CSS: string[]
  APPEND_CSS: string[]
  PREPEND_TAGS: TagConfig[]
  APPEND_TAGS: TagConfig[]
  INCLUDED_HASH_EXTENSIONS: string[]
  THEME: string | string[]
  ADD_STATIC?: string | string[] | undefined
  FILETYPES: {
    ZIPPABLE: string[]
    IMAGES: string[]
  }
  ENV: string
  IS_PROD: boolean
  IS_DEV: boolean
  IGNORED_STATIC: string[]
  BLOG_DIR?: string | undefined
  TMP_DIR: string
  HOIST: string | string[]
  KEEP_CONSOLE?: unknown
  KEEP_DEBUGGER?: unknown
  __DEPRECATED__?: string[] | undefined
}
/**
 * The config with its dynamic (CLI-arg and user-file) keys allowed.
 */
export type Config = ConfigBase & {
  [key: string]: unknown
}
/**
 * The config while it is still being built in `runConfig()`.
 * All keys are optional, as they are filled in along the way.
 */
export type ConfigDraftBase = {
  CONFIG_FILE_PATH?: string | undefined
  ROOT?: string | undefined
  DIR?:
    | {
        PUBLIC?: string
      }
    | undefined
  PUBLIC?: string | undefined
  API_DIR?: string | undefined
  WEB_ROOT?: string | undefined
  URL?: string | false | undefined
  HASHES?:
    | {
        [key: string]: string
      }
    | undefined
  THEME_VARS?:
    | {
        colors?: {
          [key: string]: unknown
        }
      }
    | undefined
  ADD_STATIC?: string | string[] | undefined
  IGNORED_STATIC?: string | string[] | undefined
  BLOG_DIR?: string | undefined
  TMP_DIR?: string | undefined
  HASH_FILE_NAME?: string | undefined
}
/**
 * The draft config with its dynamic (CLI-arg and user-file) keys allowed.
 */
export type ConfigDraft = ConfigDraftBase & {
  [key: string]: unknown
}
/**
 * The result of `saveImport()` for a user file:
 * either the module namespace, or an Error.
 */
export type ImportedModule =
  | {
      [key: string]: unknown
    }
  | Error
  | null
/**
 * A theme module export: `{ state, actions, effects, subscriptions }`.
 */
export type ThemeModule = {
  state?:
    | {
        [key: string]: unknown
      }
    | undefined
  actions?:
    | {
        [key: string]: unknown
      }
    | undefined
  effects?:
    | {
        [key: string]: unknown
      }
    | undefined
  subscriptions?: Subscription[] | undefined
}
/**
 * Props for a module, as checked by `CHECK_PROPS`.
 */
export type Props = ModuleProps
/**
 * A single propType entry as used by `CHECK_PROPS`.
 */
export type PropTypeDecl = {
  key?: string | undefined
  type?: string | string[] | undefined
  required?: boolean | string[] | undefined
  oneOf?: unknown[] | undefined
  someOf?: unknown[] | undefined
  default?: unknown
  min?: number | undefined
  max?: number | undefined
  item?:
    | {
        type: string | string[]
        keys?: {
          key: string
          type: string
        }[]
      }
    | undefined
}
/**
 * The propTypeDecl object passed to `CHECK_PROPS`:
 * maps module names to arrays of `PropTypeDecl`.
 */
export type PropTypeDecls = {
  [key: string]: PropTypeDecl[] | PropTypeDecl
}
/**
 * SWC AST span.
 */
export type SwcSpan = {
  start?: number
  end?: number
  ctxt?: number
}
/**
 * A permissive structural view of SWC AST nodes.
 * All fields are optional; the visitor narrows by `type` and uses
 * guards/casts where a field is known to exist for a given node.
 */
export type SwcNode = {
  type?: string
  span?: SwcSpan
  body?: SwcNode
  stmts?: (SwcNode | undefined)[]
  declarations?: (SwcNode | undefined)[]
  specifiers?: (SwcNode | undefined)[]
  properties?: (SwcNode | undefined)[]
  elements?: (SwcNode | undefined)[]
  quasis?: (SwcNode | undefined)[]
  params?: (SwcNode | undefined)[]
  arguments?: (SwcNode | undefined)[]
  expressions?: (SwcNode | undefined)[]
  expression?: SwcNode
  callee?: SwcNode
  left?: SwcNode
  right?: SwcNode
  test?: SwcNode
  consequent?: SwcNode
  alternate?: SwcNode
  id?: SwcNode
  init?: SwcNode
  argument?: SwcNode
  key?: SwcNode
  value?: SwcNode | string
  property?: SwcNode
  object?: SwcNode
  block?: SwcNode
  handler?: SwcNode
  param?: SwcNode
  update?: SwcNode
  label?: SwcNode
  local?: SwcNode
  orig?: SwcNode
  pat?: SwcNode
  decorators?: SwcNode
  expr?: SwcNode
  raw?: unknown
  cooked?: unknown
  name?: string
  optional?: boolean
  spread?: unknown
  typeArguments?: unknown
}
/**
 * Tracks which modules and object members a piece of code uses.
 */
export type UsedObject = {
  modules: string[]
  lib: string[]
  actions: string[]
  effects: string[]
  subscriptions: string[]
  helpers: string[]
  [key: string]: string[]
}
/**
 * A message that can be logged by `CHECK_PROPS`.
 */
export type LogMessage =
  | string
  | (Error & {
      code?: string
    })
/**
 * A logger as accepted by `CHECK_PROPS`.
 */
export type LogLike = ((...msg: LogMessage[]) => void) & {
  error?: (
    error: Error & {
      code?: string
    },
    ...msg: unknown[]
  ) => boolean
  warn?: (title: string, ...msg: unknown[]) => boolean
}
