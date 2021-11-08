import { useEffect, useState } from "react";
import { Props } from ".";
import { Api } from "./api";

export function buildHooks(
  props: Props,
  api: Api
) {
  const tileCenter = props.state.tile.center;
  const tileHover = props.state.tile.hover;

  return {
    usePositionCoords() {
      const [ valueX, setX ] = useState(tileCenter.x);
      const [ valueY, setY ] = useState(tileCenter.y);

      useEffect(() => {
        const eventHandler = (coords: {x: number, y: number}) => {
          setX(coords.x);
          setY(coords.y);
        };
        props.events.on('position/tile', eventHandler);

        return () => {
          props.events.removeListener('position/tile', eventHandler);
        };
      }, []);

      return [valueX, valueY];
    },
    useHoverCoords() {
      const [ valueX, setX ] = useState(tileHover.x);
      const [ valueY, setY ] = useState(tileHover.y);

      useEffect(() => {
        const eventHandler = (coords: {x: number, y: number}) => {
          setX(coords.x);
          setY(coords.y);
        };
        props.events.on('hover/tile', eventHandler);

        return () => {
          props.events.removeListener('hover/tile', eventHandler);
        };
      }, []);

      return [valueX, valueY];
    }
  };
}