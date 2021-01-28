import React, {useEffect, useState} from 'react';
import {Dimensions, View, FlatList} from 'react-native';
import {Text, Image} from 'react-native-elements';

const {height} = Dimensions.get('window');

export default function Details({route}) {
  const {item} = route.params;
  const [data, setData] = useState([]);

  const renderItem = ({item}) => {
    return (
      <View style={{padding: 5}}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {item.strDrink}
        </Text>
        <Image
          source={{uri: item.strDrinkThumb}}
          style={{height: height * 0.4, width: '100%', borderRadius: 10}}
        />
        <Text style={{fontSize: 25}}>
          Type: {item.strAlcoholic} {item.strCategory}
          {'\n'}
          Glass: {item.strGlass}
          {'\n'}
          Instructions:{' '}
          {item.strInstructions !== ''
            ? item.strInstructions
            : 'No instructions'}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${item.idDrink}`,
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json.drinks);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.idDrink}
    />
  );
}
