import React from 'react';
import { createApi } from './api';
import TypedEventEmitter from './eventEmitter';
import { buildEventHandlers } from './events';
import { buildHooks } from './react';
import { initTextures, initUniforms } from './init';
import { createState, State } from './state';

export type PropsEmpty = {
  dataBuffer: Uint8Array,
  colorsBuffer: Uint8Array,
  state: State,
  events: TypedEventEmitter,
  initialized: false,
  canvasElement: null,
  context: null,
  shaderProgram: null,
  textures: null,
  uniforms: null,
  eventHandlers: null | ReturnType<typeof buildEventHandlers>
};
export type PropsReady = {
  dataBuffer: Uint8Array,
  colorsBuffer: Uint8Array,
  state: State,
  events: TypedEventEmitter,
  initialized: true,
  canvasElement: HTMLCanvasElement,
  context: WebGLRenderingContext,
  shaderProgram: WebGLShader,
  textures: ReturnType<typeof initTextures>,
  uniforms: ReturnType<typeof initUniforms>,
  eventHandlers: ReturnType<typeof buildEventHandlers>
};
export type Props = PropsEmpty | PropsReady;

export function createCanvasInstance(
  dataBuffer: Uint8Array,
  colorsBuffer: Uint8Array
) {
  const props: Props = {
    dataBuffer, colorsBuffer,
    events: new TypedEventEmitter(),
    state: createState(),
    initialized: false,
    canvasElement: null,
    context: null,
    shaderProgram: null,
    textures: null,
    uniforms: null,
    eventHandlers: null
  };

  const canvasRef = React.createRef<HTMLCanvasElement>();
  const api = createApi(props);

  props.eventHandlers = buildEventHandlers(props as unknown as PropsReady, api);

  return {
    ...api,
    ...buildHooks(props, api),
    Component: class HexMapCanvasComponent extends React.Component<{className: string}> {
      componentDidMount() {
        api.setCanvasElement(canvasRef.current);
      }
      componentWillUnmount() {
        api.setCanvasElement(null);
      }
      conponentShouldUpdate() {
        return false;
      }
      render() {
        return React.createElement(
          'canvas',
          {
            ref: canvasRef,
            className: this.props.className || 'hexmap'
          }
        );
      }      
    }
  };
}
