export const MAP_SIZE = 1000;
export const TILE_COUNT = MAP_SIZE * MAP_SIZE;

export const INIT_TILE_SIZE = 20;
export const MIN_TILE_SIZE = 3;
export const MAX_TILE_SIZE = 200;

export const BUFF_COLOR_COUNT = 256 * 256;
export const BUFF_COLOR_VALUES_COUNT = 4;
export const BUFF_DATA_COUNT = 1024 * 1024;
export const BUFF_DATA_ELEMENTS_PER_TILE = 4;
export const BUFF_DATA_VALUES_COUNT = 4 * BUFF_DATA_ELEMENTS_PER_TILE;

export const COLOR_INDEX_BACKGROUND = 0;
export const COLOR_INDEX_BORDER_PROVINCE = 1;
export const COLOR_INDEX_BORDER_CONTINENT = 2;
export const COLOR_INDEX_VILLAGE_PLAYER = 3;
export const COLOR_INDEX_VILLAGE_BARBARIAN = 4;
export const COLOR_INDEX_HOVER_ITEM = 5;
export const COLOR_INDEX_HOVER_GROUP = 6;

export const TILE_TYPE_VOID = 0;            // 00
export const TILE_TYPE_VILLAGE = 1;         // 01
export const TILE_TYPE_BORDER = 2;          // 10
export const TILE_TYPE_BORDER_WATER = 3;    // 11

export const REGE_IMPORT_VALUES_FROM_HEX_COLOR = /([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/;