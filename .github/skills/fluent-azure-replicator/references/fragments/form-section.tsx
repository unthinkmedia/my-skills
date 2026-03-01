/**
 * Fragment: Form Section
 *
 * Grouped set of form fields under a titled section with optional help text.
 * Use in create wizards and settings pages.
 */
import React from 'react';
import {
  Subtitle2,
  Caption1,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { ReactNode } from 'react';

// --- Styles ---
const useStyles = makeStyles({
  section: {
    marginBottom: tokens.spacingVerticalXXL,
    maxWidth: '600px',
  },
  sectionTitle: {
    marginBottom: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  formRow: {
    marginBottom: tokens.spacingVerticalM,
  },
  helpText: {
    marginTop: tokens.spacingVerticalXXS,
    color: tokens.colorNeutralForeground3,
  },
});

// --- Types ---
interface FormField {
  label: string;
  required?: boolean;
  hint?: string;
  /** The input, dropdown, checkbox, etc. to render */
  children: ReactNode;
}

interface FormSectionProps {
  title: string;
  fields: FormField[];
}

// --- Component ---
export const FormSection: React.FC<FormSectionProps> = ({ title, fields }) => {
  const styles = useStyles();
  return (
    <div className={styles.section}>
      <Subtitle2 className={styles.sectionTitle}>{title}</Subtitle2>
      {fields.map((field) => (
        <div key={field.label} className={styles.formRow}>
          <Field label={field.label} required={field.required}>
            {field.children}
          </Field>
          {field.hint && (
            <Caption1 className={styles.helpText}>{field.hint}</Caption1>
          )}
        </div>
      ))}
    </div>
  );
};
