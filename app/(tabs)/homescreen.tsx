import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import CircularProgress from '@/components/CircularProgress';
import OptionContainer from '@/components/OptionContainer';
import CustomDialog from '@/components/CustomDialog';

const TIMER_DURATION = 10;

const questions = [
  { question: "What is the output of the following code?\n\nconsole.log(1 + '2' + '1');", options: ['A: 121', 'B: 14', 'C: 1+22', 'D: 5'], correctOptionIndex: 0 },
  { question: "What is the output of the following code?\n\nconsole.log(1 + '2' + '2');", options: ['A: 0', 'B: 14', 'C: 1+22', 'D: 122'], correctOptionIndex: 3 },
  { question: "What is the output of the following code?\n\nconsole.log(1 + '2' + '3');", options: ['A: 123', 'B: 14', 'C: 1+22', 'D: 5'], correctOptionIndex: 0 },
  { question: "What is the output of the following code?\n\nconsole.log(1 + '2' + '4');", options: ['A: 3', 'B: 14', 'C: 1+22', 'D: 124'], correctOptionIndex: 3 },
  { question: "What is the output of the following code?\n\nconsole.log(1 + '2' + '5');", options: ['A: 2', 'B: 14', 'C: 125', 'D: 5'], correctOptionIndex: 2 },
  { question: "What is the output of the following code?\n\nconsole.log(1 + '2' + '6');", options: ['A: 5', 'B: 14', 'C: 1+22', 'D: 126'], correctOptionIndex: 3 },
];

export default function HomeScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [reset, setReset] = useState(false);

  const progress = useSharedValue(0);
  const progressAnimations = useRef(questions.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      handleRetry();
    }
  }, [timer]);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: TIMER_DURATION * 1000,
      easing: Easing.linear,
    });

    Animated.timing(progressAnimations[currentQuestionIndex], {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];
  
  const handleCloseDialog = () => {
    setDialogVisible(false);
    setDialogMessage('');
    setDialogType('success');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(TIMER_DURATION);
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: TIMER_DURATION * 1000,
        easing: Easing.linear,
      });
    }

    setReset(true);
  };

  const handleRetry = () => {
    setDialogVisible(false);
    setTimer(TIMER_DURATION);
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: TIMER_DURATION * 1000,
      easing: Easing.linear,
    });
    setReset(true);
  };

  const handleOptionSelect = (index: number) => {
    if (index === currentQuestion.correctOptionIndex) {
      currentQuestionIndex == 0 ?
      setDialogMessage(`You have earned a new Quiz Master badge`) :  setDialogMessage(`You have earned ${currentQuestionIndex+1} Quiz Master badges`);
      setDialogType('success');
    } else {
      setDialogMessage('Hint: Think about how JavaScript handles different data types');
      setDialogType('error');
    }

    setTimeout(() => {
      setDialogVisible(true);
    }, 400);
  };

  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset]);

  const renderProgressDots = () => {
    return questions.map((_, index) => {
      const scale = progressAnimations[index].interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.5],
      });

      const opacity = progressAnimations[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1],
      });

      return (
        <Animated.View
          key={index}
          style={[
            styles.progressItem,
            { transform: [{ scale }], opacity },
            currentQuestionIndex >= index && styles.correctProgress
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Coding Challenge</Text>
      </View>

      <View style={styles.timerCircle}>
        <CircularProgress progress={progress} />
        <Text style={styles.timerText}>{timer}</Text>
      </View>

      <View style={styles.elevatedContainer}>
        <Text style={styles.text}>
          {currentQuestion.question}
        </Text>
      </View>

      <OptionContainer
        options={currentQuestion.options}
        correctOptionIndex={currentQuestion.correctOptionIndex}
        onOptionSelect={handleOptionSelect}
        reset={reset}
      />

      <CustomDialog
        visible={dialogVisible}
        onClose={handleCloseDialog}
        message={dialogMessage}
        type={dialogType}
        onRetry={handleRetry}
      />

      <View style={styles.progressContainer}>
        {renderProgressDots()}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 65,
  },
  titleBar: {
    width: '100%',
    height: 60,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  titleText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerCircle: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    position: 'absolute',
    top: '21%',
    zIndex: 10,
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
  },
  elevatedContainer: {
    width: '80%',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 200,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 40,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  progressItem: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    margin: 5,
  },
  correctProgress: {
    backgroundColor: '#6200EE',
  },
});
