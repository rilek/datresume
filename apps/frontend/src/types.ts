export {};

declare global {
  interface Window {
    umami: {
      track: (event: string, properties?: Record<string, any>) => void;
      identify: (userId: string, properties?: Record<string, any>) => void;
    };
  }
}
