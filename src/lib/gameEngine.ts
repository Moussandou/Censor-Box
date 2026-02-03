import { useState, useEffect, useCallback, useRef } from 'react';
import { generateText, getWordCategory } from './words';

export interface WordItem {
    id: string;
    text: string;
    category: number; // 1-4
    status: 'pending' | 'censored' | 'missed' | 'current';
}

export const useGameLoop = (active: boolean) => {
    const [words, setWords] = useState<WordItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Use ref for current index to avoid stale closure
    const currentIndexRef = useRef(currentIndex);
    currentIndexRef.current = currentIndex;

    const initializeGame = useCallback(() => {
        const initialText = generateText(30);
        setWords(initialText.map((text, i) => ({
            id: `word-${i}`,
            text,
            category: getWordCategory(text),
            status: i === 0 ? 'current' : 'pending'
        })));
        setCurrentIndex(0);
        currentIndexRef.current = 0;
        setScore(0);
        setGameOver(false);
    }, []);

    // Initialize
    useEffect(() => {
        if (active && words.length === 0) {
            initializeGame();
        }
    }, [active, words.length, initializeGame]);

    const handleInput = useCallback((keyId: number) => {
        if (gameOver || !active) return;

        const idx = currentIndexRef.current;

        setWords(prev => {
            const newWords = [...prev];
            const currentWord = newWords[idx];

            if (!currentWord || currentWord.status !== 'current') return prev;

            if (keyId === 5) {
                // SKIP - just move to next
                newWords[idx] = { ...currentWord, status: 'pending' };
            } else if (currentWord.category === keyId) {
                // Correct
                newWords[idx] = { ...currentWord, status: 'censored' };
                setScore(s => s + 10);
            } else {
                // Incorrect
                newWords[idx] = { ...currentWord, status: 'missed' };
                setScore(s => Math.max(0, s - 5));
            }

            // Advance
            const nextIndex = idx + 1;
            if (nextIndex < newWords.length) {
                newWords[nextIndex] = { ...newWords[nextIndex], status: 'current' };
                setCurrentIndex(nextIndex);
                currentIndexRef.current = nextIndex;
            } else {
                setGameOver(true);
            }

            return newWords;
        });
    }, [gameOver, active]);

    return {
        words,
        currentIndex,
        score,
        gameOver,
        handleInput,
        restartGame: initializeGame
    };
};
