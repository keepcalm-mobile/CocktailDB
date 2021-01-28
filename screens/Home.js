import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        console.log(json);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Text h2 style={{alignSelf: 'center'}}>
        Home
      </Text>
    </View>
  );
}
