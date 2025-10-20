declare namespace chrome {
  namespace runtime {
    interface Port {
      name: string;
      disconnect(): void;
      onDisconnect: {
        addListener(callback: () => void): void;
      };
      onMessage: {
        addListener(callback: (message: any) => void): void;
      };
      postMessage(message: any): void;
    }

    interface MessageSender {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    }

    function sendMessage(message: any, callback?: (response: any) => void): void;
    function sendMessage(
      extensionId: string,
      message: any,
      callback?: (response: any) => void
    ): void;

    const onMessage: {
      addListener(
        callback: (
          message: any,
          sender: MessageSender,
          sendResponse: (response?: any) => void
        ) => void | boolean
      ): void;
    };

    const onInstalled: {
      addListener(callback: () => void): void;
    };
  }

  namespace storage {
    interface StorageArea {
      get(
        keys: string | string[] | Record<string, any> | null,
        callback: (items: Record<string, any>) => void
      ): void;
      set(items: Record<string, any>, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
    }

    const local: StorageArea;
    const sync: StorageArea;
  }

  namespace tabs {
    interface Tab {
      id?: number;
      index: number;
      windowId: number;
      highlighted: boolean;
      active: boolean;
      pinned: boolean;
      url?: string;
      title?: string;
      favIconUrl?: string;
    }
  }
}