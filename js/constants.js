/* eslint-disable */
const KANJI_VIEW_TYPE = {
    YOMICHAN: 'YOMICHAN',
    JPDB: 'JPDB',
    KANSHUDO: 'KANSHUDO',
    OJAD: 'OJAD',
}

const KANJI_VIEW_URL = {
    [KANJI_VIEW_TYPE.KANSHUDO]: 'https://www.kanshudo.com/search',
    [KANJI_VIEW_TYPE.JPDB]: 'https://jpdb.io/search?lang=english',
    [KANJI_VIEW_TYPE.OJAD]: 'https://www.gavo.t.u-tokyo.ac.jp/ojad/phrasing/index'
};

const KANJI_VIEW_SETTINGS = {
    ZOOM_LEVEL: 'KANJI_VIEW_ZOOM',
    VIEW_TYPE: 'KANJI_VIEW_TYPE',
    DEBOUNCE_COOLDOWN: 'DEBOUNCE_COOLDOWN',
    AUTO_PITCH_COLOR: 'AUTO_PITCH_COLOR',
    PITCH_SHAPES: 'PITCH_SHAPES',
    ENABLE_FURIGANA: 'ENABLE_FURIGANA',
    SUBTITLE_COLORING: 'SUBTITLE_COLORING',
    USE_JPDB_KANJI_VIEW: 'USE_JPDB_KANJI_VIEW',
    DEFAULT_KANJI_VIEW: 'DEFAULT_KANJI_VIEW',
}

const EXTENSION_COMMANDS = {
    QUERY_YOMICHAN: 'QUERY_YOMICHAN',
    PITCH_COLOR: 'PITCH_COLOR',
    OPEN_NEW_TAB: 'OPEN_NEW_TAB',
    TOGGLE_FURIGANA: 'TOGGLE_FURIGANA'
}

const PITCH_COLOR = {
    HEIBAN: '#3366CC',
    ATAMADAKA: '#E60000',
    NAKADAKA: '#E68A00',
    ODAKA: '#00802B',
    KIFUKU: '#AC04E7',
}

const VIDEO_STREAMING_PLATFORM = {
    ANIMELON: 'ANIMELON',
    YOUTUBE: 'YOUTUBE'
}

const VIDEO_STREAMING_PLATFORM_URL = {
    [VIDEO_STREAMING_PLATFORM.ANIMELON]: 'https://animelon.com',
    [VIDEO_STREAMING_PLATFORM.YOUTUBE]: 'https://www.youtube.com',
}

const KANJI_VIEW = {
    YOMICHAN: 'YOMICHAN_KANJI',
    JPDB: 'JPDB_KANJI',
    WIKTIONARY: 'WIKTIONARY_KANJI',
    HANZIYUAN: 'HANZIYUAN_KANJI',
}

const KANJI_URL = {
    [KANJI_VIEW.JPDB]: 'https://jpdb.io/kanji',
    [KANJI_VIEW.WIKTIONARY]: 'https://en.wiktionary.org/wiki',
    [KANJI_VIEW.HANZIYUAN]: 'https://hanziyuan.net',
}

const KANJI_VIEW_TYPE_LABEL = {
    [KANJI_VIEW_TYPE.YOMICHAN]: 'YO',
    [KANJI_VIEW_TYPE.KANSHUDO]: 'K',
    [KANJI_VIEW_TYPE.JPDB]: 'J',
    [KANJI_VIEW_TYPE.OJAD]: 'O',
    [KANJI_VIEW.YOMICHAN]: 'YO',
    [KANJI_VIEW.JPDB]: 'J',
    [KANJI_VIEW.WIKTIONARY]: 'W',
    [KANJI_VIEW.HANZIYUAN]: 'H',
};