// https://github.com/Tonejs/Tone.js/#hello-tone
import { Synth, Loop, Transport, Reverb } from "tone";

import { example_data } from './constants.js';

// Start the clock
Transport.toggle();

// create a synth and connect it to the master output
const synth = new Synth(
  {
    oscillator: {
      type: 'triangle'
    },
      envelope : {
        attack : 0.01,
        decay : 0.25,
        sustain : 0.35,
        release : 0.02
    }
  }
).toMaster();

const normalize = (data, new_min, new_max) => {
  const values = Object.values(data);
  const min = Math.min.apply(Math, values);
  const max = Math.max.apply(Math, values);

  const newValues = values.map((value) => {
    return (new_max - new_min) * ((value - min) / (max - min)) + new_min;
  });

  return newValues;
};

const normalized_values = normalize(example_data, 50, 1000);
let idx = 0;

const loop_callback = (time) => {
  let new_val = normalized_values[idx];
  console.log(new_val);
  synth.triggerAttackRelease(new_val, '4n', time);
  if (normalized_values[idx + 1]) {
    idx += 1;
  } else {
    idx = 0;
  }
};

const loop = new Loop(loop_callback, '16n');

loop.start(0);
