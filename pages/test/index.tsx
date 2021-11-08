import React from 'react';
import type { NextPage } from 'next';
import styles from 'styles/Test.module.css';
import getHexMapInstance from '@/hexmap';

const hexMapInstance = getHexMapInstance();

const Home: NextPage = function () {
  const canvasInstance = hexMapInstance.getCanvasInstance('main');
  const [ centerX, centerY ] = canvasInstance.usePositionCoords();
  const [ hoverX, hoverY ] = canvasInstance.useHoverCoords();

  const pre = `${centerX}|${centerY}\n${hoverX}|${hoverY}`;

  return (
    <div className={styles.container}>
      <pre className={styles.pre}>{ pre }</pre>
      <canvasInstance.Component className={styles.canvas} />
    </div>
  )
}

export default Home;
