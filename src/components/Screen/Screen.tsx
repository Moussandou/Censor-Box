import { useState, useEffect, useRef } from 'react';
import { useGameLoop, DIFFICULTIES } from '../../lib/gameEngine';
import type { WordItem } from '../../lib/gameEngine';
import './Screen.css';

type MenuState = 'main' | 'difficulty' | 'game';

interface ScreenProps {
    onInputRef?: (callback: (keyId: number) => void) => void;
}

export const Screen = ({ onInputRef }: ScreenProps) => {
    const [menuState, setMenuState] = useState<MenuState>('main');
    const [difficulty, setDifficulty] = useState<string>('normal');

    const { words, currentIndex, score, lives, maxLives, timeLeft, gameOver, handleInput } = useGameLoop(
        menuState === 'game',
        difficulty
    );
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (onInputRef && menuState === 'game') {
            onInputRef(handleInput);
        }
    }, [handleInput, onInputRef, menuState]);

    useEffect(() => {
        if (containerRef.current) {
            const currentEl = containerRef.current.querySelector('.word-item.status-current');
            if (currentEl) {
                currentEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }
    }, [currentIndex]);

    const handleSelectDifficulty = (diff: string) => {
        setDifficulty(diff);
        setMenuState('game');
    };

    const handleBackToMenu = () => {
        setMenuState('main');
    };

    const currentWord = words[currentIndex];

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderLives = () => {
        const hearts = [];
        for (let i = 0; i < maxLives; i++) {
            hearts.push(
                <span key={i} className={`heart ${i < lives ? 'active' : 'empty'}`}>
                    ♥
                </span>
            );
        }
        return hearts;
    };

    // Main Menu
    if (menuState === 'main') {
        return (
            <div className="screen-container">
                <div className="scanlines"></div>
                <div className="vignette"></div>

                <div className="menu-screen">
                    <div className="menu-logo">CENSOR</div>
                    <div className="menu-logo-sub">BOX</div>

                    <div className="menu-options main-menu">
                        <button className="menu-btn primary" onClick={() => setMenuState('difficulty')}>
                            START
                        </button>
                    </div>

                    <div className="menu-footer">
                        PRESS START TO BEGIN
                    </div>
                </div>
            </div>
        );
    }

    // Difficulty Selection
    if (menuState === 'difficulty') {
        return (
            <div className="screen-container">
                <div className="scanlines"></div>
                <div className="vignette"></div>

                <div className="menu-screen">
                    <div className="menu-title">SELECT DIFFICULTY</div>
                    <div className="menu-options">
                        {Object.entries(DIFFICULTIES).map(([key, config]) => (
                            <button
                                key={key}
                                className={`menu-btn difficulty-${key}`}
                                onClick={() => handleSelectDifficulty(key)}
                            >
                                <span className="difficulty-name">{config.name}</span>
                                <span className="difficulty-desc">{config.description}</span>
                            </button>
                        ))}
                    </div>
                    <button className="menu-btn back-btn" onClick={handleBackToMenu}>
                        BACK
                    </button>
                </div>
            </div>
        );
    }

    // Game Screen
    return (
        <div className="screen-container">
            <div className="scanlines"></div>
            <div className="vignette"></div>

            <div className="os-interface">
                <div className="os-header">
                    <span className="lives">
                        {renderLives()}
                    </span>
                    <span className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className="score">{score}</span>
                </div>

                <div className="document-area" ref={containerRef}>
                    <div className="document-flow">
                        {words.map((word: WordItem, index: number) => {
                            let statusClass = '';
                            if (index === currentIndex) statusClass = 'status-current';
                            else if (word.status === 'censored') statusClass = 'status-censored';
                            else if (word.status === 'missed') statusClass = 'status-missed';

                            return (
                                <span key={word.id} className={`word-item ${statusClass}`}>
                                    {word.status === 'censored' ? '█'.repeat(word.text.length) : word.text}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="os-footer">
                    <div className="status-block">
                        {currentWord && <span>SIZE: {currentWord.category}</span>}
                    </div>
                    <div className="progress-block">
                        {currentIndex + 1}/{words.length}
                    </div>
                </div>

                {gameOver && (
                    <div className="game-over">
                        <div className="game-over-title">
                            {lives <= 0 ? 'NO LIVES' : timeLeft <= 0 ? 'TIME UP' : 'DONE'}
                        </div>
                        <div className="game-over-score">SCORE: {score}</div>
                        <button onClick={handleBackToMenu} className="restart-btn">
                            MENU
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
