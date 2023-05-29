import { Props, PropsReady } from '.';
import { INIT_TILE_SIZE, MAX_TILE_SIZE, MIN_TILE_SIZE } from '@/hexmap/constant';
import { bindEvents, tryInitContext, unbindEvents } from './init';

export function createApi(props: Props) {
  let animationFrameHasBeenRequested = false;
  let updateResolutionHasBeenRequested = false;

  function animationFrame() {
    animationFrameHasBeenRequested = false;

    if (props.initialized === false) return;

    // console.log(JSON.stringify(props.state, null, '  '));

    props.context.uniform1f(props.uniforms.time, Date.now());
    props.context.drawArrays(props.context.TRIANGLE_FAN, 0, 4);
  }

  function updateStateTile() {
    const [ tileX, tileY ] = props.state.calcValue2Tile(
      props.state.normal.center.x, 
      props.state.normal.center.y
    );

    if (props.state.tile.center.x !== tileX
      || props.state.tile.center.y !== tileY
    ) {
      props.state.tile.center.x = tileX;
      props.state.tile.center.y = tileY;
      props.events.emit('position/tile', { x: tileX, y: tileY });
    }
  }

  function updateStatePixel() {
    const [ pixelX, pixelY ] = props.state.calcValue2Pixel(
      props.state.normal.center.x, 
      props.state.normal.center.y
    );
    props.state.pixel.center.x = pixelX;
    props.state.pixel.center.y = pixelY;
  }

  const smoothSizeState = {
    tStart: 0,
    tEnd: 0,
    vStart: 0,
    vEnd: 0,
    active: false
  };
  const smoothSizeAnimate = () => {
    props = props as PropsReady;

    const now = Date.now();
    const prevValue = props.state.tile.size;
    let newValue;

    if (smoothSizeState.tEnd < now) {
        newValue = smoothSizeState.vEnd;
        smoothSizeState.active = false;
    } else {
        newValue = 1 - (smoothSizeState.tEnd - now) / (smoothSizeState.tEnd - smoothSizeState.tStart);
        newValue = smoothSizeState.vStart + (smoothSizeState.vEnd - smoothSizeState.vStart) * newValue;
    }

    props.state.tile.size = newValue;

    updateStatePixel();

    props.events.emit('size/tile', [prevValue, newValue]);
    props.context.uniform1f(props.uniforms.size, newValue);
    api.requestUpdate();

    if (smoothSizeState.active) {
        requestAnimationFrame(smoothSizeAnimate);
    }
  };

  const api = {
    setCanvasElement(canvasElement: HTMLCanvasElement | null) {
      if (canvasElement === null) {
        unbindEvents(props);
        props.initialized = false;
        props.canvasElement = null;
        props.context = null;
        props.shaderProgram = null;
        props.textures = null;
        props.uniforms = null;
      } else if (props.canvasElement !== canvasElement) {
        (props as unknown as PropsReady)
        .canvasElement = canvasElement;

        bindEvents(props);
        tryInitContext(props);
        api.setSize(INIT_TILE_SIZE);
        api.setPosition(0.5, 0.5);
        api.updateResolution();
        api.requestUpdate();
      }
    },
    setSize(
      value: number,
      smooth = false
    ): void {
      if (props.initialized === false) return;

      const newValue = Math.max(MIN_TILE_SIZE, Math.min(value, MAX_TILE_SIZE));
      const prevValue = props.state.tile.size;
      const now = Date.now();
      
      if (smooth) {
        smoothSizeState.vStart = prevValue;
        smoothSizeState.tStart = now;
        smoothSizeState.tEnd = now + 50;
        smoothSizeState.vEnd = newValue;
        smoothSizeState.active = true;
      }

      if (newValue !== prevValue) {
        
        if (smoothSizeState.active) {
          requestAnimationFrame(smoothSizeAnimate);
        } else {
          props.state.tile.size = newValue;
  
          updateStatePixel();
  
          props.events.emit('size/tile', [prevValue, newValue]);
          props.context.uniform1f(props.uniforms.size, newValue);
          api.requestUpdate();
        }
      }
    },
    setPosition(
      valueX: number,
      valueY: number
    ): void {
      if (props.initialized === false) return;
      const state = props.state;

      state.normal.center.x = valueX;
      state.normal.center.y = valueY;

      updateStateTile();
      updateStatePixel();

      props.context.uniform2f(
        props.uniforms.position,
        valueX,
        valueY
      );
      api.requestUpdate();
    },
    requestUpdateResolution() {
      if (updateResolutionHasBeenRequested === false) {
        updateResolutionHasBeenRequested = true;
        requestAnimationFrame(api.updateResolution);
      }
    },
    updateResolution(): void {
      if (props.initialized === false) return;
      updateResolutionHasBeenRequested = false;

      const canvasBBox = props.canvasElement.getBoundingClientRect();

      props.canvasElement.setAttribute('width', (canvasBBox.width).toString());
      props.canvasElement.setAttribute('height', (canvasBBox.height).toString());
      props.state.pixel.screenSize.w = canvasBBox.width;
      props.state.pixel.screenSize.h = canvasBBox.height;
      props.state.pixel.screenSize.hw = canvasBBox.width / 2;
      props.state.pixel.screenSize.hh = canvasBBox.height / 2;

      updateStatePixel();

      if (props.context === null) return;

      props.context.viewport(
        0,
        0,
        canvasBBox.width,
        canvasBBox.height
      );

      if (props.uniforms === null) return;

      props.context.uniform2f(
        props.uniforms.resolution,
        canvasBBox.width,
        canvasBBox.height
      );

      api.requestUpdate();
    },
    requestUpdate() {
      if (animationFrameHasBeenRequested === false) {
        animationFrameHasBeenRequested = true;
        requestAnimationFrame(animationFrame);
      }
    }
  };
  return api;
}
export type Api = ReturnType<typeof createApi>;