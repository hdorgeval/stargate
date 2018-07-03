import React, { Component, Fragment } from 'react';
import '../main.css';
import { World } from './world';

let mousePos = { x: 0, y: 0, px: 0, py: 0 };
let world;

class App extends Component {
  render() {
    return (
      <Fragment>
        <div className="world"></div>
      </Fragment>
    );
  }

  componentDidMount() {
    const world = new World(this.container, this.renderer, window.innerWidth, window.innerHeight);
    
    window.addEventListener('resize', () => this.handleWindowResize(), false);
    document.addEventListener('mousemove', () => this.handleMouseMove(), false);
    this.handleWindowResize();
    world.loop();
  }

  handleWindowResize() {
    world.updateSize(window.innerWidth, window.innerHeight);
  }

  handleMouseMove(e) {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      mousePos.px = mousePos.x / window.innerWidth * 2 - 1;
      mousePos.py = mousePos.y / window.innerHeight * 2 - 1;

      world.mouseMove(mousePos);
  }
}

export default App;
