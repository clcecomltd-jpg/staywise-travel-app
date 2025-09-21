import { DeepLinkKey } from '../hooks/useDeepLinks';

export interface GridLinkConfig {
  key: DeepLinkKey;
  path: string;
  queryParams?: Record<string, string>;
  label: string;
  description: string;
  icon: string;
}

export const GRID_LINKS: GridLinkConfig[] = [
  {
    key: "EXPLORE",
    path: "/explore",
    queryParams: { tab: "activities" },
    label: "Explore",
    description: "Discover local activities",
    icon: "compass"
  },
  {
    key: "FAVES",
    path: "/favorites",
    queryParams: { tab: "saved" },
    label: "Favourites",
    description: "Your saved places",
    icon: "heart"
  },
  {
    key: "MESSAGES",
    path: "/chat",
    queryParams: {},
    label: "Messages",
    description: "Chat with host",
    icon: "message-circle"
  },
  {
    key: "DAY_TRIPS",
    path: "/explore",
    queryParams: { tab: "daytrips" },
    label: "Day Trips",
    description: "Plan excursions",
    icon: "map-pin"
  },
  {
    key: "ESIM",
    path: "/essentials",
    queryParams: { section: "esim" },
    label: "eSIM",
    description: "Get connected",
    icon: "wifi"
  },
  {
    key: "RESTAURANTS",
    path: "/explore",
    queryParams: { tab: "restaurants" },
    label: "Restaurants",
    description: "Find great food",
    icon: "utensils"
  }
];

export const getGridLinkByKey = (key: DeepLinkKey): GridLinkConfig | undefined => {
  return GRID_LINKS.find(link => link.key === key);
};

export const getAllGridLinks = (): GridLinkConfig[] => {
  return GRID_LINKS;
};
