import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Text, Image, Icon, Button} from 'react-native-elements';

const {height} = Dimensions.get('window');

export default function Main({navigation}) {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState('Ordinary Drink');
  const [amount, setAmount] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [isSearched, setSearched] = useState(false);
  const [searchedDrinks, setSearchedDrinks] = useState([]);

  const onLoadMore = () => {
    setAmount(amount + 10);
  };

  const onSearch = () => {
    if (searchText === '') return;
    fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`,
    )
      .then((response) => response.json())
      .then((json) => setSearchedDrinks(json.drinks))
      .catch((err) => console.log(err));
    setSearched(true);
  };

  const renderData = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          margin: 5,
          borderRadius: 5,
          padding: 5,
          borderColor: '#0074D9',
        }}
        onPress={() => navigation.navigate('Details', {item: item})}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: item.strDrinkThumb}}
            style={{
              height: height * 0.1,
              width: height * 0.1,
              borderRadius: 50,
            }}
          />
          <View style={{flex: 1, margin: 5}}>
            <Text style={{fontSize: 25}}>{item.strDrink}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getData = (category) => {
    fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`,
    )
      .then((response) => response.json())
      .then((json) => setData(json.drinks))
      .catch((err) => console.log(err));
  };

  const onPressHandler = (category) => {
    setData([]);
    setAmount(10);
    setSelected(category);
    getData(category);
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => onPressHandler(item.strCategory)}
          style={{
            borderWidth: 1,
            margin: 5,
            borderRadius: 5,
            padding: 5,
            borderColor: '#0074D9',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 25}}>{item.strCategory}</Text>
            <Icon
              name="keyboard-arrow-down"
              type="material"
              size={35}
              style={{marginRight: 5}}
            />
          </View>
        </TouchableOpacity>
        {item.strCategory === selected && (
          <FlatList
            data={data.slice(0, amount)}
            renderItem={renderData}
            keyExtractor={(item) => item.idDrink}
            ListFooterComponent={
              <Button
                raised
                title="Load More"
                type="outline"
                containerStyle={{width: '40%', alignSelf: 'center'}}
                buttonStyle={{borderRadius: 20, borderWidth: 1}}
                onPress={onLoadMore}
              />
            }
          />
        )}
      </View>
    );
  };

  useEffect(() => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
      .then((response) => response.json())
      .then((json) => {
        setCategories(json.drinks);
      })
      .catch((err) => console.log(err));
    getData(selected);
  }, []);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 2,
          borderBottomColor: '#C7D4DC',
        }}>
        <TextInput
          placeholder="Search"
          style={{
            borderRadius: 25,
            backgroundColor: '#4D5A63',
            margin: 5,
            width: '70%',
            flex: 4,
            paddingLeft: 20,
            fontSize: 20,
            color: '#C7D4DC',
          }}
          underlineColorAndroid="transparent"
          placeholderTextColor="#C7D4DC"
          selectionColor="#C7D4DC"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={onSearch}>
          <Text
            style={{
              fontSize: 20,
              color: '#0074D9',
              flex: 1,
              textAlignVertical: 'center',
              marginRight: 5,
            }}>
            Search
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ListHeaderComponent={
          isSearched && searchedDrinks !== null ? (
            <FlatList
              data={searchedDrinks}
              renderItem={renderData}
              keyExtractor={(item) => item.idDrink}
            />
          ) : (
            <Text style={{fontSize: 25, textAlign: 'center'}}>
              No search results
            </Text>
          )
        }
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.strCategory}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
