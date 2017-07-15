import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import storage from '../Model/PosterificStorage';
import UserModel from '../Model/UserModel';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Image
        resizeMode="cover"
        source={require('./../assets/images/login-splash-bg.jpg')}
        style={styles.splashContainer}
      >
      <Text style={styles.mainTitle}>Posterific!</Text>
        <Text style={styles.subTitle}>Poster making made easy.</Text>
      <View>
        <LoginButton
          onLoginFinished={
            (error,result) => {
              if (error) {
                alert("Login failed with error: " + error.toString());
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
              console.log(result);
              AccessToken.getCurrentAccessToken().then((data) => {
                if(data == null){
                  console.warn("No Access Token Available");
                } else {
                  let then = this;
                  let graphPath = '/me?fields=id,name,picture{url}';
                  let requestHandler = function(error,result){
                    if(!error){
                      console.log(result);
                      console.log(result.id+', '+result.first_name+', '+result.picture.data.url);
                      let user = new UserModel(result.id,result.first_name,result.picture.data.url);                      
                      storage.save({
                        key:'user',
                        rawData : {
                          user:user
                        }
                      })

                      then.props.navigator.push({
                        name: 'PosterList'
                      });
                    }
                    
                    console.log('your err:', error);
                    console.log('result:', result);
                  }
                  let userInfoRequest = new GraphRequest(graphPath, null, requestHandler);

                  
                  new GraphRequestManager().addRequest(userInfoRequest).start();


                  console.log("got access token "+ data.accessToken);
                  console.log("permission: "+data.permissions);
                }
              })

              }
            }
          }
          onLogoutFinished={() => {
            alert("User logged out")
            storage.remove({key: 'user'});
            this.props.navigator.popToTop();
          }}/>
      </View>

        <TouchableOpacity
          onPress={
            () => {
              this.props.navigator.push({
                name: 'PosterList'
              });
            }
          }
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: 180, height: 28, backgroundColor: '#4167ae', borderRadius: 3, margin: 20 }}>
            <Text style={{ margin: 3, color: 'white', fontWeight: 'bold' }}>Get Started</Text>
          </View>
        </TouchableOpacity>

      </Image>
    );
  }
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  mainTitle: {
    fontSize: 72,
    color: 'white'
  },
  subTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    fontSize: 18,
    color: 'white',
    marginBottom: 50
  }
});