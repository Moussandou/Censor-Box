import { useEffect, useState } from 'react';
import './Keyboard.css';

interface KeyboardProps {
    onKeyPress?: (keyId: number) => void;
}

export const Keyboard = ({ onKeyPress }: KeyboardProps) => {
    const [activeKey, setActiveKey] = useState<number | null>(null);

    const handlePress = (id: number, e?: React.MouseEvent) => {
        // Remove focus from button after click
        if (e) {
            (e.target as HTMLButtonElement).blur();
        }

        setActiveKey(id);
        if (onKeyPress) onKeyPress(id);
        setTimeout(() => setActiveKey(null), 150);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return; // Ignore key repeat

            if (e.code === 'Space') {
                e.preventDefault();
                handlePress(5);
                return;
            }
            const keyMap: { [key: string]: number } = {
                '1': 1, '2': 2, '3': 3, '4': 4,
                'q': 1, 'w': 2, 'a': 4, 's': 3
            };
            if (keyMap[e.key]) {
                handlePress(keyMap[e.key]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onKeyPress]);

    return (
        <div className="pad-container">
            {/* Row 1: Small, Medium, Skip */}
            <div className="row">
                <div className="pad-slot area-k1">
                    <button
                        className={`kbc-button kbc-button-light ${activeKey === 1 ? 'active' : ''}`}
                        onClick={(e) => handlePress(1, e)}
                    >
                        <div className="bar-graphic"></div>
                    </button>
                </div>
                <div className="pad-slot area-k2">
                    <button
                        className={`kbc-button kbc-button-light ${activeKey === 2 ? 'active' : ''}`}
                        onClick={(e) => handlePress(2, e)}
                    >
                        <div className="bar-graphic"></div>
                    </button>
                </div>
                <div className="pad-slot area-skip">
                    <button
                        className={`kbc-button kbc-button-danger ${activeKey === 5 ? 'active' : ''}`}
                        onClick={(e) => handlePress(5, e)}
                    >
                        SKIP
                    </button>
                </div>
            </div>

            {/* Row 2: Large, XL */}
            <div className="row">
                <div className="pad-slot area-k3">
                    <button
                        className={`kbc-button kbc-button-light ${activeKey === 3 ? 'active' : ''}`}
                        onClick={(e) => handlePress(3, e)}
                    >
                        <div className="bar-graphic"></div>
                    </button>
                </div>
                <div className="pad-slot area-k4">
                    <button
                        className={`kbc-button kbc-button-light ${activeKey === 4 ? 'active' : ''}`}
                        onClick={(e) => handlePress(4, e)}
                    >
                        <div className="bar-graphic"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};
