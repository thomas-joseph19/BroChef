import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

// constants
const MAX_CALS = 2500;
const MAX_P = 180;
const MAX_C = 200;
const MAX_F = 80;
const TANK_HEIGHT = 280;

type MacroLog = {
    id: string;
    cals: number;
    p: number;
    c: number;
    f: number;
};

export default function Tracker() {
    const router = useRouter();
    const [logs, setLogs] = useState<MacroLog[]>([]);

    const addLog = (cals: number, p: number, c: number, f: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setLogs(prev => [...prev, {
            id: Math.random().toString(),
            cals, p, c, f
        }]);
    };

    const runAddMeal = () => addLog(500, 45, 50, 15);
    const runAddSnack = () => addLog(250, 20, 25, 8);

    const TankBox = ({ type, color, maxValue, title, width, unit }: any) => {
        const totalAmount = logs.reduce((sum, log) => sum + (log as any)[type], 0);
        return (
            <View style={styles.tankWrapper}>
                <Text style={styles.tankTitle}>{title}</Text>
                <View style={[styles.tank, { width, height: TANK_HEIGHT }]}>
                    {logs.length === 0 && (
                        <View style={styles.emptyPlaceholder}>
                            <Text style={styles.emptyText}>-</Text>
                        </View>
                    )}
                    {logs.map((log) => {
                        const amount = (log as any)[type];
                        const blockHeight = Math.max((amount / maxValue) * TANK_HEIGHT, 4); // min height
                        return (
                            <Animated.View
                                key={log.id}
                                entering={FadeInUp.duration(400).springify().damping(24).stiffness(90)}
                                layout={LinearTransition.springify().damping(24).stiffness(90)}
                                style={[
                                    styles.block,
                                    { backgroundColor: color, height: blockHeight }
                                ]}
                            />
                        );
                    })}
                </View>
                <Text style={styles.tankValue}>{totalAmount}{unit}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>&larr; Return</Text>
            </Pressable>

            <View style={styles.header}>
                <Text style={styles.title}>Daily Intakes</Text>
                <Text style={styles.limitText}>Target: 2500 kcal</Text>
            </View>

            <View style={styles.tanksContainer}>
                <TankBox type="cals" color="#EEEEEE" maxValue={MAX_CALS} title="CALS" width={80} unit="" />

                <View style={styles.macroTanks}>
                    <TankBox type="p" color="#B33030" maxValue={MAX_P} title="PRO" width={40} unit="g" />
                    <TankBox type="c" color="#E1A22C" maxValue={MAX_C} title="CRB" width={40} unit="g" />
                    <TankBox type="f" color="#2A6B4F" maxValue={MAX_F} title="FAT" width={40} unit="g" />
                </View>
            </View>

            <View style={styles.controls}>
                <Pressable style={styles.controlButton} onPress={runAddMeal}>
                    <Text style={styles.controlText}>+ Log Meal</Text>
                </Pressable>
                <Pressable style={styles.controlButton} onPress={runAddSnack}>
                    <Text style={styles.controlText}>+ Log Snack</Text>
                </Pressable>
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
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600'
    },
    header: {
        marginBottom: 40,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -1,
    },
    limitText: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
        fontWeight: '500'
    },
    tanksContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    macroTanks: {
        flexDirection: 'row',
        gap: 16,
    },
    tankWrapper: {
        alignItems: 'center',
    },
    tankTitle: {
        color: '#555',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 12,
    },
    tank: {
        backgroundColor: '#0E0E0E',
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 8,
        overflow: 'hidden',
        flexDirection: 'column-reverse',
        paddingHorizontal: 2,
        paddingBottom: 2,
        gap: 2,
    },
    block: {
        width: '100%',
        borderRadius: 4,
        opacity: 0.95,
    },
    emptyPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#333',
        fontWeight: '800',
    },
    tankValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 12,
        letterSpacing: 0.5,
    },
    controls: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
        marginBottom: 30,
    },
    controlButton: {
        flex: 1,
        backgroundColor: '#111',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#222',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    controlText: {
        color: '#ddd',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    }
});
