import { useEffect } from "react";
import { useNavigate as useRouterNavigate, useLocation } from "react-router";
import { logger } from "../config";

/**
 * Enhanced useNavigation hook that properly handles route changes
 * Fixes the issue where URL changes but pages don't update until refresh
 */
export const useNavigation = () => {
  const navigate = useRouterNavigate();
  const location = useLocation();

  // Log location changes for debugging
  useEffect(() => {
    logger.debug("Route changed", {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    });
  }, [location]);

  const navigateTo = (
    path: string,
    options?: { replace?: boolean; state?: unknown },
  ) => {
    logger.debug("Navigating to", { path });
    navigate(path, {
      replace: options?.replace || false,
      state: options?.state,
    });
  };

  return {
    navigate: navigateTo,
    currentPath: location.pathname,
    location,
  };
};

/**
 * Hook to scroll to top when route changes
 */
export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
};

/**
 * Hook to prevent navigation when there are unsaved changes
 */
export const useUnsavedChanges = (hasUnsavedChanges: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
};
