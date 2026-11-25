import { type ComponentRef, useCallback, useEffect, useRef, useState } from 'react';
import type { LayoutChangeEvent, ScrollView, TextInput } from 'react-native';

export type ScrollViewHandle = ComponentRef<typeof ScrollView>;
export type TextInputHandle = ComponentRef<typeof TextInput>;

export interface FocusOptions {
  /** Custom scroll handler (e.g. for KeyboardAwareScrollViewRef). */
  scrollTo?: (y: number) => void;
  /** Extra Y offset when fields sit inside a nested container inside the scroll view. */
  containerOffsetY?: number;
  /** Whether to focus the TextInput if registered (default true). */
  focus?: boolean;
}

/**
 * Coordinates inline field validation errors, smooth scroll-to-field,
 * TextInput auto-focus, and per-field shake animations so tapping Submit
 * on an invalid form always directs the user straight to the problem field.
 */
export function useFormFocus<K extends string>() {
  const scrollViewNodeRef = useRef<ScrollViewHandle | null>(null);
  const fieldPositionsRef = useRef<Partial<Record<K, number>>>({});
  const inputNodesRef = useRef<Partial<Record<K, TextInputHandle | null>>>({});
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [errors, setErrors] = useState<Partial<Record<K, string>>>({});
  const [shakeTarget, setShakeTarget] = useState<{ field: K; tick: number } | null>(null);

  useEffect(() => {
    return () => {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    };
  }, []);

  const registerScrollView = useCallback((node: ScrollViewHandle | null) => {
    scrollViewNodeRef.current = node;
  }, []);

  const scrollToTop = useCallback(() => {
    scrollViewNodeRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const registerLayout = useCallback(
    (field: K) => (event: LayoutChangeEvent) => {
      fieldPositionsRef.current[field] = event.nativeEvent.layout.y;
    },
    []
  );

  const registerInput = useCallback(
    (field: K) => (node: TextInputHandle | null) => {
      inputNodesRef.current[field] = node;
    },
    []
  );

  const clearError = useCallback((field: K) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setErrors({});
    setShakeTarget(null);
  }, []);

  const focusInput = useCallback((field: K) => {
    inputNodesRef.current[field]?.focus();
  }, []);

  const scrollAndFocus = useCallback((field: K, options?: FocusOptions) => {
    const rawY = fieldPositionsRef.current[field];
    const baseOffset = options?.containerOffsetY ?? 0;
    const targetY = rawY !== undefined ? Math.max(0, baseOffset + rawY - 24) : 0;

    if (options?.scrollTo) {
      options.scrollTo(targetY);
    } else if (scrollViewNodeRef.current) {
      scrollViewNodeRef.current.scrollTo({ y: targetY, animated: true });
    }

    setShakeTarget((prev) => ({ field, tick: (prev?.tick ?? 0) + 1 }));

    if (options?.focus !== false) {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      focusTimerRef.current = setTimeout(() => {
        inputNodesRef.current[field]?.focus();
      }, 200);
    }
  }, []);

  const showFieldError = useCallback(
    (field: K, message: string, options?: FocusOptions) => {
      setErrors({ [field]: message } as Partial<Record<K, string>>);
      scrollAndFocus(field, options);
    },
    [scrollAndFocus]
  );

  /**
   * Stores all validation errors and redirects (scroll + shake + focus) to the
   * first invalid field in `orderedFields`. Returns `true` if any error exists.
   */
  const reportErrors = useCallback(
    (
      nextErrors: Partial<Record<K, string>>,
      orderedFields: readonly K[],
      options?: FocusOptions
    ): boolean => {
      const firstInvalid = orderedFields.find((f) => Boolean(nextErrors[f]));
      if (!firstInvalid) {
        setErrors({});
        return false;
      }
      setErrors(nextErrors);
      scrollAndFocus(firstInvalid, options);
      return true;
    },
    [scrollAndFocus]
  );

  const getShakeKey = useCallback(
    (field: K) => (shakeTarget?.field === field ? shakeTarget.tick : 0),
    [shakeTarget]
  );

  return {
    errors,
    registerScrollView,
    scrollToTop,
    registerLayout,
    registerInput,
    clearError,
    clearAll,
    focusInput,
    showFieldError,
    reportErrors,
    getShakeKey,
  };
}
