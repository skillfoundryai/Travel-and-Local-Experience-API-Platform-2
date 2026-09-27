export interface DiscoveryLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: "place";
  location: DiscoveryLocation;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: "activity";
  location: DiscoveryLocation;
}
