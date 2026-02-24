import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { ZoomIn, FadeOut, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useFridgeStore } from './store';

export default function Fridge() {
    const router = useRouter();
    const items = useFridgeStore();

    const handlePressFridge = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/add-food');
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>&larr; Return</Text>
            </Pressable>

            <View style={styles.header}>
                <Text style={styles.title}>Digital Fridge</Text>
                <Text style={styles.subtext}>Tap the fridge to manage inventory.</Text>
            </View>

            <View style={styles.fridgeContainerOuter}>
                <Pressable style={styles.fridgeContainer} onPress={handlePressFridge}>
                    {/* @ts-ignore */}
                    <Animated.View sharedTransitionTag="fridge-view" style={styles.fridgeDoor}>
                        <View style={styles.handle} />

                        <View style={styles.shelvesContainer}>
                            {/* Top Shelf */}
                            <View style={styles.shelf}>
                                {items.slice(0, 4).map(item => <ItemBlock key={item.id} item={item} />)}
                            </View>
                            <View style={styles.shelfLine} />

                            {/* Middle Shelf */}
                            <View style={styles.shelf}>
                                {items.slice(4, 8).map(item => <ItemBlock key={item.id} item={item} />)}
                            </View>
                            <View style={styles.shelfLine} />

                            {/* Middle Low Shelf */}
                            <View style={styles.shelf}>
                                {items.slice(8, 12).map(item => <ItemBlock key={item.id} item={item} />)}
                            </View>
                            <View style={styles.shelfLine} />

                            {/* Drawer (Bottom) */}
                            <View style={styles.shelfBottom}>
                                {items.slice(12, 16).map(item => <ItemBlock key={item.id} item={item} />)}
                            </View>
                        </View>
                    </Animated.View>
                </Pressable>
            </View>
        </View>
    );
}

function ItemBlock({ item }: any) {
    // Height and width scaled dynamically based on weight/density assigned during input
    const getHeight = () => item.weightId === 3 ? 55 : item.weightId === 2 ? 40 : 25;
    const getWidth = () => item.weightId === 3 ? 45 : item.weightId === 2 ? 35 : 25;

    return (
        <Animated.View
            layout={Layout.springify().damping(24).stiffness(90)}
            entering={ZoomIn.duration(400)}
            exiting={FadeOut.duration(200)}
            style={[
                styles.item,
                {
                    height: getHeight(),
                    width: getWidth(),
                    backgroundColor: item.color
                }
            ]}
        >
            {/* Adds internal block texture indicating physical substance */}
            <View style={styles.itemGlare} />
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
    header: {
        marginBottom: 60,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -1,
    },
    subtext: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
        fontWeight: '500'
    },
    fridgeContainerOuter: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 40,
    },
    fridgeContainer: {
        width: '90%',
        height: '100%',
        backgroundColor: '#0A0A0A',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#262626',
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 10 },
    },
    fridgeDoor: {
        flex: 1,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#111',
        padding: 12,
        justifyContent: 'flex-end',
        backgroundColor: '#0D0D0D'
    },
    handle: {
        position: 'absolute',
        left: 14,
        top: '30%',
        width: 10,
        height: 120,
        backgroundColor: '#2A2A2A',
        borderRadius: 6,
        zIndex: 10,
        borderRightWidth: 1,
        borderColor: '#444'
    },
    shelvesContainer: {
        flex: 1,
        marginLeft: 32, // clear space for handle
        justifyContent: 'space-evenly',
        paddingVertical: 12,
    },
    shelfLine: {
        height: 6,
        backgroundColor: '#1C1C1C',
        borderRadius: 3,
        marginVertical: 4,
        shadowColor: '#000',
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
    },
    shelf: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
        paddingHorizontal: 12,
    },
    shelfBottom: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
        paddingHorizontal: 12,
        backgroundColor: '#111', // crisp drawer area
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#1F1F1F',
        marginTop: 10,
        paddingBottom: 8,
    },
    item: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    itemGlare: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30%',
        backgroundColor: 'rgba(255,255,255,0.04)',
    }
});
