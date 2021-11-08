import vertexShaderCode from '!!raw-loader!./glsl/vertex.glsl';
import fragmentShaderCode from '!!raw-loader!./glsl/fragment.glsl';

function createShader(
  webGlContext: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = webGlContext.createShader(type);

  if (shader === null) return null;

  webGlContext.shaderSource(shader, source);
  webGlContext.compileShader(shader);

  const success = webGlContext.getShaderParameter(
      shader,
      webGlContext.COMPILE_STATUS
  );

  if (success) return shader;

  console.log(`Shader {${ type }} error`);
  console.log(webGlContext.getShaderInfoLog(shader));
  webGlContext.deleteShader(shader);
  return null;
}

function createProgram(
  webGlContext: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  let program = webGlContext.createProgram();

  if (program === null) return null;

  webGlContext.attachShader(program, vertexShader);
  webGlContext.attachShader(program, fragmentShader);
  webGlContext.linkProgram(program);

  let success = webGlContext.getProgramParameter(
      program,
      webGlContext.LINK_STATUS
  );

  if (success) {
      return program;
  }

  console.log(webGlContext.getProgramInfoLog(program));
  webGlContext.deleteProgram(program);
  return null;
}


export function initShaders(
  context: WebGLRenderingContext
) {
  const { VERTEX_SHADER, FRAGMENT_SHADER } = context;

  const vertexShader = createShader(
    context,
    VERTEX_SHADER,
    vertexShaderCode
  );
  const fragmentShader = createShader(
    context,
    FRAGMENT_SHADER,
    fragmentShaderCode
  );

  let shaderProgram = null as WebGLShader | null;
  
  if (vertexShader !== null
    && fragmentShader !== null
  ) {
    shaderProgram = createProgram(
        context,
        vertexShader,
        fragmentShader
    );
  }

  if (shaderProgram !== null) {
    context.useProgram(shaderProgram);
  }

  return shaderProgram;
}