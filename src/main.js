/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import {createApp} from 'vue'

// Plugins
import {registerPlugins} from '@/plugins'

import VConsole from 'vconsole';

if (import.meta.env.NODE_ENV === 'development') {
  const vConsole = new VConsole()
}

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
