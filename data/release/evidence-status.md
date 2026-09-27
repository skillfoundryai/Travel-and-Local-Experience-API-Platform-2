# Synthetic Release Evidence

| Area | Status | Evidence |
|---|---|---|
| Discovery success and unavailable lookup | verified-example | SCN-001 to SCN-003; `fixtures/discovery-records.json` |
| Owner-scoped itinerary access | verified-example | SCN-004 to SCN-006; `fixtures/traveler-journeys.json` |
| Application booking flow | verified-example | SCN-007 to SCN-009 |
| Authentication boundaries | documented-example | SCN-010 to SCN-011 |
| Dependency-safe behavior | documented-example | SCN-012 to SCN-013 |
| Privacy and recovery | documented-example | SCN-014 to SCN-015 |

## Practice assumptions

- All identifiers and records are synthetic.
- A `403` response is used for a known authenticated owner mismatch in these examples.
- A `503` response indicates that a write was not reported as successful.
- Cache data is temporary; persistent records remain authoritative in the database.

## Out of scope

These resources do not represent real people, credentials, provider confirmations, payments, mobile applications, production hosting, or live booking operations.