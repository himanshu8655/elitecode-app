import React, { useState, useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OptionContainerProps {
  options: string[];
  correctOptionIndex: number;
  onOptionSelect: (index: number) => void;
  reset: boolean;
}

const OptionContainer: React.FC<OptionContainerProps> = ({ options, correctOptionIndex, onOptionSelect, reset }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reset) {
      setSelectedOption(null);
    }
  }, [reset]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleOptionPress = (index: number) => {
    if (selectedOption !== index) {
      setSelectedOption(index);
      if (index !== correctOptionIndex) {
        shake();
      }
      onOptionSelect(index);
    }
  };

  const animatedStyle = {
    transform: [
      {
        translateX: animation,
      },
    ],
  };

  return (
    <View style={styles.optionContainer}>
      {options.map((option, index) => {
        const isSelected = selectedOption === index;
        const isCorrect = index === correctOptionIndex;
        return (
          <TouchableOpacity key={index} onPress={() => handleOptionPress(index)}>
            <Animated.View
              style={[
                styles.option,
                animatedStyle,
                {
                  backgroundColor: isSelected
                    ? (isCorrect ? 'green' : 'red')
                    : '#fff',
                },
              ]}
            >
              <Text style={[styles.optionText, { color: isSelected ? 'white' : 'black' }]}>
                {option}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    marginTop: 10,
    width: '80%',
  },
  option: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default OptionContainer;
