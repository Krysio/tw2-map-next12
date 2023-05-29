import React, { createRef, useEffect, useState } from "react";
import { createCanvasInstance } from "./canvas";
import { createColorsApi, createColorsBuffer, createDataBuffer, createTileApi } from "./data";
import { TILE_TYPE_VILLAGE } from "./constant";

const isBrowser = typeof window !== 'undefined';

export function createInstance() {
  const props = {
    dataBuffer: createDataBuffer(),
    colorsBuffer: createColorsBuffer()
  };
  const tileApi = createTileApi(props.dataBuffer);
  const colorApi = createColorsApi(props.colorsBuffer);
  const mapOfCanvasIstances = new Map<string, ReturnType<typeof createCanvasInstance>>();

  if (isBrowser) {
    colorApi.addColor('#004000ff'); // background
    colorApi.addColor('#888888ff'); // border
    colorApi.addColor('#ffff00ff'); // river
    colorApi.addColor('#003000ff'); // player village
    colorApi.addColor('#005000ff'); // barbarian village
    colorApi.addColor('#ffffffff'); // hover
    colorApi.addColor('#999999ff'); // hover group
  
    tileApi.select(499, 500).setType(TILE_TYPE_VILLAGE).setPrimaryColor(0x00ff00ff);
    tileApi.select(500, 500).setType(TILE_TYPE_VILLAGE).setPrimaryColor(0xff0000ff);
    tileApi.select(501, 500).setType(TILE_TYPE_VILLAGE).setPrimaryColor(0xffff00ff);
    tileApi.select(501, 501).setType(TILE_TYPE_VILLAGE).setPrimaryColor(0x00ffffff);
    tileApi.select(500, 501).setType(TILE_TYPE_VILLAGE).setPrimaryColor(0xff00ffff);
    for (let i =0; i < 5e4; i++) {
      const x = Math.ceil(Math.random() * 1e3);
      const y = Math.ceil(Math.random() * 1e3);
      tileApi.select(x, y).setType(TILE_TYPE_VILLAGE).setPrimaryColor(0xffffffff);
      tileApi.select(x, y).setType(TILE_TYPE_VILLAGE).setSecondaryColor(6);
    }
  }

  const instance = {
    tile: tileApi,
    color: colorApi,
    getCanvasInstance: function getCanvasInstanceFromStorageByName(instanceName: string) {
      let canvasInstace = mapOfCanvasIstances.get(instanceName) as ReturnType<typeof createCanvasInstance>;

      if (canvasInstace === undefined) {
        canvasInstace = createCanvasInstance(props.dataBuffer, props.colorsBuffer);
        mapOfCanvasIstances.set(instanceName, canvasInstace);
      }

      return canvasInstace;
    },
    buildComponent(instanceName: string) {
      let canvasInstace = mapOfCanvasIstances.get(instanceName) as ReturnType<typeof createCanvasInstance>;

      if (canvasInstace === undefined) {
        canvasInstace = createCanvasInstance(props.dataBuffer, props.colorsBuffer);
        mapOfCanvasIstances.set(instanceName, canvasInstace);
      }
      
      const canvasRef = createRef<HTMLCanvasElement>();

      return function HexMapCanvasComponent(props: any) {
        useEffect(function mount(){
          canvasInstace.setCanvasElement(canvasRef.current);

          return function unmount() {
            canvasInstace.setCanvasElement(null);
          }
        });
        return React.createElement('canvas', {ref: canvasRef, className: props.className || 'hexmap'});
      }
    }
  };

  return instance;
}