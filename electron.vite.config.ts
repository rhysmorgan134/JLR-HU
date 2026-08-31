// import { resolve } from 'path'
// import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
// import react from '@vitejs/plugin-react'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import svgr from 'vite-plugin-svgr'
//
// export default defineConfig({
//   main: {
//     plugins: [
//       externalizeDepsPlugin({
//         exclude: ['node-carplay']
//       })
//     ],
//     build: {
//       commonjsOptions: {
//         include: [/node_modules/, /os8104New/]
//       },
//       rollupOptions: {
//         external: ['unix-dgram', 'bindings']
//       }
//     }
//   },
//   preload: {
//     plugins: [externalizeDepsPlugin()]
//   },
//   renderer: {
//     resolve: {
//       alias: {
//         '@renderer': resolve('src/renderer/src'),
//         stream: 'stream-browserify',
//         Buffer: 'buffer'
//       }
//     },
//     optimizeDeps: {
//       include: [
//         '@emotion/react',
//         '@emotion/styled',
//         '@mui/material/Tooltip',
//         '@mui/material/Unstable_Grid2'
//       ],
//       esbuildOptions: {
//         define: {
//           global: 'globalThis'
//         },
//         plugins: [
//           NodeGlobalsPolyfillPlugin({
//             process: true,
//             buffer: true
//           })
//         ]
//       }
//     },
//     plugins: [
//       react({
//         jsxImportSource: '@emotion/react',
//         babel: {
//           plugins: ['@emotion/babel-plugin']
//         }
//       }),
//       svgr({
//         include: '**/*.svg?react'
//       })
//     ]
//   }
// })

import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['node-carplay']
      })
    ],
    build: {
      rollupOptions: {
        external: ['socketmost', 'serialport', '@serialport/bindings-cpp', 'unix-dgram', 'bindings']
      }
    }
  },

  preload: {
    plugins: [externalizeDepsPlugin()]
  },

  renderer: {
    resolve: {
      dedupe: [
        'react',
        'react-dom',
        '@emotion/react',
        '@emotion/styled',
        '@mui/material',
        '@mui/system'
      ],
      alias: {
        '@renderer': resolve('src/renderer/src'),
        stream: 'stream-browserify',
        Buffer: 'buffer'
      }
    },
    optimizeDeps: {
      include: [
        '@emotion/react',
        '@emotion/styled',
        '@mui/material',
        '@mui/system',
        '@mui/icons-material'
      ],
      exclude: ['pcm-ringbuf-player'],
      esbuildOptions: {
        define: {
          global: 'globalThis'
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true
          })
        ]
      }
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      }),
      svgr({
        include: '**/*.svg?react'
      })
    ]
  }
})
