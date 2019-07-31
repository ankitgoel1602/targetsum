import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, View, Button } from 'react-native';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

export default class Game extends React.Component {

  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
    onNextLevel: PropTypes.func.isRequired,
    calcScore: PropTypes.func.isRequired,
  }

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  }

  gameStatus = 'PLAYING';

  randomNumbers = Array
    .from({length: this.props.randomNumberCount})
    .map(() => 1 + Math.floor(10 * Math.random()));

  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount-2)
    .reduce((acc, curr)=> acc + curr, 0);

  shuffledRandomNumbers =  shuffle(this.randomNumbers);

  componentDidMount() {
    this.intervalId =  setInterval( () => {
      this.setState((prevState) => {
        return {remainingSeconds: prevState.remainingSeconds - 1};
      }, () => {
        if (this.state.remainingSeconds===0) {
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  } 

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
    
      if (this.gameStatus === 'WON') {
        this.currentscore = 
          nextState.remainingSeconds * 
          (5 + 5*(this.props.randomNumberCount % 6) ); //TODO: change seconds weightage depending on level
        this.props.calcScore(this.currentscore);
      }
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }

    }
    return true;
  }

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = (numberIndex) => {
    this.setState( (prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
    }));
  }
  //game status: PLAYING, WON, LOST
  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce ((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);

    if (nextState.remainingSeconds===0) {
      return 'LOST';
    }

    if (sumSelected < this.target) {
      return 'PLAYING';
    }

    if (sumSelected === this.target) {
      return 'WON';
    }

    if (sumSelected > this.target) {
      return 'LOST';
    }

  }
  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={styles.randomContainer}>
          { this.shuffledRandomNumbers.map((randomNumber, index)=>
            <RandomNumber 
              key={index} 
              id= {index}
              isDisabled={
                this.isNumberSelected(index) || gameStatus !== 'PLAYING'
              }
              number={randomNumber} 
              onPress={this.selectNumber}
            />
          )}
        </View>
        { this.gameStatus === 'WON' && (
          <Button title={`Go to Level ${this.props.level + 1}`} onPress={this.props.onNextLevel} />
        )}
        { this.gameStatus === 'LOST' && (
          <Button title='Play Again' onPress={this.props.onPlayAgain} />
        )}
        <Text style={styles.Timer}>Time: {this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

const styles= StyleSheet.create({

  container: {
    flex:1,
    backgroundColor:'#ddd',
    paddingTop:30
  },
  target: {
    textAlign:'center',
    marginTop:20,
    fontSize:40,
    marginHorizontal:50
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 50,
    justifyContent: 'space-around',
  },

  STATUS_PLAYING: {
    backgroundColor:'#aaa',
  },

  STATUS_WON: {
    backgroundColor:'green',
  },

  STATUS_LOST: {
    backgroundColor:'red',
  },

  Timer: {
    textAlign:'center',
    marginBottom: 20,
    marginTop:30,
    fontSize:25,
    marginHorizontal:50
  },
});