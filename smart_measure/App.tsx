import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useStoresPosition} from './src/hooks/hooks';
import measurements from './src/data.json';
import useAxios from 'axios-hooks';

function App(): JSX.Element {
  const {initialRegion, currentPosition} = useStoresPosition();
  const [{data, loading, error}] = useAxios({
    url: 'https://data.mongodb-api.com/app/data-vdlqg/endpoint/data/v1/action/find',
    method: 'POST',
    headers: {
      'api-key':
        'dSjitvFRGm0ELDad4iAsJTdy5RMQknQhLl1X4Q4qX87Mjmmo4Wz0LvZlV58xnifC',
    },
    // headers: {'X-Requested-With': 'XMLHttpRequest'},
    data: {
      collection: 'measure',
      database: 'qos',
      dataSource: 'Cluster0',
      filter: {},
    },
  });

  console.log(data);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {currentPosition ? (
          <MapView style={styles.mapStyle} initialRegion={initialRegion}>
            {measurements.map(item => (
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
            ))}
          </MapView>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
