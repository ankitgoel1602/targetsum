import React from 'react';
import Game from './Game';

import { View, Text, StyleSheet } from 'react-native';

export default class App extends React.Component {
  state = {
    gameId: 1,
    level: 1,
    score: 0,
    randomNumberCount: 6,
  };

  resetGame = () =>{
    this.setState((prevState) => {
      return { 
        gameId: prevState.gameId + 1,
        level: 1,
        score: 0,
        randomNumberCount: 6,
      };
    });
  };

  nextLevel = () => {
    this.setState((prevState) => {
      return { 
        gameId: prevState.gameId + 1,
        level: prevState.level + 1,	   
        randomNumberCount: 
          prevState.randomNumberCount <10 ? 
            prevState.randomNumberCount + 1 * !Math.floor(prevState.level % 2):
            prevState.randomNumberCount, //Every 5th level increase numbers
      };
    });
  }

  calcScore = (currentscore) => {
    this.setState((prevState) => {
      return {
        score: prevState.score + currentscore,
      };
    });
  }
  render() {
    return (
      <View	
        //source={require('../images/background.jpg')}
        style={styles.container}> 
        <Game 
          key={this.state.gameId} 
          onPlayAgain={this.resetGame}
          onNextLevel={this.nextLevel}
          calcScore={this.calcScore}
          level={this.state.level}
          randomNumberCount={this.state.randomNumberCount} 
          initialSeconds= {10}
        />
        <Text style={styles.score}>Score: {this.state.score}</Text>
      </View>
    );
  }
}

const styles= StyleSheet.create({

  container: {
    flex:1,
    backgroundColor:'#ddd',
  },
  score: {
    textAlign:'center',
    marginBottom: 30,
    marginTop:20,
    fontSize:25,
    marginHorizontal:50
  }
});