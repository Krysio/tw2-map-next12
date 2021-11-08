import { BUFF_COLOR_COUNT, BUFF_COLOR_VALUES_COUNT, BUFF_DATA_COUNT, BUFF_DATA_VALUES_COUNT, COLOR_INDEX_BORDER_CONTINENT, COLOR_INDEX_BORDER_PROVINCE, REGE_IMPORT_VALUES_FROM_HEX_COLOR, TILE_TYPE_BORDER, TILE_TYPE_BORDER_WATER } from "./constant";

function coord2Index(
  x: number,
  y: number
) {
  return y * 1024 * BUFF_DATA_VALUES_COUNT + x * BUFF_DATA_VALUES_COUNT;
}

export function createDataBuffer() {
  return new Uint8Array(BUFF_DATA_COUNT * BUFF_DATA_VALUES_COUNT);
}
export function createColorsBuffer() {
  return new Uint8Array(BUFF_COLOR_COUNT * BUFF_COLOR_VALUES_COUNT);
}

export function createTileApi(dataBuffer: Uint8Array) {
  let selectedIndex = 0;

  const setColor = (intColor: number, slot: number) => {
    dataBuffer[selectedIndex + slot + 0] = (intColor >> 24) & 0xff;
    dataBuffer[selectedIndex + slot + 1] = (intColor >> 16) & 0xff;
    dataBuffer[selectedIndex + slot + 2] = (intColor >> 8) & 0xff;
    dataBuffer[selectedIndex + slot + 3] = (intColor >> 0) & 0xff;
  }
  
  return {
    select(xOrIndex: number, y?: number) {
      if (y === undefined) {
        selectedIndex = xOrIndex;
      } else {
        selectedIndex = coord2Index(xOrIndex, y);
      }
      return this;
    },
    setPrimaryColor(intColor: number) {
      setColor(intColor, 1 * 4);
      return this;
    },
    setSecondaryColor(intColor: number) {
      setColor(intColor, 2 * 4);
      return this;
    },
    setThirdColor(intColor: number) {
      setColor(intColor, 3 * 4);
      return this;
    },
    getType(): number {
      return dataBuffer[selectedIndex + 2];
    },
    setType(type: number) {
      dataBuffer[selectedIndex + 2] = type;
  
      switch (type) {
        case TILE_TYPE_BORDER_WATER:
          dataBuffer[selectedIndex + 3] = COLOR_INDEX_BORDER_PROVINCE;
          dataBuffer[selectedIndex + 4] = 0;
          break;
        case TILE_TYPE_BORDER:
          dataBuffer[selectedIndex + 3] = COLOR_INDEX_BORDER_CONTINENT;
          dataBuffer[selectedIndex + 4] = 0;
          break;
      }
      return this;
    }
  };
}
export function createColorsApi(colorsBuffer: Uint8Array) {
  let nextSlotIndex: number = 0;
  
  return {
    /**
     * @param color Color in hex: '#aabbcc'
     * @return slot number
     */
    addColor(
      color: string
    ): number {
      const slot = Math.min(nextSlotIndex++, BUFF_COLOR_COUNT - 1);
      this.setColorInSlot(slot, color);

      return slot;
    },
    getColorIndex(
      slot: number
    ): number {
      let validSlot = Math.max(0, Math.min(slot, BUFF_COLOR_COUNT - 1)),
        index = validSlot * BUFF_COLOR_VALUES_COUNT;

      return index;
    },
    getColor(
      slot: number
    ): string {
      let index = this.getColorIndex(slot);

      return `#${Buffer.from([
        colorsBuffer[index + 0],
        colorsBuffer[index + 1],
        colorsBuffer[index + 2]
      ]).toString('hex')}`;
    },
    setColorInSlot(
      slot: number,
      color: string
    ): void {
      if (!color) return;

      let validSlot = Math.max(0, Math.min(slot, BUFF_COLOR_COUNT - 1)),
        index = validSlot * BUFF_COLOR_VALUES_COUNT,
        colorValues = color.match(REGE_IMPORT_VALUES_FROM_HEX_COLOR);

      if (colorValues !== null) {
        if (colorValues.length !== 4) {
          throw new Error('TODO: invalid color format');
        }

        colorsBuffer[index + 0] = parseInt(colorValues[1], 16);
        colorsBuffer[index + 1] = parseInt(colorValues[2], 16);
        colorsBuffer[index + 2] = parseInt(colorValues[3], 16);
        colorsBuffer[index + 3] = parseInt(colorValues[4], 16) || 255;
      }
    }
  };
}