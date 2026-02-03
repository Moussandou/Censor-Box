export const WORD_POOL = [
    "PROTOCOL", "SUBJECT", "ALPHA", "OMEGA", "TARGET", "ASSET", "LIQUIDATE",
    "CLASSIFIED", "REDACTED", "CLEARANCE", "VERIFIED", "UNKNOWN", "LOCATION",
    "WASHINGTON", "LONDON", "MOSCOW", "ISLAND", "FLIGHT", "LOG", "ENTRY",
    "USER", "ADMIN", "SYSTEM", "FAILURE", "SUCCESS", "PENDING", "ACTIVE",
    "DANGER", "WARNING", "ERROR", "FATAL", "BREACH", "SECURITY", "LEVEL",
    "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
    "ZERO", "AGENT", "DIRECTOR", "OPERATOR", "HANDLER", "CONTACT", "SIGNAL",
    "BLUE", "RED", "GREEN", "BLACK", "WHITE", "ORANGE", "YELLOW", "PURPLE",
    "THE", "AND", "IS", "OF", "TO", "IN", "IT", "YOU", "THAT", "HE", "WAS",
    "FOR", "ON", "ARE", "AS", "WITH", "HIS", "THEY", "I", "AT", "BE", "THIS",
    "HAVE", "FROM", "OR", "ONE", "HAD", "BY", "WORD", "BUT", "NOT", "WHAT",
    "EPSTEIN", "ISLAND", "JET", "LIST", "NAME", "BANK", "MONEY", "FUND",
    "OFFSHORE", "ACCOUNT", "TRANSFER", "WIRE", "CLIENT", "GUEST", "VISIT"
];

export const generateText = (count: number = 50): string[] => {
    const text = [];
    for (let i = 0; i < count; i++) {
        text.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
    }
    return text;
};

// Returns category 1-4 based on length
export const getWordCategory = (word: string): number => {
    const len = word.length;
    if (len <= 3) return 1;
    if (len <= 5) return 2;
    if (len <= 8) return 3;
    return 4;
};
