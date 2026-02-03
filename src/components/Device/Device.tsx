import { useRef, useCallback } from 'react';
import { Screen } from '../Screen/Screen';
import { Keyboard } from '../Keyboard/Keyboard';
import './Device.css';

export const Device = () => {
    const inputHandlerRef = useRef<((keyId: number) => void) | null>(null);

    const handleKeyPress = useCallback((keyId: number) => {
        if (inputHandlerRef.current) {
            inputHandlerRef.current(keyId);
        }
    }, []);

    const setInputHandler = useCallback((handler: (keyId: number) => void) => {
        inputHandlerRef.current = handler;
    }, []);

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
                    </div>

                    <div className="screen-housing">
                        <Screen onInputRef={setInputHandler} />
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
