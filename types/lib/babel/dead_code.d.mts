declare function _default(
  app: {
    modules?: {
      [key: string]: unknown
    }
    lib?: {
      [key: string]: unknown
    }
  },
  {
    WEB_ROOT,
  }: {
    WEB_ROOT?: string
  },
): (opts: { types: BabelTypes }) => {
  visitor: BabelVisitors
}
export default _default
/**
 * A permissive structural view of Babel AST nodes:
 * indexable, callable, and array-like access all work.
 */
export type BabelValue = {
  [key: string]: BabelValue
  [key: number]: BabelValue
}
/**
 * The opts for `BabelPath.traverse`.
 */
export type TraverseOpts = {
  enter: (path: BabelPath) => void
}
/**
 * A minimal structural view of a Babel traversal path.
 */
export type BabelPath = {
  node: BabelValue
  remove: () => void
  traverse: (opts: TraverseOpts) => void
}
/**
 * A single Babel visitor node (enter/exit callbacks).
 */
export type BabelVisitorNode = {
  enter?: (path: BabelPath) => void
  exit?: (path: BabelPath) => void
}
/**
 * A map of Babel visitor node names to visitor nodes.
 */
export type BabelVisitors = {
  [key: string]: BabelVisitorNode
}
/**
 * The subset of Babel `types` used here: node type guards.
 */
export type BabelTypes = {
  [key: string]: (node: unknown) => boolean
}
/**
 * A bucket of used object members, eg `used.actions['lib'][name]`.
 */
export type UsedBuckets = {
  [key: string]: {
    [key: string]: BabelValue
  }
}
