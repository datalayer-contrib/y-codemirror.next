/* eslint-env browser */

import * as Y from 'yjs'
// @ts-ignore
import { yCollab } from 'y-codemirror.next'
import { WebrtcProvider } from 'y-webrtc'

import { EditorState, EditorView, basicSetup } from '@codemirror/next/basic-setup'
import { javascript } from '@codemirror/next/lang-javascript'
// import { oneDark } from '@codemirror/next/theme-one-dark'

import * as random from 'lib0/random.js'

export const usercolors = [
  { color: '#30bced', light: '#30bced33' },
  { color: '#6eeb83', light: '#6eeb8333' },
  { color: '#ffbc42', light: '#ffbc4233' },
  { color: '#ecd444', light: '#ecd44433' },
  { color: '#ee6352', light: '#ee635233' },
  { color: '#9ac2c9', light: '#9ac2c933' },
  { color: '#8acb88', light: '#8acb8833' },
  { color: '#1be7ff', light: '#1be7ff33' }
]

export const userColor = usercolors[random.uint32() % usercolors.length]

const ydoc = new Y.Doc()
const provider = new WebrtcProvider('codemirror6-demo-room', ydoc)
const ytext = ydoc.getText('codemirror')

provider.awareness.setLocalStateField('user', {
  name: 'Anonymous ' + Math.floor(Math.random() * 100),
  color: userColor.color,
  colorLight: userColor.light
})

const state = EditorState.create({
  doc: ytext.toString(),
  extensions: [
    basicSetup,
    javascript(),
    yCollab(ytext, provider.awareness)
    // oneDark
  ]
})

const view = new EditorView({ state, parent: /** @type {HTMLElement} */ (document.querySelector('#editor')) })

const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
connectBtn.addEventListener('click', () => {
  if (provider.shouldConnect) {
    provider.disconnect()
    connectBtn.textContent = 'Connect'
  } else {
    provider.connect()
    connectBtn.textContent = 'Disconnect'
  }
})

// @ts-ignore
window.example = { provider, ydoc, ytext, view }
