import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import defaults from './defaults'
import { icons } from './icons'
import theme from './theme'

// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'
import { VDataTable } from "vuetify/labs/VDataTable";
export default createVuetify({
  ...VDataTable,
  aliases: {
    IconBtn: VBtn,
  },
  defaults,
  icons,
  theme,
})