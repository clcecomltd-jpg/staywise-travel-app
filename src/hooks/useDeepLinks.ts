import { useCallback } from 'react';

export type DeepLinkKey = "EXPLORE" | "FAVES" | "MESSAGES" | "DAY_TRIPS" | "ESIM" | "RESTAURANTS";

interface DeepLinkMap {
  [key: string]: {
    basePath: string;
    queryParams?: Record<string, string>;
  };
}

// Deep link mapping configuration
const DEEP_LINK_MAP: DeepLinkMap = {
  EXPLORE: {
    basePath: "/explore",
    queryParams: { tab: "activities" }
  },
  FAVES: {
    basePath: "/favorites",
    queryParams: { tab: "saved" }
  },
  MESSAGES: {
    basePath: "/chat",
    queryParams: {}
  },
  DAY_TRIPS: {
    basePath: "/explore",
    queryParams: { tab: "daytrips" }
  },
  ESIM: {
    basePath: "/essentials",
    queryParams: { section: "esim" }
  },
  RESTAURANTS: {
    basePath: "/explore",
    queryParams: { tab: "restaurants" }
  }
};

export const useDeepLinks = () => {
  const hrefFor = useCallback((key: DeepLinkKey): string => {
    const config = DEEP_LINK_MAP[key];
    if (!config) {
      console.warn(`No deep link configuration found for key: ${key}`);
      return "#";
    }

    const { basePath, queryParams } = config;
    const queryString = Object.entries(queryParams || {})
      .map(([param, value]) => `${param}=${encodeURIComponent(value)}`)
      .join("&");

    return queryString ? `${basePath}?${queryString}` : basePath;
  }, []);

  const navigate = useCallback((key: DeepLinkKey, extra?: Record<string, string>) => {
    const config = DEEP_LINK_MAP[key];
    if (!config) {
      console.warn(`No deep link configuration found for key: ${key}`);
      return;
    }

    const { basePath, queryParams } = config;
    const allParams = { ...queryParams, ...extra };
    
    const queryString = Object.entries(allParams)
      .map(([param, value]) => `${param}=${encodeURIComponent(value)}`)
      .join("&");

    const finalPath = queryString ? `${basePath}?${queryString}` : basePath;
    
    // In a real app, you'd use React Router or Next.js router here
    // For now, we'll just log the navigation
    console.log(`Navigate to: ${finalPath}`);
    
    // You can replace this with actual navigation logic
    // window.location.href = finalPath;
  }, []);

  return {
    hrefFor,
    navigate
  };
};

export default useDeepLinks;
