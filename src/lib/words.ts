// Combined Word Pool for Size-Matching Gameplay
export const WORD_POOL = [
    // Original & Sensitive
    "PROTOCOL", "SUBJECT", "ALPHA", "OMEGA", "TARGET", "ASSET", "LIQUIDATE",
    "CLASSIFIED", "REDACTED", "CLEARANCE", "VERIFIED", "UNKNOWN", "LOCATION",
    "WASHINGTON", "LONDON", "MOSCOW", "ISLAND", "FLIGHT", "LOG", "ENTRY",
    "USER", "ADMIN", "SYSTEM", "FAILURE", "SUCCESS", "PENDING", "ACTIVE",
    "DANGER", "WARNING", "ERROR", "FATAL", "BREACH", "SECURITY", "LEVEL",
    "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
    "ZERO", "AGENT", "DIRECTOR", "OPERATOR", "HANDLER", "CONTACT", "SIGNAL",
    "BLUE", "RED", "GREEN", "BLACK", "WHITE", "ORANGE", "YELLOW", "PURPLE",
    "EPSTEIN", "MAXWELL", "PRINCE", "DUKE", "MODEL", "ACTOR", "SINGER",
    "BANK", "FUND", "MONEY", "WIRE", "CLIENT", "LIST", "NAME", "Code", "KEY",
    "FILE", "DATA", "ACCESS", "DENIED", "GUEST", "HOTEL", "ROOM", "SITE",
    "AREA", "ZONE", "BASE", "CAMP", "LAB", "VIRUS", "TOXIN", "WEAPON", "BOMB",
    "KILL", "DEAD", "ALIVE", "SAFE",
    // Common words added for variety (now just normal targets)
    "THE", "AND", "IS", "OF", "TO", "IN", "IT", "YOU", "THAT", "HE", "WAS",
    "FOR", "ON", "ARE", "AS", "WITH", "HIS", "THEY", "I", "AT", "BE", "THIS",
    "HAVE", "FROM", "OR", "BUT", "NOT", "WHAT", "ALL", "WERE", "WE", "WHEN",
    "YOUR", "CAN", "SAID", "THERE", "USE", "AN", "EACH", "WHICH", "SHE",
    "DO", "HOW", "THEIR", "IF", "WILL", "UP", "OTHER", "ABOUT", "OUT", "MANY",
    "THEN", "THEM", "THESE", "SO", "SOME", "HER", "WOULD", "MAKE", "LIKE",
    "HIM", "INTO", "TIME", "HAS", "LOOK", "MORE", "WRITE", "GO", "SEE",
    "NO", "WAY", "COULD", "MY", "THAN", "FIRST", "WATER", "BEEN", "CALL",
    "WHO", "OIL", "ITS", "NOW", "FIND", "LONG", "DOWN", "DAY", "DID", "GET",
    "COME", "MADE", "MAY", "PART"
];

export const generateText = (count: number = 50): string[] => {
    const text = [];
    for (let i = 0; i < count; i++) {
        text.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
    }
    return text;
};

// Returns size category 1-4 based on length (unchanged logic)
export const getWordCategory = (word: string): number => {
    const len = word.length;
    if (len <= 3) return 1;
    if (len <= 5) return 2;
    if (len <= 8) return 3;
    return 4;
};
