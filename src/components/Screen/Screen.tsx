import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
    const [gameKey, setGameKey] = useState(0); // Key to force game restart

    const { words, currentIndex, score, lives, timeLeft, gameOver, handleInput } = useGameLoop(
        menuState === 'game',
        difficulty,
        gameKey
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const flowRef = useRef<HTMLDivElement>(null);

    // Bind input handler
    useEffect(() => {
        if (menuState === 'game') {
            onInputRef && onInputRef(handleInput);
        } else {
            // When in menu, we handle input locally if needed or ignore
            onInputRef && onInputRef(() => { });
        }
    }, [handleInput, onInputRef, menuState]);

    // Carousel logic: scroll/transform document flow to center current word
    useEffect(() => {
        if (containerRef.current && flowRef.current) {
            const currentEl = flowRef.current.querySelector('.word-item.status-current') as HTMLElement;

            if (currentEl) {
                const container = containerRef.current;
                const flow = flowRef.current;

                // Carousel logic: move the flow container so the current element is centered
                const containerWidth = container.clientWidth;
                const elLeft = currentEl.offsetLeft;
                const elWidth = currentEl.offsetWidth;

                // Calculate position to center the element
                // We want: elLeft + translateX = containerWidth/2 - elWidth/2
                // So: translateX = (containerWidth/2 - elWidth/2) - elLeft
                const translateX = (containerWidth / 2) - (elWidth / 2) - elLeft;

                flow.style.transform = `translateX(${translateX}px)`;
            }
        }
    }, [currentIndex, words]);

    const handleSelectDifficulty = (diff: string) => {
        setDifficulty(diff);
        setGameKey(prev => prev + 1); // Force restart
        setMenuState('game');
    };

    const handleBackToMenu = () => {
        setMenuState('main');
    };

    const handleRetry = () => {
        setGameKey(prev => prev + 1); // Force restart with same difficulty
        setMenuState('game');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderLives = () => {
        const hearts = [];
        for (let i = 0; i < lives; i++) {
            hearts.push(
                <img key={i} src="/src/assets/heart.png" alt="HP" className="heart-asset" />
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
        <div className="screen-container" key={gameKey}>
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
                    <div className="document-flow" ref={flowRef}>
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
                        {(words[currentIndex]) && <span>SIZE: {words[currentIndex].category}</span>}
                    </div>
                    <div className="progress-block">
                        {currentIndex + 1}/{words.length}
                    </div>
                </div>

                {gameOver && (
                    <div className="game-over">
                        {lives > 0 && timeLeft > 0 ? (
                            <div className="win-screen">
                                <div className="win-status">
                                    <div className="win-title">MISSION COMPLETE</div>
                                    <div className="game-over-score">SCORE: {score}</div>
                                </div>
                                {createPortal(
                                    <div className="win-document-modal">
                                        <button className="close-modal-btn" onClick={(e) => {
                                            const modal = (e.target as HTMLElement).closest('.win-document-modal');
                                            modal?.classList.add('closed');
                                        }}>×</button>
                                        <div className="win-document">
                                            <div className="win-doc-header">TOP SECRET</div>
                                            <div className="win-doc-id">CASE #8921</div>
                                            <div className="win-doc-body">
                                                <div className="redacted-line w-80"></div>
                                                <div className="redacted-line w-60"></div>
                                                <div className="redacted-line w-90"></div>
                                                <div className="redacted-line w-40"></div>
                                                <div className="redacted-line w-70"></div>
                                                <div className="redacted-line w-50"></div>
                                                <div className="redacted-line w-80"></div>
                                            </div>
                                            <div className="win-stamp">CENSORED</div>
                                        </div>
                                    </div>,
                                    document.body
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="game-over-title">
                                    {lives <= 0 ? 'NO LIVES' : 'TIME UP'}
                                </div>
                                <div className="game-over-score">SCORE: {score}</div>
                            </>
                        )}
                        <div className="game-over-buttons">
                            <button onClick={handleRetry} className="restart-btn">
                                RETRY
                            </button>
                            <button onClick={handleBackToMenu} className="restart-btn">
                                MENU
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
