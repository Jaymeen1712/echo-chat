import { render, ThrowError } from "@/test/utils";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from "../ErrorBoundary";

describe("ErrorBoundary", () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders error UI when there is an error", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Reload Page")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("calls onError callback when error occurs", () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
  });

  it("shows error details in development mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Error Details:")).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it("hides error details in production mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.queryByText("Error Details:")).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it("allows retry after error", async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    const retryButton = screen.getByText("Try Again");
    await user.click(retryButton);

    // After retry, the error boundary should reset and try to render children again
    // Since ThrowError always throws, it should show the error again
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("reloads page when reload button is clicked", async () => {
    const originalReload = window.location.reload;
    window.location.reload = vi.fn();

    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    const reloadButton = screen.getByText("Reload Page");
    await user.click(reloadButton);

    expect(window.location.reload).toHaveBeenCalled();

    window.location.reload = originalReload;
  });

  it("recovers from error when children change", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <div>Recovered content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Recovered content")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });
});
