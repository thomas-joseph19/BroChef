import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

const mockData = [
    { id: '1', title: 'Volume King', calories: 2450, prepTime: '35m' },
    { id: '2', title: 'Minimalist', calories: 2500, prepTime: '15m' },
    { id: '3', title: 'Protein Peak', calories: 2510, prepTime: '25m' },
    { id: '4', title: 'Carb Focus', calories: 2490, prepTime: '45m' },
    { id: '5', title: 'Balanced Day', calories: 2500, prepTime: '30m' },
];

export default function Swiper() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const swipeNext = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCurrentIndex((prev) => (prev + 1) % mockData.length);
        translateX.value = 0;
        translateY.value = 0;
    };

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                translateX.value = withTiming(Math.sign(event.translationX) * width * 1.5, { duration: 200 }, () => {
                    runOnJS(swipeNext)();
                });
            } else {
                translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
                translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotateZ: `${(translateX.value / width) * 15}deg` },
        ],
    }));

    const item = mockData[currentIndex];

    if (!item) {
        return (
            <View style={styles.container}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backText}>&larr; Return</Text>
                </Pressable>
                <Text style={{ color: 'white' }}>No more plans</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>&larr; Return</Text>
            </Pressable>

            <View style={styles.header}>
                <Text style={styles.title}>Blueprints</Text>
                <Text style={styles.subtext}>{currentIndex + 1} OF 5</Text>
            </View>

            <View style={styles.cardContainer}>
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.card, animatedStyle]}>
                        <Text style={styles.cardTitle}>{item.title}</Text>

                        <View style={styles.macroRow}>
                            <View style={styles.macroBox}>
                                <Text style={styles.macroValue}>{item.calories}</Text>
                                <Text style={styles.macroLabel}>KCAL</Text>
                            </View>
                            <View style={styles.macroBox}>
                                <Text style={styles.macroValue}>{item.prepTime}</Text>
                                <Text style={styles.macroLabel}>PREP</Text>
                            </View>
                        </View>

                        <View style={styles.details}>
                            <Text style={styles.instructionText}>
                                Generated via AI Constraint Solver.{"\n"}
                                Meals: 4x Solid, 1x Snack.
                            </Text>
                        </View>
                    </Animated.View>
                </GestureDetector>

                {/* Mock background card for depth */}
                <View style={styles.cardStackBackdrop} pointerEvents="none" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
        padding: 24,
        paddingTop: 80,
    },
    backButton: {
        marginBottom: 24,
    },
    backText: {
        color: '#888',
        fontSize: 16,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    header: {
        marginBottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -1,
    },
    subtext: {
        color: '#666',
        fontWeight: '600',
        letterSpacing: 1,
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardStackBackdrop: {
        position: 'absolute',
        width: width * 0.8,
        height: height * 0.55,
        backgroundColor: '#111',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#222',
        transform: [{ scale: 0.92 }, { translateY: 24 }],
        zIndex: -1,
    },
    card: {
        width: width * 0.85,
        height: height * 0.55,
        backgroundColor: '#1A1A1A',
        borderRadius: 24,
        padding: 32,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        justifyContent: 'space-between',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
    },
    macroBox: {},
    macroValue: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '600',
    },
    macroLabel: {
        color: '#888',
        fontSize: 12,
        letterSpacing: 2,
        marginTop: 4,
    },
    details: {
        marginTop: 'auto',
        paddingTop: 24,
        borderTopWidth: 1,
        borderColor: '#333',
    },
    instructionText: {
        color: '#999',
        lineHeight: 24,
        fontSize: 14,
    }
});
