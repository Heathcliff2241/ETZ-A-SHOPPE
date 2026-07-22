import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useSafeRouter() {
  try {
    return useRouter();
  } catch {
    return {
      push: (path: string) => {
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', path);
        }
      },
      replace: (path: string) => {
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', path);
        }
      },
      back: () => {
        if (typeof window !== 'undefined') {
          window.history.back();
        }
      },
      forward: () => {
        if (typeof window !== 'undefined') {
          window.history.forward();
        }
      },
      refresh: () => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      },
      prefetch: () => {},
    };
  }
}

export function useSafeSearchParams() {
  try {
    return useSearchParams();
  } catch {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  }
}

export function useSafePathname() {
  try {
    return usePathname();
  } catch {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  }
}
