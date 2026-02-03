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
        wordCount: 15,
        description: '5 vies • 15 mots'
    },
    normal: {
        name: 'NORMAL',
        lives: 3,
        time: 60,
        wordCount: 30,
        description: '3 vies • 30 mots'
    },
    hard: {
        name: 'HARD',
        lives: 2,
        time: 40,
        wordCount: 50,
        description: '2 vies • 50 mots'
    }
};

export const useGameLoop = (active: boolean, difficulty: string = 'normal', resetKey: number = 0) => {
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

    // Initialize or restart on resetKey change
    useEffect(() => {
        if (active) {
            initializeGame();
        }
    }, [active, resetKey, initializeGame]);

    const handleInput = useCallback((keyId: number) => {
        if (gameOver || !active) return;

        const idx = currentIndexRef.current;
        const currentWord = words[idx];

        // Guard: If logic is desynced or word missing
        if (!currentWord || currentWord.status !== 'current') return;

        sounds.keyPress();

        let newStatus: WordItem['status'] = 'pending';
        let isCorrect = false;
        let isSkip = false;

        // Game Logic Decision
        if (keyId === 5) {
            newStatus = 'pending'; // Skipped words stay pending? or 'missed'? Original was 'pending'
            isSkip = true;
        } else if (currentWord.category === keyId) {
            newStatus = 'censored';
            isCorrect = true;
        } else {
            newStatus = 'missed';
            isCorrect = false;
        }

        // Apply Side Effects (Score, Lives, Sounds)
        if (isSkip) {
            sounds.skip();
            // No score/life change on skip?
        } else if (isCorrect) {
            setScore(s => s + 10);
            sounds.correct();
        } else {
            setLives(l => l - 1);
            sounds.wrong();
        }

        // Update Words State
        setWords(prev => {
            const newWords = [...prev];
            newWords[idx] = { ...newWords[idx], status: newStatus };

            // Set next word to current
            const nextIndex = idx + 1;
            if (nextIndex < newWords.length) {
                newWords[nextIndex] = { ...newWords[nextIndex], status: 'current' };
            }
            return newWords;
        });

        // Advance Index
        const nextIndex = idx + 1;
        if (nextIndex < words.length) {
            setCurrentIndex(nextIndex);
            currentIndexRef.current = nextIndex;
        } else {
            setGameOver(true);
            sounds.gameOver();
        }
    }, [gameOver, active, words]); // Added 'words' dependency

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
