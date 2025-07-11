import { useAppStore } from "@/store";
import { SingleUserType } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import React, { ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { vi } from "vitest";

// Mock data generators
export const createMockUser = (
  overrides: Partial<SingleUserType> = {},
): SingleUserType => ({
  _id: "user-123",
  name: "Test User",
  email: "test@example.com",
  image: "https://example.com/avatar.jpg",
  isActive: true,
  lastActive: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockMessage = (overrides: any = {}) => ({
  _id: "message-123",
  content: "Test message content",
  sender: createMockUser(),
  conversation: "conversation-123",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDelivered: true,
  isSeen: false,
  files: [],
  ...overrides,
});

export const createMockConversation = (overrides: any = {}) => ({
  _id: "conversation-123",
  participants: [
    createMockUser(),
    createMockUser({ _id: "user-456", name: "Other User" }),
  ],
  participantsKey: "user-123_user-456",
  lastMessage: createMockMessage(),
  isGroup: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  unreadMessagesCount: 0,
  __v: 0,
  ...overrides,
});

// Test providers wrapper
interface AllTheProvidersProps {
  children: React.ReactNode;
  initialStoreState?: Partial<ReturnType<typeof useAppStore.getState>>;
  queryClient?: QueryClient;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({
  children,
  initialStoreState = {},
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  }),
}) => {
  // Set initial store state if provided
  React.useEffect(() => {
    if (Object.keys(initialStoreState).length > 0) {
      useAppStore.setState(initialStoreState);
    }
  }, [initialStoreState]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options: RenderOptions & {
    initialStoreState?: Partial<ReturnType<typeof useAppStore.getState>>;
    queryClient?: QueryClient;
  } = {},
) => {
  const { initialStoreState, queryClient, ...renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders
        initialStoreState={initialStoreState}
        queryClient={queryClient}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Mock API responses
export const mockApiResponse = <T,>(data: T, isError = false) => ({
  message: isError ? "Error occurred" : "Success",
  data,
  isError,
});

// Mock fetch responses
export const mockFetch = (response: any, status = 200) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => response,
    text: async () => JSON.stringify(response),
    headers: new Headers(),
  });
};

// Mock fetch error
export const mockFetchError = (error: string) => {
  global.fetch = vi.fn().mockRejectedValue(new Error(error));
};

// Socket.io mock helpers
export const createMockSocket = () => ({
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  connected: true,
  id: "mock-socket-id",
});

// File upload mock helpers
export const createMockFileList = (files: File[]): FileList => {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] || null,
    [Symbol.iterator]: function* () {
      for (let i = 0; i < files.length; i++) {
        yield files[i];
      }
    },
  };

  // Add files as indexed properties
  files.forEach((file, index) => {
    (fileList as any)[index] = file;
  });

  return fileList as FileList;
};

// Local storage mock helpers
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    length: Object.keys(store).length,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Async testing helpers
export const waitForNextTick = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const waitForTime = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Form testing helpers
export const fillForm = async (
  form: HTMLFormElement,
  data: Record<string, string>,
) => {
  const { fireEvent } = await import("@testing-library/dom");

  Object.entries(data).forEach(([name, value]) => {
    const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (input) {
      fireEvent.change(input, { target: { value } });
    }
  });
};

// Error boundary testing
export const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({
  shouldThrow = true,
}) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

// Performance testing helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  await waitForNextTick();
  const end = performance.now();
  return end - start;
};

// Accessibility testing helpers
export const getByRole = (
  container: HTMLElement,
  role: string,
  options?: any,
) => {
  const { getByRole: originalGetByRole } = require("@testing-library/react");
  return originalGetByRole(container, role, options);
};

export const checkAccessibility = async (container: HTMLElement) => {
  // This would integrate with axe-core for accessibility testing
  // For now, just check basic accessibility features
  const buttons = container.querySelectorAll("button");
  const inputs = container.querySelectorAll("input");
  const images = container.querySelectorAll("img");

  const issues: string[] = [];

  // Check buttons have accessible names
  buttons.forEach((button, index) => {
    if (!button.textContent && !button.getAttribute("aria-label")) {
      issues.push(`Button ${index} lacks accessible name`);
    }
  });

  // Check inputs have labels
  inputs.forEach((input, index) => {
    const id = input.getAttribute("id");
    const hasLabel = id && container.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = input.getAttribute("aria-label");

    if (!hasLabel && !hasAriaLabel) {
      issues.push(`Input ${index} lacks label`);
    }
  });

  // Check images have alt text
  images.forEach((img, index) => {
    if (!img.getAttribute("alt")) {
      issues.push(`Image ${index} lacks alt text`);
    }
  });

  return issues;
};

// Re-export everything from testing-library
export * from "@testing-library/react";
export { customRender as render };

// Export vi for convenience
export { vi } from "vitest";
