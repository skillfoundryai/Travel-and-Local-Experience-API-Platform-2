export interface DiscoveryLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface DiscoveryRecord {
  id: string;
  requestKey: string;
  name: string;
  description: string;
  category: "place" | "activity";
  location: DiscoveryLocation;
}

export type DiscoveryLookupResult =
  | {
      kind: "found";
      record: DiscoveryRecord;
    }
  | {
      kind: "unavailable";
    };
