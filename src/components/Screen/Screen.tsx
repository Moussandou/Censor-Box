import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useGameLoop, DIFFICULTIES } from '../../lib/gameEngine';
import type { WordItem } from '../../lib/gameEngine';
import { Github, Linkedin, FileUser, Instagram } from 'lucide-react';
import heartImg from '../../assets/heart.png';
import agentImg from '../../assets/moussandou.png';
import noteImg from '../../assets/paper-note.png';
import stampImg from '../../assets/confidential-stamp.png';
import fingerprintImg from '../../assets/fingerprints.png';
import './Screen.css';

type MenuState = 'main' | 'difficulty' | 'game' | 'credits' | 'tutorial';

interface ScreenProps {
    onInputRef?: (callback: (keyId: number) => void) => void;
}

export const Screen = ({ onInputRef }: ScreenProps) => {
    const [menuState, setMenuState] = useState<MenuState>('main');
    const [difficulty, setDifficulty] = useState<string>('normal');
    const [gameKey, setGameKey] = useState(0); // Key to force game restart
    const [debugWin, setDebugWin] = useState(false); // DEBUG: Force win screen

    const { words, currentIndex, score, lives, timeLeft, gameOver, handleInput } = useGameLoop(
        menuState === 'game' && !debugWin,
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
        setDebugWin(false);
    };

    const handleBackToMenu = () => {
        setMenuState('main');
        setDebugWin(false);
    };

    const handleRetry = () => {
        setGameKey(prev => prev + 1); // Force restart with same difficulty
        setMenuState('game');
        setDebugWin(false);
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
                <img key={i} src={heartImg} alt="HP" className="heart-asset" />
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
                    {/* Hidden debug trigger on double click of logo, or just click for now since dev mode */}
                    <div className="menu-logo" onClick={() => setDebugWin(true)} title="DEBUG: Instant Win" style={{ cursor: 'pointer' }}>CENSOR</div>
                    <div className="menu-logo-sub">BOX</div>

                    <div className="menu-options main-menu">
                        <button className="menu-btn primary" onClick={() => setMenuState('difficulty')}>
                            START
                        </button>
                        <button className="menu-btn" onClick={() => setMenuState('tutorial')}>
                            BRIEFING
                        </button>
                        <button className="menu-btn" onClick={() => setMenuState('credits')}>
                            CREDITS
                        </button>
                    </div>

                    <div className="menu-footer">
                        PRESS START TO BEGIN
                    </div>
                </div>
            </div>
        );
    }

    // Credits Screen
    if (menuState === 'credits') {
        return (
            <div className="screen-container">
                <div className="scanlines"></div>
                <div className="vignette"></div>

                <div className="menu-screen">
                    <div className="menu-title">PERSONNEL FILE</div>

                    <div className="credits-card">
                        <img src={agentImg} alt="Agent" className="agent-photo" />
                        <div className="agent-info">
                            <div className="agent-name">AGENT MOUSSANDOU</div>
                            <div className="agent-rank">FULL STACK DEVELOPER</div>
                        </div>

                        <div className="agent-links">
                            <a href="https://github.com/Moussandou" target="_blank" rel="noopener noreferrer" className="link-icon" title="Github">
                                <Github size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/moussandou/" target="_blank" rel="noopener noreferrer" className="link-icon" title="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://moussandou.github.io/Portfolio/" target="_blank" rel="noopener noreferrer" className="link-icon" title="Portfolio">
                                <FileUser size={20} />
                            </a>
                            <a href="https://www.instagram.com/takaxdev/" target="_blank" rel="noopener noreferrer" className="link-icon" title="Instagram">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <button className="menu-btn back-btn" onClick={handleBackToMenu}>
                        BACK
                    </button>
                </div>
            </div>
        );
    }

    // Tutorial Screen
    if (menuState === 'tutorial') {
        return (
            <div className="screen-container">
                <div className="scanlines"></div>
                <div className="vignette"></div>

                <div className="menu-screen tutorial-screen">
                    <div className="menu-title">MISSION PROTOCOLS</div>

                    <div className="tutorial-content">
                        <div className="tutorial-step">
                            <span className="step-num">01</span>
                            <div className="step-text">
                                <strong>IDENTIFY SUBJECT</strong><br />
                                Read the target word on screen.
                            </div>
                        </div>

                        <div className="tutorial-step">
                            <span className="step-num">02</span>
                            <div className="step-text">
                                <strong>ANALYZE LENGTH</strong><br />
                                Estimate character count.<br />
                                <span className="step-sub">Micro (1-3) | Small (4-5) | Med (6-8) | Large (9+)</span>
                            </div>
                        </div>

                        <div className="tutorial-step">
                            <span className="step-num">03</span>
                            <div className="step-text">
                                <strong>REDACT or SKIP</strong><br />
                                Press <strong>Key 1-4</strong> to censor matches.<br />
                                Press <strong>SPACE</strong> to SKIP uncertain targets.
                            </div>
                        </div>

                        <div className="tutorial-warning">
                            <span className="warning-icon">⚠</span>
                            <span>PRECISION REQUIRED. ERRORS WILL BE PENALIZED.</span>
                        </div>
                    </div>

                    <button className="menu-btn back-btn" onClick={handleBackToMenu}>
                        ACKNOWLEDGE
                    </button>
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
    const getStressClass = () => {
        if (lives <= 1) return 'stress-critical';
        if (timeLeft <= 10) return 'stress-warning';
        return '';
    };

    // Game Screen Logic (Win/Loss)
    // Modified to respect debugWin
    const effectiveGameOver = gameOver || debugWin;
    const isWin = (lives > 0 && timeLeft > 0) || debugWin;

    return (
        <div className={`screen-container ${getStressClass()}`} key={gameKey}>
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

                {effectiveGameOver && (
                    <div className="game-over">
                        {isWin ? (
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
                                            {/* Paper Background Image using note asset */}
                                            <img src={noteImg} alt="" className="doc-bg-asset" />

                                            {/* Fingerprint decorative overlay */}
                                            <img src={fingerprintImg} alt="" className="doc-fingerprint" />

                                            <div className="win-doc-content-wrapper">
                                                <div className="win-doc-header">
                                                    <div className="dept-seal">USG</div>
                                                    <div className="dept-name">INTELLIGENCE AGENCY</div>
                                                    <div className="classification-mark">TOP SECRET // NOFORN</div>
                                                </div>

                                                <div className="win-doc-body">
                                                    <div className="doc-date">DATE: {new Date().toLocaleDateString()}</div>
                                                    <div className="doc-subject">SUBJECT: OPERATION CENSOR BOX</div>

                                                    <div className="doc-text-block">
                                                        <span className="text-line">The following report contains</span>
                                                        <span className="redacted-chunk w-40"></span>
                                                        <span className="text-line">regarding the incident at</span>
                                                        <span className="redacted-chunk w-60"></span>
                                                        <span className="text-line">. Agent performance was rated as</span>
                                                        <span className="redacted-chunk w-30"></span>
                                                        <span className="text-line">exceptional.</span>
                                                    </div>

                                                    <div className="doc-signature-area">
                                                        <div className="signature-line">
                                                            <span className="sig-text">Director J. Edgar</span>
                                                        </div>
                                                        <div className="signature-label">DIRECTOR</div>
                                                    </div>
                                                </div>

                                                <img src={stampImg} alt="CONFIDENTIAL" className="win-stamp-asset" />
                                            </div>
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
