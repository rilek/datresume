export {};

declare global {
  interface Window {
    umami: {
      track: (event: string, properties?: Record<string, unknown>) => void;
      identify: (userId: string, properties?: Record<string, unknown>) => void;
    };
  }
}
