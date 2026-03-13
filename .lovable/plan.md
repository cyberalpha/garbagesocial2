

## Plan: Replace Google Maps with Mapbox

### Summary
Replace all Google Maps usage across 3 files with Mapbox GL JS, and remove the Google Maps script from `index.html`. This requires a Mapbox access token.

### Files to modify

**1. Install dependency**
- Add `mapbox-gl` npm package and its types `@types/mapbox-gl`

**2. `index.html`** — Remove the Google Maps `<script>` tag

**3. `src/components/MapComponent.tsx`** — Full rewrite using Mapbox GL JS:
- Replace Google Map with `mapboxgl.Map`
- Replace Google Markers with `mapboxgl.Marker` (colored by category)
- Replace Google InfoWindow with `mapboxgl.Popup`
- Replace Google DirectionsService/Renderer with Mapbox Directions API (`https://api.mapbox.com/directions/v5/mapbox/driving/...`) and draw the route as a GeoJSON line layer
- Replace `LatLngBounds` with `mapboxgl.LngLatBounds` for fitting bounds
- Remove `window.google` declarations

**4. `src/components/LocationPicker.tsx`** — Full rewrite using Mapbox GL JS:
- Replace Google Map with `mapboxgl.Map`
- Replace draggable Google Marker with draggable `mapboxgl.Marker`
- Map click → update marker position (same logic, different API)
- Geolocation logic stays the same

**5. `src/components/PostDetails.tsx`** — Replace distance calculation:
- Remove dependency on `window.google.maps.geometry.spherical.computeDistanceBetween`
- Use the Haversine formula directly in JS (simple math, no library needed) — this eliminates the geometry library loading issue entirely

### API Token
Mapbox requires a public access token (starts with `pk.`). Since it's a **publishable key**, it can be stored directly in the codebase. I'll need to ask you to provide your Mapbox token, or you can create a free account at [mapbox.com](https://account.mapbox.com/) to get one.

### Technical notes
- Mapbox GL JS handles map loading natively (no script tag needed — it's an npm import)
- Routing in Mapbox uses a REST API call instead of a built-in DirectionsRenderer, so we'll fetch the route and draw it as a polyline layer
- The bounce animation on selected markers doesn't exist in Mapbox; selected markers will be visually distinguished by size/color instead

