import { MAP_SIZE } from '@/hexmap/constant';

export function createState() {
  const tileParamX = 1.0;
  const tileParamY = 1.7;

  return {
    pixel: {
      center: {x: 0.0, y: 0.0},
      screenSize: {
        w: 800,
        h: 600,
        hw: 400,
        hh: 300
      }
    },
    normal: {
      center: {x: 0.0, y: 0.0}
    },
    tile: {
      center: {x: 500, y: 500},
      hover: {x: 0, y: 0},
      param: {x: tileParamX, y: tileParamY, hx: tileParamX / 2, hy: tileParamY / 2},
      size: 0 // TODO {w: 0, h: 0}
    },

    calcValue2Pixel(
      x: number,
      y: number
    ): [number, number] {
      return [
        x * 1e3 * this.tile.size /* w */ * this.tile.param.x,
        y * 1e3 * this.tile.size /* h */ * 0.5 * this.tile.param.y
      ];
    },
    calcPixel2Value(
      x: number,
      y: number
    ): [number, number] {
      return [
        x / (MAP_SIZE * this.tile.size /* w */),
        y / (MAP_SIZE * 0.5 * this.tile.param.y * this.tile.size /* h */)
      ];
    },
    calcPixel2Tile(
      x: number,
      y: number
    ): [number, number] {
      return this.calcValue2Tile(
        ...this.calcPixel2Value(x, y)
      );
    },
    calcValue2Tile(
      x: number,
      y: number
    ): [number, number] {
      const a = (MAP_SIZE * this.tile.param.x * x * this.tile.size /* w */) / this.tile.size /* w */,
        b = (MAP_SIZE * 0.5 * this.tile.param.y * y * this.tile.size /* h */) / this.tile.size /* h */,
        ax = a % this.tile.param.x - this.tile.param.hx,
        ay = b % this.tile.param.y - this.tile.param.hy,
        bx = (a - this.tile.param.hx) % this.tile.param.x - this.tile.param.hx,
        by = (b - this.tile.param.hy) % this.tile.param.y - this.tile.param.hy;

      if (ax*ax + ay*ay < bx*bx + by*by) {
        return [
          Math.floor(a - ax),
          Math.round((b - ay) / this.tile.param.y * 2)
        ];
      } else {
        return [
          Math.floor(a - bx),
          Math.round((b - by) / this.tile.param.y * 2)
        ];
      }
    },
    calcTile2Value(
      x: number,
      y: number
    ): [number, number] {
      return [
        x / (MAP_SIZE - (y % 2 ? 1 : 0)),
        y / MAP_SIZE
      ];
    },
    calcTile2Pixel(
      x: number,
      y: number
    ): [number, number] {
      return [
        x * this.tile.size /* w */ * this.tile.param.x,
        y * this.tile.size /* h */ * this.tile.param.y * 0.5
      ];
    }
  };
}
export type State = ReturnType<typeof createState>;