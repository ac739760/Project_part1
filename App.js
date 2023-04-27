import {useState} from 'react';
import { Pressable, StyleSheet, Text, View, Image, TextInput } from 'react-native';
import {NavigationContainer,} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen'
const Stack = createNativeStackNavigator();
const rock = require('./assets/rock.png');
const paper = require('./assets/paper.png');
const scissors = require('./assets/scissors.png');

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);


//will add database functions




export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions = {{headerTitleALign: 'center'}}>
        <Stack.Screen name = "MainScreen" component = {MainScreen}
        options = {{headerShown: false,}}/>
        <Stack.Screen name = "Data" component = {Data}
        options={{headerShown: false,}}/>
  
      </Stack.Navigator>
    </NavigationContainer>
  );
}
function MainScreen({navigation}){
  
  const [x,setx]=useState("R");

  
  return(
    <View>
      <View style = {styles.titleContainer}>
        <Pressable style = {styles.data_button} onPress ={()=>{
          
          navigation.navigate('Data', {x:x,});}}>
          <Text>Data</Text>
        </Pressable>
        <Text style = {styles.title}>Rock Paper Scissors</Text>
      </View>
      {/*will change Images to animations. Also change submit button to start animation and assign variables*/}
      <View style = {styles.imageContainer}>
        <Image source = {rock} style = {styles.image}></Image>
        <Image source = {rock} style = {styles.image}></Image>
      </View>
      
      <View style = {styles.input}>
        <TextInput placeholder='Type R P or S' maxLength = {1} onChangeText={(text)=>setx(text)}></TextInput>
      </View>
      
      <Pressable style = {styles.submitButton} onPress ={()=>{
          navigation.navigate('Data',{x:x,});}}>
        <Text>submit</Text>
      </Pressable>
        
    </View>
  );
}

function Data ({navigation,route}){
  const {x} = route.params;
  return(
    <View>
      <View style = {styles.titleContainer}>
        <Pressable style = {styles.back_button} onPress ={()=>{
          
          navigation.navigate('MainScreen');}}>
          <Text>Back</Text>
        </Pressable>
        <Text style = {styles.title}>Data</Text>
        <></>
      </View>
      <Text>{"\n    "+x}</Text>
          {/*<Items></Items>*/}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  data_button:{
    backgroundColor: '#ff4d4d',
    width:80,
    height:50,
    borderRadius:10,
    padding:15,
    paddingLeft:25,
    marginRight:18,
    
  },
  imageContainer:{
    
    flexDirection:'row',
  },
  image:{
    margin:50,
    marginTop:100,
    width:100,
    height: 100,
    borderRadius:5,
  },
  input:{
    backgroundColor:"#ccc",
    fontSize:10,
    fontFamily:'sans-serif',
    padding: 10,
    margin: 10,
    marginLeft:95,
    width:200,
    height:50,
    borderRadius:10,
  },
  title:{
    fontSize: 30,
    fontFamily:'sans-serif',
    fontWeight: 'bold'
  },
  titleContainer:{
    flexDirection:'row',
    marginLeft:'4%',
    marginTop:'30%',
    
  },
  instructions:{
    fontSize:30,
    fontFamily:'sans-serif',
  },
  output:{

  },
  submitButton:{
    backgroundColor:"#ccc",
    padding: 10,
    margin: 10,
    marginLeft:95,
    width:200,
    height:50,
    borderRadius:10,
    paddingLeft:75,
    paddingTop:13,
  },
  back_button:{
    backgroundColor: '#ff4d4d',
    width:80,
    height:50,
    borderRadius:10,
    padding:15,
    paddingLeft:25,
    marginRight:80,
  },
});
