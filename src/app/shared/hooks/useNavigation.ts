import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { logger } from "../../lib";

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

export const useNavigation = () => {
  const router = useRouter();

  useEffect(() => {
    logger.debug("Route changed", {
      pathname: router.pathname,
      query: router.query,
      asPath: router.asPath,
    });
  }, [router.pathname, router.asPath]);

  const navigateTo = useCallback(
    (path: string, options?: NavigateOptions) => {
      logger.debug("Navigating to", { path, ...options });

      if (options?.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    },
    [router],
  );

  return {
    navigate: navigateTo,
    currentPath: router.pathname,
    router,
  };
};

export const useScrollToTop = (behavior: ScrollBehavior = "auto") => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior });
  }, [router.asPath, behavior]);
};

export const useUnsavedChanges = (hasUnsavedChanges: boolean) => {
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
};
