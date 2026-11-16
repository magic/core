/** @import { BlogData } from '../types.mjs' */

/**
 * @param {Record<string, unknown> & { blog: BlogData, url: string }} state
 */
export const View = state =>
  Object.entries(state.blog).map(([year]) => BlogYear({ ...state, year, link: state.url }))
