import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import Animated, { FadeInUp, Layout, ZoomOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { addFridgeItem, useFridgeStore, removeFridgeItem } from './store';

export default function AddFood() {
    const router = useRouter();
    const items = useFridgeStore();
    const [name, setName] = useState('');

    const submitFood = () => {
        if (!name.trim()) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // aesthetics
        const randomWeight = Math.floor(Math.random() * 3) + 1; // 1 to 3
        const colors = ['#2C2C2E', '#3A3A3C', '#242426', '#1C2C24', '#2C1C1C', '#1B2A1B', '#2A261A'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        addFridgeItem({
            name: name.trim(),
            weightId: randomWeight,
            color: randomColor
        });
        setName('');
    };

    return (
        // @ts-ignore
        <Animated.View sharedTransitionTag="fridge-view" style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>&larr; Back to Fridge</Text>
            </Pressable>

            <Text style={styles.title}>Inventory Manager</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Greek Yogurt..."
                    placeholderTextColor="#555"
                    value={name}
                    onChangeText={setName}
                    autoFocus={false}
                    onSubmitEditing={submitFood}
                />
                <Pressable style={styles.addButton} onPress={submitFood}>
                    <Text style={styles.addButtonText}>ADD</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.listContainer}>
                {items.map((item, i) => (
                    <Animated.View
                        key={item.id}
                        layout={Layout.springify().damping(24).stiffness(90)}
                        entering={FadeInUp.delay(i * 50).duration(400)}
                        exiting={ZoomOut.duration(200)}
                        style={styles.listItem}
                    >
                        <View style={styles.itemMeta}>
                            <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                            <Text style={styles.listText}>{item.name}</Text>
                        </View>
                        <Pressable hitSlop={10} onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            removeFridgeItem(item.id);
                        }}>
                            <Text style={styles.deleteText}>DEL</Text>
                        </Pressable>
                    </Animated.View>
                ))}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
        paddingTop: 80,
        paddingHorizontal: 24
    },
    backButton: {
        marginBottom: 32
    },
    backText: {
        color: '#888',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600'
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 32,
        letterSpacing: -1,
    },
    inputContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 40
    },
    input: {
        flex: 1,
        height: 54,
        backgroundColor: '#111',
        borderRadius: 12,
        paddingHorizontal: 16,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#222'
    },
    addButton: {
        height: 54,
        paddingHorizontal: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addButtonText: {
        color: '#000',
        fontWeight: '800',
        fontSize: 14,
        letterSpacing: 1
    },
    listContainer: {
        flex: 1,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0C0C0C',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1A1A1A',
        marginBottom: 12,
    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 16
    },
    listText: {
        color: '#E0E0E0',
        fontSize: 16,
        fontWeight: '600'
    },
    deleteText: {
        color: '#802323',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1
    },
});
