import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect, vi } from "vitest";

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock environment variables
beforeAll(() => {
  // Mock environment variables
  process.env.NODE_ENV = "test";
  process.env.VITE_API_URL = "http://localhost:3001";
  process.env.VITE_SOCKET_URL = "http://localhost:3001";
});

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, "sessionStorage", {
  value: localStorageMock,
});

// Mock URL.createObjectURL
Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  value: vi.fn(() => "mocked-url"),
});

Object.defineProperty(URL, "revokeObjectURL", {
  writable: true,
  value: vi.fn(),
});

// Mock fetch
global.fetch = vi.fn();

// Mock WebSocket
const MockWebSocket = vi.fn().mockImplementation(() => ({
  close: vi.fn(),
  send: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}));

// Add static properties to MockWebSocket
(MockWebSocket as any).CONNECTING = 0;
(MockWebSocket as any).OPEN = 1;
(MockWebSocket as any).CLOSING = 2;
(MockWebSocket as any).CLOSED = 3;

global.WebSocket = MockWebSocket as any;

// Mock File and FileReader
global.File = vi.fn().mockImplementation((chunks, filename, options) => ({
  name: filename,
  size: chunks.reduce((acc: number, chunk: any) => acc + chunk.length, 0),
  type: options?.type || "",
  lastModified: Date.now(),
  arrayBuffer: vi.fn(),
  slice: vi.fn(),
  stream: vi.fn(),
  text: vi.fn(),
}));

const MockFileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(),
  readAsText: vi.fn(),
  readAsArrayBuffer: vi.fn(),
  abort: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  result: null,
  error: null,
  readyState: 0,
  EMPTY: 0,
  LOADING: 1,
  DONE: 2,
}));

// Add static properties to MockFileReader
(MockFileReader as any).EMPTY = 0;
(MockFileReader as any).LOADING = 1;
(MockFileReader as any).DONE = 2;

global.FileReader = MockFileReader as any;

// Mock HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = vi.fn();

// Mock performance.now
Object.defineProperty(window, "performance", {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16) as any);
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Mock crypto
Object.defineProperty(window, "crypto", {
  value: {
    getRandomValues: vi.fn((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
    randomUUID: vi.fn(() => "mocked-uuid"),
  },
});

// Console suppression for tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Custom matchers (extend jest-dom)
expect.extend({
  toBeInTheDocument: (received: any) => {
    const pass = received && document.body.contains(received);
    return {
      pass,
      message: () =>
        pass
          ? `Expected element not to be in the document`
          : `Expected element to be in the document`,
    };
  },
});

// Global test helpers
export const createMockEvent = (type: string, properties: any = {}) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, properties);
  return event;
};

export const createMockFile = (
  name: string,
  content: string,
  type: string = "text/plain",
) => {
  return new File([content], name, { type });
};

export const waitFor = (callback: () => void, timeout: number = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      try {
        callback();
        resolve(undefined);
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error);
        } else {
          setTimeout(check, 10);
        }
      }
    };
    check();
  });
};

// Mock socket.io-client
vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
    id: "mock-socket-id",
  })),
}));

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: "/", search: "", hash: "", state: null }),
    useParams: () => ({}),
  };
});

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    span: "span",
    button: "button",
    img: "img",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));
