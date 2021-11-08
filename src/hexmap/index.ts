import { createInstance } from './module';
const mapOfInstances = new Map<string, ReturnType<typeof createInstance>>();

export default function getHexMapInstance(
  instanceName: string = 'defualt'
) {
  let instance = mapOfInstances.get(instanceName);
  
  if (instance === undefined) {
    instance = createInstance();
  }

  return instance;
}
