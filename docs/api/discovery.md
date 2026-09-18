# Discovery API Contract

## Overview

The Discovery API returns nearby places based on a traveler's current location.

A typical use case is a traveler in Lisbon who wants to find nearby landmarks, attractions, or other places before starting a walking tour.

This contract defines the request format, response structure, validation rules, status codes, and edge-case behavior so that mobile, frontend, backend, and test engineers can implement the feature consistently.

---

## Get Nearby Places

### Method and Path

```http
GET /api/v1/discovery/places
```

### Purpose

Returns nearby places relative to a supplied latitude and longitude.

Results are ordered from nearest to farthest.

---

## Example Request

```http
GET /api/v1/discovery/places?lat=38.7223&lng=-9.1393&radius=1500&limit=10
```

This example represents a traveler in Lisbon searching for places within 1,500 metres.

---

## Query Parameters

| Parameter | Required | Type    | Default | Rules                                           |
| --------- | -------- | ------- | ------- | ----------------------------------------------- |
| `lat`     | Yes      | Number  | None    | Must be between `-90` and `90`                  |
| `lng`     | Yes      | Number  | None    | Must be between `-180` and `180`                |
| `radius`  | No       | Integer | `1000`  | Distance in metres. Minimum `1`, maximum `5000` |
| `limit`   | No       | Integer | `10`    | Minimum `1`, maximum `50`                       |

---

## Successful Response

### Status

```http
200 OK
```

### Example

```json
{
  "data": [
    {
      "id": "place_001",
      "name": "Praça do Comércio",
      "category": "landmark",
      "description": "Historic waterfront square in central Lisbon.",
      "location": {
        "latitude": 38.7078,
        "longitude": -9.1366
      },
      "distanceMeters": 420,
      "walkingMinutes": 6
    },
    {
      "id": "place_002",
      "name": "Santa Justa Lift",
      "category": "attraction",
      "description": "Historic lift connecting Lisbon's lower and upper streets.",
      "location": {
        "latitude": 38.7121,
        "longitude": -9.1394
      },
      "distanceMeters": 680,
      "walkingMinutes": 9
    }
  ],
  "meta": {
    "count": 2,
    "radiusMeters": 1500,
    "center": {
      "latitude": 38.7223,
      "longitude": -9.1393
    }
  }
}
```

---

## Place Object

Each object inside `data` represents one nearby place.

| Field                | Type    | Required | Description                                                          |
| -------------------- | ------- | -------- | -------------------------------------------------------------------- |
| `id`                 | String  | Yes      | Unique identifier for the place                                      |
| `name`               | String  | Yes      | Display name                                                         |
| `category`           | String  | Yes      | Place category such as `landmark`, `attraction`, `museum`, or `park` |
| `description`        | String  | No       | Short human-readable description                                     |
| `location.latitude`  | Number  | Yes      | Latitude of the place                                                |
| `location.longitude` | Number  | Yes      | Longitude of the place                                               |
| `distanceMeters`     | Integer | Yes      | Distance from the requested location in metres                       |
| `walkingMinutes`     | Integer | No       | Estimated walking time in minutes                                    |

---

## Response Metadata

The `meta` object describes the search that produced the response.

| Field              | Type    | Description                   |
| ------------------ | ------- | ----------------------------- |
| `count`            | Integer | Number of places returned     |
| `radiusMeters`     | Integer | Radius applied to the search  |
| `center.latitude`  | Number  | Latitude used for the search  |
| `center.longitude` | Number  | Longitude used for the search |

---

## No Results

A valid request that finds no nearby places must still return:

```http
200 OK
```

The `data` array must be empty.

### Example

```json
{
  "data": [],
  "meta": {
    "count": 0,
    "radiusMeters": 1500,
    "center": {
      "latitude": 38.7223,
      "longitude": -9.1393
    }
  }
}
```

The client may display a message such as:

> No nearby places found. Try increasing your search area.

A zero-result response must not return `404 Not Found`.

---

## Invalid Latitude

### Example Request

```http
GET /api/v1/discovery/places?lat=200&lng=-9.1393
```

### Status

```http
400 Bad Request
```

### Response

```json
{
  "error": {
    "code": "INVALID_LOCATION",
    "message": "Latitude must be between -90 and 90.",
    "field": "lat"
  }
}
```

---

## Invalid Longitude

### Example

```json
{
  "error": {
    "code": "INVALID_LOCATION",
    "message": "Longitude must be between -180 and 180.",
    "field": "lng"
  }
}
```

---

## Missing Location

If either `lat` or `lng` is missing, the API returns:

```http
400 Bad Request
```

### Example

```json
{
  "error": {
    "code": "MISSING_LOCATION",
    "message": "Both lat and lng are required."
  }
}
```

---

## Invalid Radius

If `radius` is less than `1` or greater than `5000`:

```http
400 Bad Request
```

### Example

```json
{
  "error": {
    "code": "INVALID_RADIUS",
    "message": "Radius must be between 1 and 5000 metres.",
    "field": "radius"
  }
}
```

---

## Invalid Limit

If `limit` is less than `1` or greater than `50`:

```http
400 Bad Request
```

### Example

```json
{
  "error": {
    "code": "INVALID_LIMIT",
    "message": "Limit must be between 1 and 50.",
    "field": "limit"
  }
}
```

---

## Internal Failure

If the server cannot complete the discovery request because of an unexpected internal or provider failure:

```http
500 Internal Server Error
```

### Example

```json
{
  "error": {
    "code": "DISCOVERY_UNAVAILABLE",
    "message": "Nearby places could not be loaded. Please try again."
  }
}
```

The response must not expose internal stack traces, credentials, provider secrets, or implementation details.

---

## Content Type

Successful and error responses must use:

```http
Content-Type: application/json
```

---

## Contract Rules

The following behavior is part of the API contract and should be covered by implementation tests.

1. `lat` and `lng` are required.
2. Latitude must be between `-90` and `90`.
3. Longitude must be between `-180` and `180`.
4. `radius` defaults to `1000` metres when omitted.
5. `radius` must be between `1` and `5000` metres.
6. `limit` defaults to `10` when omitted.
7. `limit` must be between `1` and `50`.
8. Returned places must fall within the effective search radius.
9. Results must be ordered from nearest to farthest.
10. `distanceMeters` must be expressed in metres.
11. A valid search with no results must return `200 OK` and an empty `data` array.
12. Invalid input must return `400 Bad Request`.
13. Unexpected server failures must return `500 Internal Server Error`.
14. Responses must use structured JSON.
15. Error responses must contain a stable machine-readable `error.code`.
16. Error messages must be concise and useful to the client.
17. Internal stack traces and secret values must never be returned.

---

## Mobile Client Guidance

A mobile application can use the response to display nearby-place cards containing:

* place name
* category
* short description
* distance from the traveler
* estimated walking time

For example:

```text
Praça do Comércio
Landmark

Historic waterfront square in central Lisbon.

420 m away
6 min walk
```

When `data` is empty, the application should show an empty state rather than treating the request as an error.

Example:

```text
No nearby places found.

Try increasing your search area.
```

---

## Example Default Request

When only coordinates are supplied:

```http
GET /api/v1/discovery/places?lat=38.7223&lng=-9.1393
```

The server behaves as though the following request was made:

```http
GET /api/v1/discovery/places?lat=38.7223&lng=-9.1393&radius=1000&limit=10
```

---

## Verification Checklist

The contract can be verified by checking that it clearly defines:

* HTTP method
* endpoint path
* required parameters
* optional parameters
* default values
* parameter boundaries
* success status code
* successful response shape
* empty result behavior
* validation failures
* server failure behavior
* JSON structure
* result ordering
* distance units

Later implementation tests should be able to derive expected behavior directly from this document without making additional assumptions.
