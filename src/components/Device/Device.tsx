import { useRef, useCallback, useState, useEffect } from 'react';
import { Screen } from '../Screen/Screen';
import { Keyboard } from '../Keyboard/Keyboard';
import './Device.css';

export const Device = () => {
    const inputHandlerRef = useRef<((keyId: number) => void) | null>(null);
    const [resetKey, setResetKey] = useState(0);
    // Initialize mute state from localStorage
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('gameMuted');
        return saved ? JSON.parse(saved) : false;
    });
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element for background music
        audioRef.current = new Audio('/src/assets/Investigation Music Background  Suspenseful Tension Criminal Background Music Royalty Free.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        // Apply initial mute state
        audioRef.current.muted = isMuted;

        // Autoplay on first interaction
        const startMusic = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(() => {
                    // Autoplay blocked, will play on next interaction
                });
            }
            document.removeEventListener('click', startMusic);
            document.removeEventListener('keydown', startMusic);
        };

        document.addEventListener('click', startMusic);
        document.addEventListener('keydown', startMusic);

        return () => {
            document.removeEventListener('click', startMusic);
            document.removeEventListener('keydown', startMusic);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []); // Empty dependency array - mostly for initial setup

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
        localStorage.setItem('gameMuted', JSON.stringify(isMuted));
    }, [isMuted]);

    const handleKeyPress = useCallback((keyId: number) => {
        if (inputHandlerRef.current) {
            inputHandlerRef.current(keyId);
        }
    }, []);

    const setInputHandler = useCallback((handler: (keyId: number) => void) => {
        inputHandlerRef.current = handler;
    }, []);

    const handleReset = () => {
        setResetKey(prev => prev + 1);
    };

    const toggleMute = () => {
        setIsMuted((prev: boolean) => !prev);
    };

    return (
        <div className="scene">
            <div className="ambient-files">
                <div className="file f1">TOP SECRET</div>
                <div className="file f2">CASE #8921</div>
                <div className="file f3">EVIDENCE</div>
            </div>

            <div className="rdctd-console">
                <div className="console-body">

                    <div className="brand-header">
                        <img src="/src/assets/logo.png" alt="" className="brand-logo" />
                        <span className="brand-text">CENSOR BOX <span className="tm">™</span></span>
                        <button
                            className="control-keycap kbc-button kbc-button-dark"
                            onClick={toggleMute}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? '✕' : '♪'}
                        </button>
                        <button
                            className="control-keycap kbc-button kbc-button-dark"
                            onClick={handleReset}
                            title="Restart"
                        >
                            ↺
                        </button>
                    </div>

                    <div className="screen-housing">
                        <Screen key={resetKey} onInputRef={setInputHandler} />
                        <div className="screen-glare"></div>
                    </div>

                    <div className="control-deck">
                        <Keyboard onKeyPress={handleKeyPress} />
                    </div>
                </div>

                {/* 3D Sides/Thickness */}
                <div className="chassis-side left"></div>
                <div className="chassis-side right"></div>
                <div className="chassis-side bottom"></div>
                <div className="chassis-side top"></div>
            </div>
        </div>
    );
};
