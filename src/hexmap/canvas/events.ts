import { PropsReady } from ".";
import { Api } from "./api";

function defaultEvent<Ev extends Event>(eventKey: string, listener: (event: Ev) => void) {
  return {[eventKey]: {
    listener,
    option: false
  }};
}
function captureEvent<Ev extends Event>(eventKey: string, listener: (event: Ev) => void) {
  return {[eventKey]: {
    listener,
    option: {
      capture: true,
      passive: false
    }
  }};
}
function pasiveEvent<Ev extends Event>(eventKey: string, listener: (event: Ev) => void) {
  return {[eventKey]: {
    listener,
    option: {
      capture: true,
      passive: true
    }
  }};
}

export function buildEventHandlers(props: PropsReady, api: Api) {
  const mouseState = {
    prev: [0, 0],
    click: false,
    move: false
  };

  return {
    window: {
      ...defaultEvent('resize', (event: Event) => {
        api.requestUpdateResolution();
      })
    },
    canvas: {
      ...defaultEvent('mouseenter', (event: MouseEvent) => {
        props.events.emit('canvas/enter');
      }),
      ...defaultEvent('mouseleave', (event: MouseEvent) => {
        if (mouseState.move) {
          props.events.emit('canvas/move', false);
        }
        mouseState.click = false;
        mouseState.move = false;
        props.events.emit('canvas/leave');
      }),
      ...defaultEvent('mouseup', (event: MouseEvent) => {
        if (mouseState.move) {
          props.events.emit('canvas/move', false);
        } else if (mouseState.click) {
          props.events.emit('click/tile', props.state.tile.hover);
        }

        mouseState.click = false;
        mouseState.move = false;
      }),
      ...defaultEvent('mousedown', (event: MouseEvent) => {
        mouseState.prev[0] = event.offsetX;
        mouseState.prev[1] = event.offsetY;
        mouseState.click = true;
      }),
      ...defaultEvent('mousemove', (event: MouseEvent) => {
        const state = props.state;

        if (mouseState.click) {
          const diffX = mouseState.prev[0] - event.offsetX;
          const diffY = mouseState.prev[1] - event.offsetY;

          if (mouseState.move === false
            && (
              diffX > 5 || diffX < -5
              || diffY > 5 || diffY < -5
            )
          ) {
            mouseState.move = true;
            props.events.emit('canvas/move', true);
          }

          if (mouseState.move) {
            // moveing the map

            const [ dx, dy ] = state.calcPixel2Value(diffX, diffY);
            
            state.normal.center.x+= dx * 0.95;
            state.normal.center.y+= dy * 0.95;

            api.setPosition(
              state.normal.center.x, 
              state.normal.center.y
            );
            api.requestUpdate();

            mouseState.prev[0] = event.offsetX;
            mouseState.prev[1] = event.offsetY;
          }
        } else {
          // hover

          const { hw, hh } = state.pixel.screenSize;
          const { x, y } = state.pixel.center;
          const [ tileX, tileY ] = state.calcPixel2Tile(
            x - hw + event.offsetX,
            y - hh + event.offsetY
          );
          state.tile.hover.x = tileX;
          state.tile.hover.y = tileY;
          props.events.emit('hover/tile', {x: tileX, y: tileY});
        }
      }),
      ...pasiveEvent('wheel', (event: WheelEvent) => {
        const current = props.state.tile.size;

        if (event.deltaY < 0) {
          api.setSize(current * 1.1);
        } else {
          api.setSize(current * 0.9);
        }
      }),
    }
  };
}
