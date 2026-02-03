import { useEffect, useRef } from 'react';
import { useGameLoop } from '../../lib/gameEngine';
import type { WordItem } from '../../lib/gameEngine';
import './Screen.css';

interface ScreenProps {
    onInputRef?: (callback: (keyId: number) => void) => void;
}

export const Screen = ({ onInputRef }: ScreenProps) => {
    const { words, currentIndex, score, gameOver, handleInput, restartGame } = useGameLoop(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (onInputRef) {
            onInputRef(handleInput);
        }
    }, [handleInput, onInputRef]);

    useEffect(() => {
        if (containerRef.current) {
            const currentEl = containerRef.current.querySelector('.word-item.status-current');
            if (currentEl) {
                currentEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }
    }, [currentIndex]);

    // Get current word for display
    const currentWord = words[currentIndex];

    return (
        <div className="screen-container">
            <div className="scanlines"></div>
            <div className="vignette"></div>

            <div className="os-interface">
                <div className="os-header">
                    <span>CLEARANCE: LEVEL 5</span>
                    <span className="os-clock">SCORE: {score}</span>
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
                    <div className="score-block">
                        {currentIndex + 1} / {words.length}
                    </div>
                </div>

                {gameOver && (
                    <div className="game-over">
                        <div>DOCUMENT PROCESSED</div>
                        <div>FINAL SCORE: {score}</div>
                        <button onClick={restartGame} className="restart-btn">NEW DOCUMENT</button>
                    </div>
                )}
            </div>
        </div>
    );
};
