// uno.config.js
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons(),
    presetAttributify({ /* preset options */ }),
    presetUno()
  ]
})
