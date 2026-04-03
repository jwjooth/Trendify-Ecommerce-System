import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "../components/ContactForm";
import { toast } from "sonner";

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty form submission", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters long."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please enter a valid email address."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Subject must be at least 5 characters long."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Message must be at least 10 characters long."),
      ).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Please correct the errors in the form.",
    );
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const nameInput = screen.getByLabelText(/full name/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "invalid-email");
    await user.type(subjectInput, "Test Subject");
    await user.type(
      messageInput,
      "This is a test message with enough content.",
    );

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address."),
      ).toBeInTheDocument();
    });
  });

  it("submits form successfully with valid data", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john.doe@example.com");
    await user.type(subjectInput, "Test Subject");
    await user.type(
      messageInput,
      "This is a test message with enough content to pass validation.",
    );

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Check loading state
    expect(screen.getByText("Sending...")).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Message sent! We'll get back to you within 24 hours.",
      );
    });

    // Form should be cleared
    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(subjectInput).toHaveValue("");
    expect(messageInput).toHaveValue("");
  });

  it("disables form during submission", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john.doe@example.com");
    await user.type(subjectInput, "Test Subject");
    await user.type(
      messageInput,
      "This is a test message with enough content to pass validation.",
    );

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Form should be disabled during submission
    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(subjectInput).toBeDisabled();
    expect(messageInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
