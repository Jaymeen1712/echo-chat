// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;

// API Response types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  isError: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ValidationError extends ApiError {
  field: string;
  value?: any;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch?: number;
}

// Form types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormState<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FormField<T[K]>;
  };
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

// Event types
export type EventHandler<T = void> = (data: T) => void;
export type AsyncEventHandler<T = void> = (data: T) => Promise<void>;

// Component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface ClickableProps {
  onClick?: () => void;
  disabled?: boolean;
}

export interface LoadableProps {
  loading?: boolean;
  error?: string | null;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

// Utility types for better type safety
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Function types
export type Predicate<T> = (item: T) => boolean;
export type Comparator<T> = (a: T, b: T) => number;
export type Mapper<T, U> = (item: T, index: number) => U;

// Date and time types
export type DateString = string; // ISO date string
export type Timestamp = number; // Unix timestamp

// File types
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified?: number;
}

export interface UploadedFile extends FileInfo {
  url: string;
  id: string;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

// Socket event types
export interface SocketEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

// Performance monitoring types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  timestamp: number;
}

// Feature flag types
export type FeatureFlag = {
  [key: string]: boolean;
};

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Generic ID types
export type ID = string | number;
export type UUID = string;

// Status types
export type Status = 'active' | 'inactive' | 'pending' | 'archived';

// Permission types
export type Permission = string;
export type Role = {
  id: ID;
  name: string;
  permissions: Permission[];
};

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Generic CRUD operations
export interface CrudOperations<T, CreateData = Partial<T>, UpdateData = Partial<T>> {
  create: (data: CreateData) => Promise<T>;
  read: (id: ID) => Promise<T>;
  update: (id: ID, data: UpdateData) => Promise<T>;
  delete: (id: ID) => Promise<void>;
  list: (params?: SearchParams) => Promise<PaginatedResponse<T[]>>;
}

// Component state types
export interface ComponentState {
  mounted: boolean;
  visible: boolean;
  focused: boolean;
  disabled: boolean;
}

export default {};
