import React from 'react';
import type { NextPage } from 'next';
import styles from 'styles/Test.module.css';
import getHexMapInstance from '@/hexmap';

const hexMapInstance = getHexMapInstance();

const Home: NextPage = function () {
  const { HexMap, usePositionCoords, useHoverCoords } = hexMapInstance.getCanvasInstance('main');
  const [ centerX, centerY ] = usePositionCoords();
  const [ hoverX, hoverY ] = useHoverCoords();

  const pre = `${centerX}|${centerY}\n${hoverX}|${hoverY}`;
  
  return (
    <div className={styles.container}>
      <pre className={styles.pre}>{ pre }</pre>
      <HexMap className={styles.canvas} />
    </div>
  )
}

export default Home;
