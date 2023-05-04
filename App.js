import {useState} from 'react';
import { Pressable, StyleSheet, Text, View, TextInput, Animated,Easing, ScrollView, Linking, Alert, SafeAreaView} from 'react-native';
import {NavigationContainer,} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen'
import * as SQLite from "expo-sqlite";


const Stack = createNativeStackNavigator();
let jumpValue = new Animated.Value(0);

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

//____________________________________________(database functions)_______________________________________________

function openDatabase(){
  if(Platform.OS ==="web"){
    return{transaction:() =>{
        return{executeSql:()=>{},}
      }
    }
  }
  const db = SQLite.openDatabase("RPSDB.db")
  return db;
}

db = openDatabase();

function Items() {
  const [items, setItems] = useState(null);

  
  db.transaction((tx) => {
    tx.executeSql(
      `select id, player, comp, winner from items;`,
      [],
      (_, { rows: { _array } }) => setItems(_array)
    );
  });
  

  if (items === null || items.length === 0) {
    return null;
  }

  return (
    <View >
    
      {items.map(({ id, player, comp, winner}) => (
       
          <Text key = {id} style={styles.sectionContainer}>{id+ " Player:"+player+"  Computer:"+comp +"  Winner:"+winner }</Text>
      ))}
    </View>
  );
}


function onLoad(){
 try{
  db.transaction((tx) => {
    //tx.executeSql(
    //  "drop table items;"
    //);
    tx.executeSql(
      "create table if not exists items (id integer primary key not null, player text, comp text, winner text);"
    );
  });
  }catch(error){
  Alert.alert('Error', 'There was an error while loading the data');
  }
}


function onSave(comp,player,winner){
  
  try {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into items (player, comp, winner) values (?, ?, ? )", [player, comp, winner]);
        tx.executeSql("select * from items", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      null
    );
   
    
  } catch (error) {
    Alert.alert('Error', 'There was an error while saving the data');
  }
}
//______________________________________________(extra functions + animations)___________________________________________________
function isValid(input){
  if(input == "R" || input == "P" || input =="S" ){
    return true
  }else{
    return false
  }
}

function findWinner(player, comp){
  if (player == comp){
    return "Tie"
  }
  if(player == "R"){
    if(comp=="P"){
      return "Computer"
    }else if(comp == "S"){
      return "You"
    }
  }
  if (player == "P"){
    if(comp=="S"){
      return "Computer"
    }else if(comp == "R"){
      return "You"
    }
  }
  if (player == "S"){
    if(comp=="R"){
      return "Computer"
    }else if(comp == "P"){
      return "You"
    }
  }
  
}

function compChoice(){
  let choice = " "
  let random = Math.floor(Math.random()*3); 
  if(random == 0){
    choice = "R"
    return choice
  }else if(random == 1){
    choice = "P"
    return choice
  }else if (random == 2){
    choice = "S"
    return choice
  }

}

function getImage(input){
  const rock = require('./assets/rock.png');
  const paper = require('./assets/paper.png');
  const scissors = require('./assets/scissors.png');
  if (input=="R"){
    return rock
  }else if (input == "P"){
    return paper
  }else if (input == "S"){
    return  scissors
  }
}

function jumpUp(){

  setTimeout(()=>{Animated.timing(jumpValue, {toValue: 1, duration: 500, easing: Easing.linear, useNativeDriver: false}).start(()=>
  Animated.timing(jumpValue, {toValue: 0, duration: 500, easing: Easing.linear, useNativeDriver: false}).start(()=>
  Animated.timing(jumpValue, {toValue: 1, duration: 500, easing: Easing.linear, useNativeDriver: false}).start(()=>
  Animated.timing(jumpValue, {toValue: 0, duration: 500, easing: Easing.linear, useNativeDriver: false}).start())))},1000)
}


//_____________________________________________(screens/styles below)__________________________________________________



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
  
  const [player,setplayer]=useState("R");
  const [comp,setcomp]=useState(compChoice());
  //const [winner, setwinner]= useState("");
  const [compImage,setCompImage]=useState(getImage(comp));
  const [playerImage, setPlayerImage]=useState(getImage(player));
  const [disabled, setdisabled]=useState(false);

  const bottom = jumpValue.interpolate({
    inputRange: [0,1],
    outputRange: [0, 30]
  })


  return(
    <View style = {styles.container}>
      <View style = {styles.titleContainer}>
        <Pressable style = {styles.data_button} onPress ={()=>{
          
          navigation.navigate('Data');}}>
          <Text>Data</Text>
        </Pressable>
        <Text style = {styles.title}>Rock Paper Scissors</Text>
      </View>
      
      
      <View style = {styles.imageContainer}>
        <Animated.Image source = {playerImage} style = {{bottom:bottom, margin:50,
          marginTop:100,
          width:100,
          height: 100,
          borderRadius:5,
        }}/>
        
        <Animated.Image source = {compImage} style = {{bottom:bottom, margin:50,
          marginTop:100,
          width:100,
          height: 100,
          borderRadius:5,
        }}/>

        
      </View>



      
      <View style = {styles.input}>
        <TextInput placeholder='Type R P or S' maxLength = {1} onChangeText={(text)=>{
          if(isValid(text)){
          setplayer(text);
          
          setdisabled(false);
          }else if(text == ""){
            Alert.alert('Error','Must be either R P or S');
            setdisabled(true);
          }
        
        }}></TextInput>
      </View>
      
      <Pressable style = {styles.submitButton} disabled = {disabled} onPress ={()=>{
          onLoad();
          //setcomp(compChoice());
          var comp = compChoice();
          var winner = findWinner(player,comp)
          
         
          if(isValid(player)&& winner != ""){
            setdisabled(true);
            onSave(comp, player, winner);
            //jumpUp();
          //setTimeout(()=>{ 
            setCompImage(getImage(comp));
            setPlayerImage(getImage(player));
          //},3500)
           
            //setTimeout(()=>{
              navigation.navigate('Data');
          //},5000)
          setdisabled(false)
          }
          
    
          }}>
        
        <Text>submit</Text>
      </Pressable>
        <Text>{"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}</Text>
    </View>
  );
}




function Data ({navigation}){
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
      
      <SafeAreaView style = {styles.scrollcontainer}>
        <ScrollView>
          <Items/>
          <Pressable style = {styles.submitButton} onPress ={()=>{Linking.openURL('https://medium.com/street-science/how-to-use-science-to-win-at-rock-paper-scissors-f2f0a67d8fc6')}}><Text>RPS Theory</Text></Pressable>
        </ScrollView>
      </SafeAreaView>
      
      
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#66e0ff',
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
  sectionContainer:{
    marginRight:40,
    borderWidth:1,
    borderColor: "#66e0ff",
    padding:10,
    margin:10,
    borderRadius:5,
  },
  scrollcontainer:{
    marginLeft:30,
    marginTop:10,
  }
});
