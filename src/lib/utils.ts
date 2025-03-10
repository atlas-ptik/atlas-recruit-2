// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a localized date
 * @param dateString ISO date string or date object
 * @param locale Locale for formatting (default: 'id-ID')
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  locale: string = "id-ID"
): string {
  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(dateString);
  }
}

/**
 * Formats a date with time
 * @param dateString ISO date string or date object
 * @param locale Locale for formatting (default: 'id-ID')
 * @returns Formatted date and time string
 */
export function formatDateTime(
  dateString: string | Date,
  locale: string = "id-ID"
): string {
  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date and time:", error);
    return String(dateString);
  }
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
