import Geolocation from '@react-native-community/geolocation';
import {useEffect, useMemo, useState} from 'react';
import {LatLng} from 'react-native-maps/lib/sharedTypes';

export const usePosition = () => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | undefined>();
  const [authorized, setAuthorized] = useState(false);

  const initialRegion = useMemo(() => {
    if (currentPosition) {
      return {
        latitude: currentPosition?.latitude,
        longitude: currentPosition?.longitude,
        latitudeDelta: 0.0005,
        longitudeDelta: 0.0005,
      };
    }
  }, [currentPosition]);

  useEffect(() => {
    Geolocation.requestAuthorization(
      () => setAuthorized(true),
      error => console.info('Geolocation permission error', error.message),
    );

    Geolocation.getCurrentPosition(
      position =>
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      err => console.info('GetCurrentPosition error', err.message),
      {enableHighAccuracy: false, timeout: 5000, maximumAge: 10000},
    );
  }, [authorized]);

  return {
    initialRegion,
    currentPosition,
  };
};
