import { resolve } from 'path'
import { defineConfig } from 'vite'

const LIB_NAME = 'jansengine'

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'lib/main.js'),
            name: 'Jansengine',
            // the proper extensions will be added
            fileName: 'jansengine',
        }
    }
})
