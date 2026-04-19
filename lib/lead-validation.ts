import { z } from 'zod';

import { TOOL_SLUGS } from './tool-registry';

type ToolSlug = (typeof TOOL_SLUGS)[number];

const toolSlugSchema = z.enum(TOOL_SLUGS as [ToolSlug, ...ToolSlug[]]);

const leadSubmissionSchema = z
  .object({
    toolSlug: toolSlugSchema,
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required')
      .max(160, 'Full name is too long'),
    companyName: z
      .string()
      .trim()
      .min(1, 'Company name is required')
      .max(180, 'Company name is too long'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Please provide a valid work email')
      .max(200, 'Email is too long'),
  })
  .passthrough();

export type LeadSubmission = z.infer<typeof leadSubmissionSchema> &
  Record<string, unknown>;

export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult =
  | { success: true; data: LeadSubmission }
  | { success: false; errors: ValidationError[] };

export { TOOL_SLUGS };

export function validateLeadSubmission(input: unknown): ValidationResult {
  const parsed = leadSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'root',
        message: issue.message,
      })),
    };
  }

  const sanitized = sanitizeSubmission(parsed.data);

  return {
    success: true,
    data: sanitized,
  };
}

function sanitizeSubmission(data: LeadSubmission): LeadSubmission {
  const sanitizedEntries = Object.entries(data).map(([key, value]) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return [key, trimmed];
    }
    return [key, value];
  });

  return Object.fromEntries(sanitizedEntries) as LeadSubmission;
}
