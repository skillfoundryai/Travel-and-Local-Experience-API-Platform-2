# Discovery API Contract

## Purpose

The Discovery API returns places and activities for a requested destination.

This contract defines only discovery behavior.

It does not provide:

- itinerary generation
- booking
- authentication
- offline synchronization
- real third-party provider integration

Provider data may be mocked or locally supplied during the current implementation stage.

---

# Endpoint

## Discover places and activities

### Method

GET

### Path

/discovery

### Query parameters

| Parameter | Type | Required | Description |
|---|---|---:|---|
| destination | string | Yes | Destination to search, for example `Muscat` |
| category | string | No | Optional category such as `place` or `activity` |
| limit | number | No | Maximum number of results to return. Must be between 1 and 50. |

Example:

```http
GET /discovery?destination=Muscat&category=activity&limit=10
