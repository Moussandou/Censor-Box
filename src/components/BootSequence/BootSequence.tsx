import { useState, useEffect } from 'react';
import './BootSequence.css';

interface BootSequenceProps {
    onComplete: () => void;
}

export const BootSequence = ({ onComplete }: BootSequenceProps) => {
    const [userText, setUserText] = useState("");
    const [passText, setPassText] = useState("");
    const [stage, setStage] = useState<'user' | 'pass' | 'auth' | 'success'>('user');

    // Auth Data
    const TARGET_USER = "AGENT_K";
    const TARGET_PASS = "********"; // Visual representation of password

    useEffect(() => {
        // Typing USERNAME
        if (stage === 'user') {
            if (userText.length < TARGET_USER.length) {
                const timeout = setTimeout(() => {
                    setUserText(TARGET_USER.substring(0, userText.length + 1));
                }, 40 + Math.random() * 30); // MUCH FASTER typing
                return () => clearTimeout(timeout);
            } else {
                // User finished, wait a bit then move to PASS
                const timeout = setTimeout(() => setStage('pass'), 200);
                return () => clearTimeout(timeout);
            }
        }

        // Typing PASSWORD
        if (stage === 'pass') {
            if (passText.length < TARGET_PASS.length) {
                const timeout = setTimeout(() => {
                    setPassText(TARGET_PASS.substring(0, passText.length + 1));
                }, 40 + Math.random() * 30);
                return () => clearTimeout(timeout);
            } else {
                // Pass finished, wait then AUTH
                const timeout = setTimeout(() => setStage('auth'), 200);
                return () => clearTimeout(timeout);
            }
        }

        // AUTHENTICATING
        if (stage === 'auth') {
            const timeout = setTimeout(() => setStage('success'), 600);
            return () => clearTimeout(timeout);
        }

        // SUCCESS -> COMPLETE
        if (stage === 'success') {
            const timeout = setTimeout(onComplete, 800);
            return () => clearTimeout(timeout);
        }

    }, [stage, userText, passText, onComplete]);

    return (
        <div className="boot-sequence auth-mode">
            <div className="auth-container">
                <div className="auth-header">
                    SECURE LOGIN V.3.1
                </div>

                <div className="auth-form">
                    <div className="input-group">
                        <label>IDENTITY:</label>
                        <div className="input-field">
                            {userText}
                            {stage === 'user' && <span className="cursor-blink">_</span>}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>PASSPHRASE:</label>
                        <div className="input-field">
                            {/* Mask password or show * */}
                            {passText}
                            {stage === 'pass' && <span className="cursor-blink">_</span>}
                        </div>
                    </div>
                </div>

                <div className="auth-status">
                    {stage === 'auth' && <span className="blink-text">AUTHENTICATING...</span>}
                    {stage === 'success' && <span className="success-text">ACCESS GRANTED</span>}
                </div>
            </div>

            <div className="scanlines"></div>
            <div className="vignette"></div>
            <div className="noise"></div>
        </div>
    );
};
