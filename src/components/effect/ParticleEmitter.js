import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

function random(min = 0, max = 100) {
  const difference = max - min;
  let rand = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
}

const ParticleEmitter = ({
  particlesCount = 15,
  particlesLifeTime = 2000,
  particlesSize = 12,
  particlesColor = '#E0E3EF',
  easing = null,
}) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    initAnimatedValues();

    return () => {
      stopAllValues();
    };
  }, []);

  const onLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    const particlesArray = initAnimatedValues(width, height);
    startAllValues(particlesArray);
    setParticles(particlesArray);
  };

  const initAnimatedValues = (width, height) => {
    const particlesArray = [];
    for (let i = 0;i < particlesCount;i++) {
      particlesArray.push({
        id: i,
        animatedValue: new Animated.Value(1),
        x: Math.random() * width,
        y: Math.random() * height,
        size: random(particlesSize, particlesSize * 2),
      });
    }
    return particlesArray;
  };

  const startAllValues = (particlesArray) => {
    particlesArray.map((particle) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(particle.animatedValue, {
            toValue: 0,
            delay: random(0, particlesLifeTime),
            duration: random(particlesLifeTime, particlesLifeTime * 2),
            useNativeDriver: true,
            easing,
          }),
          Animated.timing(particle.animatedValue, {
            toValue: 1,
            duration: random(particlesLifeTime / 2, particlesLifeTime),
            useNativeDriver: true,
            easing,
          })
        ])
      );
      loop.start();
      return {
        ...particle,
        loop,
      };
    });
  };

  const stopAllValues = () => {
    particles?.forEach((particle) => {
      particle?.animatedValue?.stop();
    });
  };

  return (
    <Animated.View onLayout={onLayout} style={{ ...StyleSheet.absoluteFillObject }}>
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={{
            ...styles.particle,
            top: particle.y,
            left: particle.x,
            backgroundColor: particlesColor,
            transform: [{ scale: particle.animatedValue }, { translateX: Animated.multiply(particle.animatedValue, 10) }, { translateY: Animated.multiply(particle.animatedValue, -10) }],
            opacity: particle.animatedValue,
          }}
        />
      ))}
    </Animated.View>
  );
};

export default ParticleEmitter;

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
