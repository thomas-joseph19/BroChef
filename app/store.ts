import { useState, useEffect } from 'react';

type FridgeItem = {
    id: string;
    name: string;
    weightId: number;
    color: string;
};

let items: FridgeItem[] = [
    { id: '1', name: 'Whey Protein', weightId: 3, color: '#2A2A2A' },
    { id: '2', name: 'Chicken Breast', weightId: 2, color: '#332A2A' },
    { id: '3', name: 'Spinach', weightId: 1, color: '#1B2A1B' },
    { id: '4', name: 'Oats', weightId: 3, color: '#2A261A' },
];

const listeners = new Set<() => void>();

export const addFridgeItem = (item: Omit<FridgeItem, 'id'>) => {
    items = [{ id: Math.random().toString(), ...item }, ...items];
    listeners.forEach(l => l());
};

export const removeFridgeItem = (id: string) => {
    items = items.filter(item => item.id !== id);
    listeners.forEach(l => l());
};

export const useFridgeStore = () => {
    const [state, setState] = useState(items);
    useEffect(() => {
        const l = () => setState(items);
        listeners.add(l);
        return () => {
            listeners.delete(l);
        };
    }, []);
    return state;
};
