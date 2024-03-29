import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, TouchableOpacity} from 'react-native';

export default class RandomNumber extends React.Component {
  static propTypes= {
    number: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
  }
  handlePress = () => {
    if (this.props.isDisabled) { return; }
    this.props.onPress(this.props.id);
  };
  render() {
    return (
      <TouchableOpacity onPress={this.handlePress} >
        <Text style={[styles.random, this.props.isDisabled && styles.disabled]}> 
          {this.props.number} 
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles= StyleSheet.create({
  random: {
    backgroundColor: '#999',
    width: 150,
    marginHorizontal: 15,
    marginVertical: 20,
    fontSize: 35,
    textAlign: 'center',
  },
  disabled: {
    opacity:0.3,
  }
});