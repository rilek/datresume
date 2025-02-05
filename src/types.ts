declare global {
  interface Window {
    umami: {
      track: (event?: string | object | Function, data?: object) => void
    }
  }
}