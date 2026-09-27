# Discovery API Contract

## Purpose

The Discovery API returns place and activity information for a requested destination.

This contract is intentionally limited to discovery behavior only.

It does **not** define or implement:

- itinerary generation or itinerary management
- booking or reservations
- authentication or authorization behavior
- offline synchronization
- offline caching
- real external-provider behavior
- provider credentials
- payment processing

Any authentication or authorization already present elsewhere in the application must remain unchanged and must not be weakened by this contract.

---

# Endpoint

## Method

`GET`

## Path

`/discovery`

## Inputs

The endpoint accepts the following query parameters.

| Name | Type | Required | Rules | Example |
|---|---|---:|---|---|
| `destination` | `string` | Yes | Trimmed, 1-100 characters | `Muscat` |
| `category` | `string` | No | Must be `place` or `activity` when provided | `activity` |
| `limit` | `number` | No | Integer from 1 to 50; default is 20 | `10` |

Example request:

```http
GET /discovery?destination=Muscat&category=activity&limit=10
```

All request input must be treated as untrusted and validated before use.

---

# Success outcome

## Success status

`200 OK`

## Success response shape

The success response is a JSON object with the following fields.

| Field | Type | Required | Description |
|---|---|---:|---|
| `destination` | `string` | Yes | Normalized destination used for the discovery request |
| `places` | `Place[]` | Yes | Discovered places. May be an empty array |
| `activities` | `Activity[]` | Yes | Discovered activities. May be an empty array |

### `Location` schema

| Field | Type | Required | Description |
|---|---|---:|---|
| `city` | `string` | Yes | City name |
| `country` | `string` | Yes | Country name |
| `latitude` | `number` | Yes | Latitude in decimal degrees |
| `longitude` | `number` | Yes | Longitude in decimal degrees |

### `Place` schema

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | `string` | Yes | Stable identifier for the place |
| `name` | `string` | Yes | Display name |
| `description` | `string` | Yes | Short description |
| `category` | `"place"` | Yes | Identifies the object as a place |
| `location` | `Location` | Yes | Geographic information |

### `Activity` schema

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | `string` | Yes | Stable identifier for the activity |
| `name` | `string` | Yes | Display name |
| `description` | `string` | Yes | Short description |
| `category` | `"activity"` | Yes | Identifies the object as an activity |
| `location` | `Location` | Yes | Geographic information |

`Place` and `Activity` intentionally use the same shared field names and compatible data types for equivalent information: `id`, `name`, `description`, `category`, and `location`.

---

# Error statuses

## 400 Bad Request

Returned when one or more query parameters are missing or invalid.

### Error body

| Field | Type | Required | Description |
|---|---|---:|---|
| `error.code` | `string` | Yes | Machine-readable error code. Value: `INVALID_INPUT` |
| `error.message` | `string` | Yes | Human-readable summary |
| `error.details` | `ValidationError[]` | Yes | Validation problems found in the request |

### `ValidationError` schema

| Field | Type | Required | Description |
|---|---|---:|---|
| `field` | `string` | Yes | Invalid input field |
| `message` | `string` | Yes | Reason the value is invalid |

## 404 Not Found

Returned when discovery information is unavailable for the requested destination.

### Error body

| Field | Type | Required | Description |
|---|---|---:|---|
| `error.code` | `string` | Yes | Machine-readable error code. Value: `DISCOVERY_NOT_AVAILABLE` |
| `error.message` | `string` | Yes | Human-readable explanation |

## 500 Internal Server Error

Returned when an unexpected internal failure prevents the request from being completed.

### Error body

| Field | Type | Required | Description |
|---|---|---:|---|
| `error.code` | `string` | Yes | Machine-readable error code. Value: `INTERNAL_ERROR` |
| `error.message` | `string` | Yes | Safe client-facing explanation |

Internal stack traces, secrets, provider credentials, infrastructure details, and protected data must not be returned in error responses.

---

# Example 1: Successful request

## Request

```http
GET /discovery?destination=Muscat&limit=5
```

## Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "destination": "Muscat",
  "places": [
    {
      "id": "place-muttrah-corniche",
      "name": "Muttrah Corniche",
      "description": "A waterfront destination in Muscat.",
      "category": "place",
      "location": {
        "city": "Muscat",
        "country": "Oman",
        "latitude": 23.6198,
        "longitude": 58.5641
      }
    }
  ],
  "activities": [
    {
      "id": "activity-muttrah-walk",
      "name": "Muttrah Corniche Walk",
      "description": "A walking activity along the Muttrah waterfront.",
      "category": "activity",
      "location": {
        "city": "Muscat",
        "country": "Oman",
        "latitude": 23.6198,
        "longitude": 58.5641
      }
    }
  ]
}
```

---

# Example 2: Invalid input

## Request

```http
GET /discovery?destination=&limit=100
```

## Response

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
```

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "The discovery request contains invalid input.",
    "details": [
      {
        "field": "destination",
        "message": "Destination is required."
      },
      {
        "field": "limit",
        "message": "Limit must be between 1 and 50."
      }
    ]
  }
}
```

---

# Example 3: Unavailable resource

## Request

```http
GET /discovery?destination=UnknownDestination
```

## Response

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "error": {
    "code": "DISCOVERY_NOT_AVAILABLE",
    "message": "Discovery information is not available for the requested destination."
  }
}
```

---

# Validation rules

## `destination`

- required
- type: `string`
- trim leading and trailing whitespace before validation
- must contain at least 1 character after trimming
- maximum length: 100 characters

## `category`

- optional
- type: `string`
- allowed values: `place`, `activity`

## `limit`

- optional
- type: `number`
- must be an integer
- minimum: 1
- maximum: 50
- default: 20

---

# Scope boundary

This contract defines discovery only.

The following are explicitly out of scope:

- itinerary creation
- itinerary updates
- booking
- reservations
- authentication implementation
- authorization implementation
- offline synchronization
- offline data storage behavior
- real external-provider behavior
- live provider guarantees
- provider API credentials

No secret values, credentials, protected user data, or internal infrastructure details are introduced by this contract.

---

# Practical verification

A reviewer or client developer can verify the contract with these checks:

1. Confirm the document explicitly defines `GET /discovery`.
2. Confirm `destination`, `category`, and `limit` are documented with types and validation rules.
3. Confirm the success outcome is explicitly `200 OK`.
4. Confirm every field in the success examples appears in the response schema with the same name and data type.
5. Confirm `Place` and `Activity` consistently use `id`, `name`, `description`, `category`, and `location`.
6. Confirm invalid input is documented as `400 Bad Request` with `INVALID_INPUT`.
7. Confirm unavailable discovery data is documented as `404 Not Found` with `DISCOVERY_NOT_AVAILABLE`.
8. Confirm the document includes one full success example, one invalid-input example, and one unavailable-resource example.
9. Confirm itinerary, booking, authentication, offline synchronization, and real-provider behavior are explicitly excluded.
