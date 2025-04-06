import { useState } from 'react';

interface FormErrors {
  [key: string]: string;
}

type FormValues = Record<string, unknown>;

interface UseFormReturn<T extends FormValues> {
  values: T;
  errors: FormErrors;
  touched: Record<keyof T, boolean>;
  handleChange: <K extends keyof T>(name: K, value: T[K]) => void;
  handleBlur: (name: keyof T) => void;
  setFieldValue: <K extends keyof T>(name: K, value: T[K]) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldTouched: (name: keyof T, isTouched: boolean) => void;
  resetForm: (newValues?: Partial<T>) => void;
  clearErrors: () => void;
  validateField: (name: keyof T) => boolean;
  validateForm: () => boolean;
  setValues: (values: Partial<T>) => void;
}

type Validator<T extends FormValues> = (values: T) => FormErrors;

/**
 * Custom hook for form state management with strong typing
 */
function useForm<T extends FormValues>(
  initialValues: T,
  validate?: Validator<T>
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(() => {
    const touchedFields = {} as Record<keyof T, boolean>;
    Object.keys(initialValues).forEach(key => {
      touchedFields[key as keyof T] = false;
    });
    return touchedFields;
  });

  const handleChange = <K extends keyof T>(name: K, value: T[K]): void => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If there's a validation function, validate this field
    if (validate) {
      const fieldError = validate({
        ...values,
        [name]: value
      })[name as string];
      
      if (fieldError) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldError
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (name: keyof T): void => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate on blur
    validateField(name);
  };

  const setFieldValue = <K extends keyof T>(name: K, value: T[K]): void => {
    handleChange(name, value);
  };

  const setFieldError = (name: keyof T, error: string): void => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const setFieldTouched = (name: keyof T, isTouched: boolean): void => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  };

  const resetForm = (newValues?: Partial<T>): void => {
    setValues({
      ...initialValues,
      ...newValues
    });
    setErrors({});
    
    const resetTouched = {} as Record<keyof T, boolean>;
    Object.keys(initialValues).forEach(key => {
      resetTouched[key as keyof T] = false;
    });
    setTouched(resetTouched);
  };

  const clearErrors = (): void => {
    setErrors({});
  };

  const validateField = (name: keyof T): boolean => {
    if (validate) {
      const fieldError = validate(values)[name as string];
      if (fieldError) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldError
        }));
        return false;
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
    }
    return true;
  };

  const validateForm = (): boolean => {
    if (validate) {
      const formErrors = validate(values);
      setErrors(formErrors);
      return Object.keys(formErrors).length === 0;
    }
    return true;
  };

  const setFormValues = (newValues: Partial<T>): void => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    clearErrors,
    validateField,
    validateForm,
    setValues: setFormValues
  };
}

export default useForm;