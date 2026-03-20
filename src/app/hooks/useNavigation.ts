import { useEffect, useCallback } from "react";
import { useNavigate as useRouterNavigate, useLocation } from "react-router";
import { logger } from "../config";

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

export const useNavigation = () => {
  const navigate = useRouterNavigate();
  const location = useLocation();
  useEffect(() => {
    logger.debug("Route changed", {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    });
  }, [location.pathname, location.search, location.hash]);

  const navigateTo = useCallback(
    (path: string, options?: NavigateOptions) => {
      logger.debug("Navigating to", { path, ...options });

      navigate(path, {
        replace: options?.replace ?? false,
        state: options?.state,
      });
    },
    [navigate],
  );

  return {
    navigate: navigateTo,
    currentPath: location.pathname,
    location,
  };
};

export const useScrollToTop = (behavior: ScrollBehavior = "auto") => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior });
  }, [pathname, behavior]);
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
