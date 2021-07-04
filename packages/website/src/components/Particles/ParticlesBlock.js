import Particles from 'react-tsparticles';
import { Component } from 'react';

export class ParticlesBlock extends Component {
  constructor(props) {
    super(props);
    this.particlesInit = this.particlesInit.bind(this);
    this.particlesLoaded = this.particlesLoaded.bind(this);
    this.params = props.params;
  }

  particlesInit(main) {
    // console.log(main);
    // you can initialize the tsParticles instance (main) here,
    // adding custom shapes or presets
  }

  particlesLoaded(container) {
    // console.log(container);
  }

  render() {
    return (
      <Particles
        id="tsparticles"
        init={this.particlesInit}
        loaded={this.particlesLoaded}
        options={this.params}
      />
    );
  }
}
