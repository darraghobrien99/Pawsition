export const _values = { 
    region: {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
  };
  
  export const onRegionChange = (region) => {
       _values.region = region;
  }