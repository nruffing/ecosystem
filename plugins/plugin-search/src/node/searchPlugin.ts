import chokidar from 'chokidar'
import type { Page, Plugin } from 'vuepress/core'
import type { LocaleConfig } from 'vuepress/shared'
import { getDirname, path } from 'vuepress/utils'
import type { HotKeyOptions } from '../shared/index.js'
import { prepareSearchIndex } from './prepareSearchIndex.js'

const __dirname = getDirname(import.meta.url)

/**
 * Options for @vuepress/plugin-search
 */
export interface SearchPluginOptions {
  /**
   * Locales config for search box
   */
  locales?: LocaleConfig<{
    placeholder: string
  }>

  /**
   * Specify the [event.key](http://keycode.info/) of the hotkeys
   *
   * When hotkeys are pressed, the search box input will be focused
   *
   * Set to an empty array to disable hotkeys
   *
   * @default ['s', '/']
   */
  hotKeys?: (string | HotKeyOptions)[]

  /**
   * Specify the maximum number of search results
   *
   * @default 5
   */
  maxSuggestions?: number

  /**
   * A function to determine whether a page should be included in the search index
   */
  isSearchable?: (page: Page) => boolean

  /**
   * A function to add extra fields to the search index of a page
   */
  getExtraFields?: (page: Page) => string[]
}

export const searchPlugin = ({
  locales = {},
  hotKeys = ['s', '/'],
  maxSuggestions = 5,
  isSearchable = () => true,
  getExtraFields = () => [],
}: SearchPluginOptions = {}): Plugin => ({
  name: '@vuepress/plugin-search',

  clientConfigFile: path.resolve(__dirname, '../client/config.js'),

  define: {
    __SEARCH_LOCALES__: locales,
    __SEARCH_HOT_KEYS__: hotKeys,
    __SEARCH_MAX_SUGGESTIONS__: maxSuggestions,
  },

  onPrepared: async (app) => {
    await prepareSearchIndex({ app, isSearchable, getExtraFields })
  },

  onWatched: (app, watchers) => {
    // here we only watch the page data files
    // if the extra fields generated by `getExtraFields` are not included
    // in the page data, the changes may not be watched
    const searchIndexWatcher = chokidar.watch('internal/pageData/*', {
      cwd: app.dir.temp(),
      ignoreInitial: true,
    })
    searchIndexWatcher.on('add', () => {
      prepareSearchIndex({ app, isSearchable, getExtraFields })
    })
    searchIndexWatcher.on('change', () => {
      prepareSearchIndex({ app, isSearchable, getExtraFields })
    })
    searchIndexWatcher.on('unlink', () => {
      prepareSearchIndex({ app, isSearchable, getExtraFields })
    })
    watchers.push(searchIndexWatcher)
  },
})
