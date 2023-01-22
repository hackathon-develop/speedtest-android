import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, Button} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {usePosition} from './src/hooks/hooks';
// import measurements from './src/data.json';
import useAxios from 'axios-hooks';
import {getQuality} from './src/helper/getGuality';

function App(): JSX.Element {
  const {initialRegion, currentPosition} = usePosition();
  const [{data, loading}, refetch] = useAxios({
    url: 'https://data.mongodb-api.com/app/data-vdlqg/endpoint/data/v1/action/find',
    method: 'POST',
    headers: {
      'api-key':
        'dSjitvFRGm0ELDad4iAsJTdy5RMQknQhLl1X4Q4qX87Mjmmo4Wz0LvZlV58xnifC',
    },
    data: {
      collection: 'measure',
      database: 'qos',
      dataSource: 'Cluster0',
    },
  });

  const maxJitter = React.useMemo(() => {
    if (data) {
      return Math.max(...data?.documents.map(item => item.data.jitter));
    }
  }, [data]);

  const minJitter = React.useMemo(() => {
    if (data) {
      return Math.min(...data?.documents.map(item => item.data.jitter));
    }
  }, [data]);

  const diff = React.useMemo(() => {
    if (maxJitter && minJitter) {
      return maxJitter - minJitter;
    }
  }, [maxJitter, minJitter]);

  const measurements = data?.documents;

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {currentPosition && measurements ? (
          <MapView style={styles.mapStyle} initialRegion={initialRegion}>
            {measurements.map(item => {
              const quality = getQuality(item.data.jitter, minJitter, diff);
              return (
                <Marker
                  key={item.data.time}
                  coordinate={{
                    latitude: Number(item.data.lat),
                    longitude: Number(item.data.long),
                  }}>
                  <Text>
                    {quality === 3 ? '🟢' : quality === 2 ? '🟡' : '🔴'}
                  </Text>
                </Marker>
              );
            })}
            {/* {measurements.map(item => (
              <Marker
                key={item.id}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}>
                <Text>
                  {item.quality === 3 ? '🟢' : item.quality === 2 ? '🟡' : '🔴'}
                </Text>
              </Marker>
            ))} */}
          </MapView>
        ) : null}
      </View>
      <Button title="Refresh ♽" onPress={refetch} disabled={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default App;
