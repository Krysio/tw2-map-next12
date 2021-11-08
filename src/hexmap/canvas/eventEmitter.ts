import { EventEmitter } from "events";

type coords = {x: number, y: number};
interface EventList {
  'hover/tile': coords,
  'click/tile': coords,
  'size/tile': [number, number],
  'position/tile': coords,
  'canvas/move': boolean,
  'canvas/enter': void,
  'canvas/leave': void
}

export default class TypedEventEmitter extends EventEmitter {
  emit<Key extends keyof EventList>(
      ...args: EventList[ Key ] extends void
        ? [Key]
        : [Key, EventList[ Key ]]
  ): boolean {
      return super.emit(args[0], args[1]);
  }
  on<Key extends keyof EventList>(
      command: Key,
      listener:
          EventList[ Key ] extends void
              ? () => void
              : (data: EventList[ Key ]) => void
  ): this {
      return super.on(command, listener);
  }
  removeListener<Key extends keyof EventList>(
      command: Key,
      listener:
          EventList[ Key ] extends void
              ? () => void
              : (data: EventList[ Key ]) => void
  ): this {
      return super.removeListener(command, listener);
  }
}