import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { supabase } from '../lib/supabase';

const LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
  if (error) return;

  const { locations } = data;

  if (locations?.length) {
    const location = locations[0];

    console.log(
      'Background location:',
      location.coords.latitude,
      location.coords.longitude
    );
  }
});

type Provider = {
  id: string;
  name: string;
  type: string;
  phone: string | null;
  rating: number;
  review_count: number;
  about: string | null;
  latitude: number;
  longitude: number;
  zip_code: string | null;
  is_active: boolean;
};

type UserCoords = {
  latitude: number;
  longitude: number;
};

function getDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 3958.8;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapScreen() {
  const params = useLocalSearchParams();

  const [userLocation, setUserLocation] = useState<UserCoords | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const name = String(params.name ?? '');
  const location = String(params.location ?? '');
  const zipCode = String(params.zipCode ?? '');
  const [currentUserId, setCurrentUserId] = useState('');
  const caseType = String(params.caseType ?? '');
  const description = String(params.description ?? '');
  const needBail = String(params.needBail ?? 'false') === 'true';
  const needAttorney = String(params.needAttorney ?? 'false') === 'true';

  const pinAnimations = useRef<Record<string, Animated.Value>>({}).current;

  useEffect(() => {
    const loadProviders = async () => {
      setLoading(true);

      let query = supabase
        .from('providers_deduped')
        .select('*')
        .eq('is_active', true);

      if (zipCode.trim()) {
        query = query.eq('zip_code', zipCode.trim());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Load providers error:', error);
        setProviders([]);
      } else {
        const rows = (data ?? []) as Provider[];
        setProviders(rows);

        rows.forEach((provider) => {
          pinAnimations[provider.id] = new Animated.Value(0);
        });
      }

      setLoading(false);
    };

    loadProviders();
  }, [zipCode, pinAnimations]);

const checkMunicipalityZone = async (
  latitude: number,
  longitude: number,
  userIdForEvent: string
) => {
  try {
    const { data: zones, error } = await supabase
      .from('municipality_zones')
      .select('*');

    if (error || !zones) return;
Alert.alert('Debug', `Zones found: ${zones.length}`);
    for (const zone of zones) {
      const distance = getDistanceMiles(
        latitude,
        longitude,
        zone.latitude,
        zone.longitude
      );
Alert.alert(
  'Distance Check',
  `${zone.name}: ${distance} miles`
)
      if (distance <= zone.radius_meters) {
  console.log('Inside zone:', zone.name);

  const now = new Date();
  const hour = now.getHours();

  const isAfterHours = hour >= 22 || hour < 6;

  const eventRiskLevel =
    isAfterHours ? 'high' : (zone.risk_level || 'standard');

const { error: eventError } = await supabase
.from('geofence_events')
.insert({    
  zone_id: zone.id,
    user_id: userIdForEvent,
    latitude,
    longitude,
    risk_level: eventRiskLevel,
    is_after_hours: isAfterHours,
    entered_at: now.toISOString(),
  });

  if (eventError) {
  Alert.alert('Geofence Insert Error', eventError.message);
  return;
}
router.push({
  pathname: '/request-help',
  params: {
    zoneId: String(zone.id),
    zoneName: zone.name,
    location,
    zipCode,
    caseType,
    description,
    needBail: String(needBail),
    needAttorney: String(needAttorney),
  },
});

Alert.alert('Insert Success', 'Event writtten to database');

await supabase.from('notifications').insert({
  provider_id: zone.provider_id,
  title: 'Municipality Alert',
  body: `Client entered ${zone.name} - Risk: ${eventRiskLevel}`,
  read: false,
});

  Alert.alert(
    'Municipality Alert',
    `Entered ${zone.name}`
  );
}

  }
} catch (err) {
  console.error(err);
}
};

  useEffect(() => {
    const loadUser = async () => {
  const { data } = await supabase.auth.getUser();

  Alert.alert('User Test', data.user?.id ?? 'No user found');

  console.log('Current User ID:', data.user?.id);
  setCurrentUserId(data.user?.id ?? '');
};

loadUser();
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          return;
        }

// const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
//
// if (backgroundStatus.status !== 'granted') {
//   Alert.alert(
//     'Background Location Needed',
//     'Please allow background location access so BailMate can monitor geofence alerts.'
//   );
//   return;
// }

// const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);

// if (!hasStarted) {
//   await Location.startLocationUpdatesAsync(LOCATION_TASK, {
//     accuracy: Location.Accuracy.High,
//     timeInterval: 30000,
//     distanceInterval: 100,
//     showsBackgroundLocationIndicator: true,
//     foregroundService: {
//       notificationTitle: 'BailMate Monitoring Active',
//       notificationBody: 'Monitoring client location for geofence alerts.',
//     },
//   });
// }

        const current = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
const { data } = await supabase.auth.getUser();
const userIdForEvent = data.user?.id ?? '';
        await checkMunicipalityZone(
  current.coords.latitude,
  current.coords.longitude,
  userIdForEvent
);
      } catch (error: any) {
  console.log(error);
  Alert.alert(
    'Location Error',
    error?.message || JSON.stringify(error)
  );
}
    };
    
    getLocation();
  }, []);

  const filteredProviders = useMemo(() => {
    const normalizedCaseType = caseType.toLowerCase();
    const normalizedDescription = description.toLowerCase();

    const scored = providers.map((p) => {
      let score = 0;

      if (needBail && p.type === 'Bail Bondsman') score += 5;
      if (needAttorney && p.type.toLowerCase().includes('attorney')) score += 5;

      if (normalizedCaseType.includes('dui')) {
        if (p.type === 'Bail Bondsman') score += 3;
        if (p.type.toLowerCase().includes('criminal')) score += 4;
      }

      if (
        normalizedCaseType.includes('immigration') &&
        p.type.toLowerCase().includes('immigration')
      ) {
        score += 6;
      }

      if (normalizedDescription.includes('urgent')) score += 2;
      if (normalizedDescription.includes('jail')) score += 2;
      if (normalizedDescription.includes('arrest')) score += 2;

      score += Number(p.rating ?? 0);

      const distance =
        userLocation &&
        getDistanceMiles(
          userLocation.latitude,
          userLocation.longitude,
          p.latitude,
          p.longitude
        );

      return { ...p, score, distance };
    });

    return scored.sort((a, b) => b.score - a.score);
  }, [providers, caseType, description, needBail, needAttorney, userLocation]);

  useEffect(() => {
    if (!filteredProviders.length) return;

    filteredProviders.forEach((provider) => {
      if (!pinAnimations[provider.id]) {
        pinAnimations[provider.id] = new Animated.Value(0);
      } else {
        pinAnimations[provider.id].setValue(0);
      }
    });

    const animations = filteredProviders.map((provider, index) =>
      Animated.sequence([
        Animated.delay(index * 140),
        Animated.spring(pinAnimations[provider.id], {
          toValue: 1,
          friction: 4,
          tension: 110,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel(animations).start();
  }, [filteredProviders, pinAnimations]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading map providers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matching Providers</Text>

      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: userLocation?.latitude ?? 34.0522,
          longitude: userLocation?.longitude ?? -118.2437,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {filteredProviders.map((item) => {
          const scale =
            pinAnimations[item.id]?.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            }) ?? 1;

          const translateY =
            pinAnimations[item.id]?.interpolate({
              inputRange: [0, 0.65, 1],
              outputRange: [28, -10, 0],
            }) ?? 0;

          return (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <Animated.View
                style={{
                  transform: [{ scale }, { translateY }],
                }}
              >
                <View style={styles.pin}>
                  <Text style={styles.pinText}>BM</Text>
                </View>
              </Animated.View>

              <Callout
                onPress={() =>
                  router.push({
                    pathname: `/provider/${item.id}`,
                    params: {
                      providerName: item.name,
                      name,
                      location,
                      zipCode,
                      caseType,
                      description,
                      needBail: String(needBail),
                      needAttorney: String(needAttorney),
                    },
                  })
                }
              >
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{item.name}</Text>
                  <Text>
                    ⭐ {item.rating} ({item.review_count})
                  </Text>
                  {'distance' in item && item.distance ? (
                    <Text>{Number(item.distance).toFixed(1)} miles away</Text>
                  ) : null}
                  <Text>{item.type}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    padding: 15,
    color: 'black',
  },
  map: {
    flex: 1,
    borderRadius: 12,
    margin: 10,
  },
  pin: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  pinText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 18,
  },
  callout: {
    width: 210,
  },
  calloutTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
});