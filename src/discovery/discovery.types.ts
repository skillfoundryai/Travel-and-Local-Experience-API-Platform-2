export type DiscoveryCategory = "place" | "activity";

export interface DiscoveryLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface DiscoveryPlace {
  id: string;
  name: string;
  description: string;
  category: "place";
  location: DiscoveryLocation;
}

export interface DiscoveryActivity {
  id: string;
  name: string;
  description: string;
  category: "activity";
  location: DiscoveryLocation;
}

export interface DiscoveryResponse {
  destination: string;
  places: DiscoveryPlace[];
  activities: DiscoveryActivity[];
}

export interface DiscoveryValidationError {
  field: string;
  message: string;
}

export type DiscoveryErrorCode =
  | "INVALID_INPUT"
  | "DISCOVERY_NOT_AVAILABLE"
  | "INTERNAL_ERROR";

export interface DiscoveryErrorResponse {
  error: {
    code: DiscoveryErrorCode;
    message: string;
    details?: DiscoveryValidationError[];
  };
}
