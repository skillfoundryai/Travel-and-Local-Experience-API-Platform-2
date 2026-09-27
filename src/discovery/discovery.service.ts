import type {
  DiscoveryActivity,
  DiscoveryPlace,
  DiscoveryResponse,
} from "./discovery.types";

interface DestinationData {
  places: DiscoveryPlace[];
  activities: DiscoveryActivity[];
}

const DISCOVERY_DATA: Readonly<Record<string, DestinationData>> = {
  muscat: {
    places: [
      {
        id: "place-muttrah-corniche",
        name: "Muttrah Corniche",
        description: "A waterfront destination in Muscat.",
        category: "place",
        location: {
          city: "Muscat",
          country: "Oman",
          latitude: 23.6198,
          longitude: 58.5641,
        },
      },
    ],
    activities: [
      {
        id: "activity-muttrah-walk",
        name: "Muttrah Corniche Walk",
        description: "A walking activity along the Muttrah waterfront.",
        category: "activity",
        location: {
          city: "Muscat",
          country: "Oman",
          latitude: 23.6198,
          longitude: 58.5641,
        },
      },
    ],
  },
};

export interface DiscoverySearch {
  destination: string;
  category?: "place" | "activity";
  limit: number;
}

export function discover(search: DiscoverySearch): DiscoveryResponse | undefined {
  const normalizedDestination = search.destination.trim();
  const destinationData = DISCOVERY_DATA[normalizedDestination.toLowerCase()];

  if (!destinationData) {
    return undefined;
  }

  const places = search.category === "activity" ? [] : destinationData.places;
  const activities = search.category === "place" ? [] : destinationData.activities;
  const limitedResults = [...places, ...activities].slice(0, search.limit);

  return {
    destination: normalizedDestination,
    places: limitedResults.filter(
      (result): result is DiscoveryPlace => result.category === "place",
    ),
    activities: limitedResults.filter(
      (result): result is DiscoveryActivity => result.category === "activity",
    ),
  };
}
