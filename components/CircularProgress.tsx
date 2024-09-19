import React from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: Animated.SharedValue<number>;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ progress }) => {
  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <Svg height="110" width="110" viewBox="0 0 100 100">
      <G rotation="-90" origin="50, 50">
        <Circle
          cx="50"
          cy="50"
          r={RADIUS}
          stroke="#ddd"
          strokeWidth="10"
          fill="none"
        />
        <AnimatedCircle
          cx="50"
          cy="50"
          r={RADIUS}
          stroke="#6200EE"
          strokeWidth="10"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedCircleProps}
        />
      </G>
    </Svg>
  );
};

export default CircularProgress;
