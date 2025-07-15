export const buildDirectionURL = (placeIds) => {
  const base = `https://www.google.com/maps/dir/?api=1`;

  if (placeIds.length < 2) return base;

  const originText = `origin=${placeIds[0]}`;
  const originPlaceId = `origin_place_id=${placeIds[0]}`;
  
  const destinationText = `destination=${placeIds[placeIds.length - 1]}`;
  const destinationPlaceId = `destination_place_id=${placeIds[placeIds.length - 1]}`;

  const waypointsArr = placeIds.slice(1, -1);
  const waypointsText = `waypoints=${waypointsArr.join('|')}`;
  const waypointPlaceIds = `waypoint_place_ids=${waypointsArr.join('|')}`;

  return `${base}&${originText}&${originPlaceId}&${destinationText}&${destinationPlaceId}&${waypointsText}&${waypointPlaceIds}`;
};


export const buildStaticMapURL = (placeNames) => {
  const base = `https://maps.googleapis.com/maps/api/staticmap`;
  const markers = placeNames.map(name => `markers=${encodeURIComponent(name)}`).join('&');

  return `${base}?${markers}&size=600x300&key=${process.env.API_KEY}`;
};

