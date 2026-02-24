import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function Home() {
    const router = useRouter();

    const handlePress = (route: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(route);
    };

    return (
        <View style={styles.container}>
            <Animated.Text entering={FadeInUp.duration(1000).springify().damping(24)} style={styles.title}>
                INTENTIONAL
            </Animated.Text>
            <Animated.Text entering={FadeInUp.delay(200).duration(1000).springify().damping(24)} style={styles.subtitle}>
                Macro Manager
            </Animated.Text>

            <View style={styles.menu}>
                <MenuButton title="The Daily Tracker" onPress={() => handlePress('/tracker')} delay={400} />
                <MenuButton title="The Visual Fridge" onPress={() => handlePress('/fridge')} delay={600} />
                <MenuButton title="Meal Plan Swiper" onPress={() => handlePress('/swiper')} delay={800} />
            </View>
        </View>
    );
}

function MenuButton({ title, onPress, delay }: { title: string; onPress: () => void; delay: number }) {
    return (
        <Animated.View entering={FadeInUp.delay(delay).duration(800).springify().damping(20)}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 16,
        color: '#888888',
        letterSpacing: 1,
        marginTop: 8,
        marginBottom: 60,
        textTransform: 'uppercase',
    },
    menu: {
        gap: 16,
    },
    button: {
        backgroundColor: '#151515',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#222222',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});
