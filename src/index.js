// https://github.com/Tonejs/Tone.js/#hello-tone
import { Sequence, Synth, Transport } from "tone";

import { example_data } from './constants.js';

// Start the clock
Transport.toggle();

// create a synth and connect it to the master output
const synth = new Synth().toMaster();

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

const seaice_seq = new Sequence((time, note) => {
  synth.triggerAttackRelease(note, '16n', time);
}, normalized_values, '16n');

seaice_seq.loop = false;
seaice_seq.start();
