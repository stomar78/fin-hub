'use client';

import {
  useMemo,
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from 'react';
import type { ReactNode } from 'react';

import type {
  ToolDefinition,
  ToolField,
  ToolFormSection,
} from '@/lib/tool-registry';
import {
  DEFAULT_SUCCESS_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  DEFAULT_DATA_PRIVACY_NOTE,
} from '@/lib/tool-registry';

type FormValues = Record<string, string>;

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

type ToolPageProps = {
  tool: ToolDefinition;
};

const baseInputClasses =
  'w-full rounded-button border border-slate-200 bg-white px-3 py-2 text-xs text-[var(--epi-navy)] outline-none transition-shadow focus-visible:shadow-[0_0_0_3px_rgba(10,37,64,0.22)] disabled:cursor-not-allowed disabled:opacity-75';

const baseLabelClasses = 'block text-[11px] font-medium text-[var(--epi-navy)]';

const baseHelperClasses = 'text-[10px] text-[color-mix(in_srgb,var(--epi-slate)_80%,white_20%)]';

function buildInitialValues(tool: ToolDefinition): FormValues {
  const values: FormValues = {};

  for (const section of tool.sections) {
    for (const field of section.fields) {
      if (values[field.name] !== undefined) continue;
      values[field.name] = field.defaultValue ?? '';
    }
  }

  return values;
}

function sectionGridClass(section: ToolFormSection) {
  switch (section.layout) {
    case 'three-column':
      return 'grid gap-4 md:grid-cols-3';
    case 'two-column':
      return 'grid gap-4 md:grid-cols-2';
    default:
      return 'grid gap-4';
  }
}

function fieldColSpan(field: ToolField, section: ToolFormSection) {
  if (!field.colSpan) return '';
  if (section.layout === 'single') return '';

  const maxCols = section.layout === 'three-column' ? 3 : 2;
  const span = Math.min(field.colSpan, maxCols);
  return `md:col-span-${span}`;
}

export default function ToolPage({ tool }: ToolPageProps) {
  const initialValues = useMemo(() => buildInitialValues(tool), [tool]);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const steps = useMemo(
    () =>
      tool.sections.flatMap((section, sectionIndex) =>
        section.fields.map((field, fieldIndex) => ({
          field,
          section,
          sectionIndex,
          fieldIndex,
        }))
      ),
    [tool]
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setFormValues(initialValues);
    setStatus('idle');
    setErrorMessage(null);
    setCurrentStep(0);
    setValidationError(null);
  }, [initialValues]);

  const successCopy = tool.successMessage ?? DEFAULT_SUCCESS_MESSAGE;
  const failureCopy = tool.errorMessage ?? DEFAULT_ERROR_MESSAGE;
  const privacyCopy = tool.dataPrivacyNote ?? DEFAULT_DATA_PRIVACY_NOTE;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === 'submitting') return;

    const currentField = steps[currentStep]?.field;
    if (currentField?.required) {
      const value = formValues[currentField.name];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        setValidationError('Please complete this field to continue.');
        return;
      }
    }

    setStatus('submitting');
    setErrorMessage(null);
    setValidationError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug: tool.slug,
          ...formValues,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const apiMessage = body?.error || body?.message;
        throw new Error(apiMessage || 'Failed to submit lead');
      }

      setStatus('success');
      setFormValues(initialValues);
      setCurrentStep(0);
    } catch (error) {
      console.error(`[tool-submit-${tool.slug}]`, error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'We were unable to submit your details.'
      );
    }
  };

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (!currentStepData) return;

    const { field } = currentStepData;
    const value = formValues[field.name];

    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      setValidationError('Please complete this field to continue.');
      return;
    }

    setValidationError(null);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderField = (field: ToolField, section: ToolFormSection) => {
    const value = formValues[field.name] ?? '';
    const wrapperClasses = ['space-y-1.5', fieldColSpan(field, section)].filter(Boolean).join(' ');

    const commonProps = {
      id: field.name,
      name: field.name,
      value,
      onChange: handleChange,
      placeholder: field.placeholder,
      required: field.required,
      autoComplete: field.autoComplete,
      inputMode: field.inputMode,
      min: field.min,
      max: field.max,
      step: field.step,
      pattern: field.pattern,
      disabled: status === 'submitting',
    } as const;

    const label = (
      <label className={baseLabelClasses} htmlFor={field.name}>
        {field.label}
        {field.required ? <span className="ml-0.5 text-[var(--epi-blue)]">*</span> : null}
      </label>
    );

    let control: ReactNode;

    switch (field.type) {
      case 'textarea':
        control = (
          <textarea
            {...commonProps}
            rows={field.rows ?? 3}
            className={baseInputClasses}
          />
        );
        break;
      case 'select':
        control = (
          <select
            {...commonProps}
            className={`${baseInputClasses} bg-white`}
          >
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
      case 'email':
      case 'number':
      case 'tel':
      case 'text':
        control = (
          <input
            {...commonProps}
            type={field.type}
            className={baseInputClasses}
          />
        );
        break;
      case 'currency':
        control = (
          <input
            {...commonProps}
            type="text"
            className={baseInputClasses}
            inputMode={field.inputMode ?? 'decimal'}
          />
        );
        break;
      default:
        control = (
          <input
            {...commonProps}
            type="text"
            className={baseInputClasses}
          />
        );
        break;
    }

    return (
      <div key={field.name} className={wrapperClasses}>
        {label}
        {control}
        {field.helperText ? <p className={baseHelperClasses}>{field.helperText}</p> : null}
      </div>
    );
  };

  if (totalSteps === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="page-shell py-12 flex-1">
        <div className="section-bg section-bg--form space-y-6">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--epi-slate)]">
              Free Tool • {tool.badge}
            </p>
            <h1 className="card-title font-display text-2xl text-[var(--epi-navy)]">
              {tool.heroTitle}
              {tool.heroHighlight ? (
                <span className="gradient-text"> {tool.heroHighlight}</span>
              ) : null}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--epi-slate)]">{tool.heroDescription}</p>
            {tool.highlights.length > 0 ? (
              <ul className="text-[11px] sm:text-sm text-[var(--epi-slate)] list-disc list-inside space-y-1">
                {tool.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            <div className="flex flex-wrap gap-4 text-[11px] text-[var(--epi-slate)]">
              <span className="chip">⏱ {tool.timeToComplete}</span>
              <span className="chip">Outcome: {tool.outcome}</span>
            </div>
          </div>

          {status === 'success' ? (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-50 px-3 py-2 text-[11px] text-[var(--epi-green)]">
              {successCopy}
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="rounded-md border border-[var(--epi-red)]/40 bg-red-50 px-3 py-2 text-[11px] text-[var(--epi-red)]">
              {errorMessage || failureCopy}
            </div>
          ) : null}

          <div className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-[0_18px_38px_rgba(8,26,46,0.08)] backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--epi-slate)]">
                  <span>Guided assessment</span>
                  <span>
                    Step {currentStep + 1} of {totalSteps}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-[rgba(10,37,64,0.08)]">
                  <div
                    className="h-full rounded-full bg-[var(--epi-blue)] transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {currentStepData.section.title ? (
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-[var(--epi-navy)]">
                    {currentStepData.section.title}
                  </h2>
                  {currentStepData.section.description ? (
                    <p className="text-[11px] text-[var(--epi-slate)]">
                      {currentStepData.section.description}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-4">
                {renderField(currentStepData.field, currentStepData.section)}
                {validationError ? (
                  <p className="text-[10px] text-[var(--epi-red)]">{validationError}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 text-[11px] text-[var(--epi-slate)]">
                <p>
                  We only ask for information lenders screen first. Use the back button if you need to
                  adjust a prior answer.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 0 || status === 'submitting'}
                    className="rounded-button border border-slate-200 px-4 py-2 text-xs font-medium text-[var(--epi-slate)] transition hover:border-[var(--epi-blue)] hover:text-[var(--epi-blue)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Back
                  </button>
                  {currentStep < totalSteps - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={status === 'submitting'}
                      className="btn-primary rounded-button px-4 py-2 text-xs font-medium"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="btn-primary rounded-button px-4 py-2 text-xs font-medium"
                    >
                      {status === 'submitting' ? 'Submitting…' : tool.ctaLabel}
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-[var(--epi-slate)] max-w-xs sm:text-right">{privacyCopy}</p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
