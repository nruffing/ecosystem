import mediumZoom from 'medium-zoom'
import type { ZoomOptions } from 'medium-zoom'
import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { mediumZoomSymbol } from './composables/index.js'

import './styles/vars.css'
import './styles/medium-zoom.css'

declare const __MZ_SELECTOR__: string
declare const __MZ_ZOOM_OPTIONS__: ZoomOptions
declare const __MZ_DELAY__: number

const selector = __MZ_SELECTOR__
const zoomOptions = __MZ_ZOOM_OPTIONS__
const delay = __MZ_DELAY__

export default defineClientConfig({
  enhance({ app, router }) {
    if (__VUEPRESS_SSR__ || !selector) return

    // create zoom instance and provide it
    const zoom = mediumZoom(zoomOptions)
    zoom.refresh = (sel = selector) => {
      zoom.detach()
      zoom.attach(sel)
    }
    app.provide(mediumZoomSymbol, zoom)

    router.afterEach(() => {
      setTimeout(() => zoom.refresh(), delay)
    })
  },
}) as ClientConfig
