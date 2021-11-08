import { Props } from '.';
import { initShaders } from '@/hexmap/shaders';
import { BUFF_DATA_ELEMENTS_PER_TILE } from '../constant';

export function tryInitContext(props: Props) {
  if (props.canvasElement === null) return;

  const context = props.canvasElement.getContext('webgl');

  if (context !== null) {
    props.context = context;
    context.viewport(0, 0, props.canvasElement.width, props.canvasElement.height);
    context.clearColor(0, 0, 0, 0);
    context.clear(context.COLOR_BUFFER_BIT);

    tryInitShaderProgram(props);
  }
}

export function tryInitShaderProgram(props: Props) {
  if (props.canvasElement === null) return;

  const shaderProgram = initShaders(props.context);

  if (shaderProgram !== null) {
    props.shaderProgram = shaderProgram;

    initVerticles(props.context, shaderProgram);
    props.textures = initTextures(props.context, shaderProgram, props.dataBuffer, props.colorsBuffer);
    props.uniforms = initUniforms(props.context, shaderProgram);
    props.initialized = true;
  }
}

export function initVerticles(
  context: WebGLRenderingContext,
  shaderProgram: WebGLShader
): void {
  let { ARRAY_BUFFER, STATIC_DRAW, FLOAT } = context;

  let positionBuffer = context.createBuffer();
  let positionAttributeLocation = context.getAttribLocation(
    shaderProgram,
    'vertexIndex'
  );

  context.bindBuffer(
    ARRAY_BUFFER,
    positionBuffer
  );
  context.bufferData(
    ARRAY_BUFFER,
    new Float32Array([0, 1, 2, 3]),
    STATIC_DRAW
  );

  context.enableVertexAttribArray(
    positionAttributeLocation
  );
  context.vertexAttribPointer(
    positionAttributeLocation,
    1,          // size - 2 components per iteration
    FLOAT,      // type - the data is 32bit floats
    false,      // normalize - don't normalize the data
    0,          // stride - 0 = move forward size * sizeof(type) each iteration to get the next position
    0           // offset - start at the beginning of the buffer
  );
}

//https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
export function initTextures(
  context: WebGLRenderingContext,
  shaderProgram: WebGLShader,
  dataBuffer: Uint8Array,
  colorBuffer: Uint8Array
) {
  const { TEXTURE0, TEXTURE1 } = context;
  const textures = {
    data: {
      slot: TEXTURE0,
      unit: 0,
      texture: context.createTexture(),
      uniformLocation: context.getUniformLocation(
        shaderProgram,
        'iData'
      )
    },
    color: {
      slot: TEXTURE1,
      unit: 1,
      texture: context.createTexture(),
      uniformLocation: context.getUniformLocation(
        shaderProgram,
        'iColor'
      )
    }
  };

  const {
    TEXTURE_2D,
    RGBA,
    UNSIGNED_BYTE,
    TEXTURE_WRAP_S, TEXTURE_WRAP_T,
    TEXTURE_MAG_FILTER, TEXTURE_MIN_FILTER,
    REPEAT, NEAREST
  } = context;

  // data
  context.bindTexture(
    TEXTURE_2D,
    textures.data.texture
  );
  context.texImage2D(
    TEXTURE_2D, 0,
    RGBA,
    1024 * BUFF_DATA_ELEMENTS_PER_TILE, 1024, 0,
    RGBA, UNSIGNED_BYTE,
    dataBuffer
  );
  context.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, REPEAT);
  context.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, REPEAT);
  context.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, NEAREST);
  context.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST);
  context.uniform1i(
    textures.data.uniformLocation,
    textures.data.unit
  );

  // color
  context.bindTexture(
    TEXTURE_2D,
    textures.color.texture
  );
  context.texImage2D(
    TEXTURE_2D, 0,
    RGBA,
    256, 1, 0,
    RGBA, UNSIGNED_BYTE,
    colorBuffer
  );
  context.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, REPEAT);
  context.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, REPEAT);
  context.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, NEAREST);
  context.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST);
  context.uniform1i(
    textures.color.uniformLocation,
    textures.color.unit
  );

  // active
  context.activeTexture(textures.data.slot);
  context.bindTexture(
    TEXTURE_2D,
    textures.data.texture
  );
  context.activeTexture(textures.color.slot);
  context.bindTexture(
    TEXTURE_2D,
    textures.color.texture
  );

  return textures;
}

export function initUniforms(
  context: WebGLRenderingContext,
  shaderProgram: WebGLShader
) {
  const uniforms = {
    position: context.getUniformLocation(
      shaderProgram,
      'iPosition'
    ),
    size: context.getUniformLocation(
      shaderProgram,
      'iSize'
    ),
    time: context.getUniformLocation(
      shaderProgram,
      'iTime'
    ),
    resolution: context.getUniformLocation(
      shaderProgram,
      'iResolution'
    )
  }

  return uniforms;
}

export function unbindEvents(props: Props) {
  if (props.canvasElement) {
    type WindowEvents = keyof typeof props.eventHandlers.window;
    type CanvasEvents = keyof typeof props.eventHandlers.canvas;

    for (const eventKey in props.eventHandlers.window) {
      window.removeEventListener(
        eventKey,
        props.eventHandlers.window[eventKey as WindowEvents].listener
      );
    }
    for (const eventKey in props.eventHandlers.canvas) {
      props.canvasElement.removeEventListener(
        eventKey,
        props.eventHandlers.canvas[eventKey as CanvasEvents].listener as (event: Event) => void
      );
    }
  }
}

export function bindEvents(props: Props) {
  if (props.canvasElement) {
    if (props.canvasElement) {
      type WindowEvents = keyof typeof props.eventHandlers.window;
      type CanvasEvents = keyof typeof props.eventHandlers.canvas;
  
      for (const eventKey in props.eventHandlers.window) {
        window.addEventListener(
          eventKey,
          props.eventHandlers.window[eventKey as WindowEvents].listener,
          props.eventHandlers.window[eventKey as WindowEvents].option
        );
      }
      for (const eventKey in props.eventHandlers.canvas) {
        props.canvasElement.addEventListener(
          eventKey,
          props.eventHandlers.canvas[eventKey as CanvasEvents].listener as (event: Event) => void,
          props.eventHandlers.canvas[eventKey as CanvasEvents].option
        );
      }
    }
  }
}