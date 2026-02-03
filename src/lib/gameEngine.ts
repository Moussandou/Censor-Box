import { useState, useEffect, useCallback, useRef } from 'react';
import { generateText, getWordCategory } from './words';
import { sounds } from './sounds';

export interface WordItem {
    id: string;
    text: string;
    category: number;
    status: 'pending' | 'censored' | 'missed' | 'current';
}

export interface DifficultyConfig {
    name: string;
    lives: number;
    time: number;
    wordCount: number;
    description: string;
}

export const DIFFICULTIES: Record<string, DifficultyConfig> = {
    easy: {
        name: 'EASY',
        lives: 5,
        time: 90,
        wordCount: 30,
        description: '5 vies • 90 sec'
    },
    normal: {
        name: 'NORMAL',
        lives: 3,
        time: 60,
        wordCount: 50,
        description: '3 vies • 60 sec'
    },
    hard: {
        name: 'HARD',
        lives: 2,
        time: 40,
        wordCount: 70,
        description: '2 vies • 40 sec'
    }
};

export const useGameLoop = (active: boolean, difficulty: string = 'normal') => {
    const config = DIFFICULTIES[difficulty] || DIFFICULTIES.normal;

    const [words, setWords] = useState<WordItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(config.lives);
    const [timeLeft, setTimeLeft] = useState(config.time);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const currentIndexRef = useRef(currentIndex);
    currentIndexRef.current = currentIndex;

    const timerRef = useRef<number | null>(null);

    const initializeGame = useCallback(() => {
        const initialText = generateText(config.wordCount);
        setWords(initialText.map((text, i) => ({
            id: `word-${i}`,
            text,
            category: getWordCategory(text),
            status: i === 0 ? 'current' : 'pending'
        })));
        setCurrentIndex(0);
        currentIndexRef.current = 0;
        setScore(0);
        setLives(config.lives);
        setTimeLeft(config.time);
        setGameOver(false);
        setGameStarted(true);
        sounds.start();
    }, [config]);

    // Timer effect
    useEffect(() => {
        if (gameStarted && !gameOver && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameOver(true);
                        sounds.gameOver();
                        return 0;
                    }
                    if (prev <= 10) {
                        sounds.tick();
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [gameStarted, gameOver, timeLeft]);

    // Check for game over
    useEffect(() => {
        if (lives <= 0 && !gameOver) {
            setGameOver(true);
            sounds.gameOver();
        }
    }, [lives, gameOver]);

    // Initialize
    useEffect(() => {
        if (active && words.length === 0) {
            initializeGame();
        }
    }, [active, words.length, initializeGame]);

    const handleInput = useCallback((keyId: number) => {
        if (gameOver || !active) return;

        sounds.keyPress();
        const idx = currentIndexRef.current;

        setWords(prev => {
            const newWords = [...prev];
            const currentWord = newWords[idx];

            if (!currentWord || currentWord.status !== 'current') return prev;

            if (keyId === 5) {
                newWords[idx] = { ...currentWord, status: 'pending' };
                sounds.skip();
            } else if (currentWord.category === keyId) {
                newWords[idx] = { ...currentWord, status: 'censored' };
                setScore(s => s + 10);
                sounds.correct();
            } else {
                newWords[idx] = { ...currentWord, status: 'missed' };
                setLives(l => l - 1);
                sounds.wrong();
            }

            const nextIndex = idx + 1;
            if (nextIndex < newWords.length) {
                newWords[nextIndex] = { ...newWords[nextIndex], status: 'current' };
                setCurrentIndex(nextIndex);
                currentIndexRef.current = nextIndex;
            } else {
                setGameOver(true);
                sounds.gameOver();
            }

            return newWords;
        });
    }, [gameOver, active]);

    return {
        words,
        currentIndex,
        score,
        lives,
        maxLives: config.lives,
        timeLeft,
        gameOver,
        handleInput,
        restartGame: initializeGame
    };
};
