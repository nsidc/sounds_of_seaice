// https://github.com/Tonejs/Tone.js/#hello-tone
import { Sequence, Synth, Transport } from "tone";

import { fetch_url} from './constants';

// create a synth and connect it to the master output
const synth = new Synth({
  envelope: {
    attack: 0.005,
    sustain: 1,
    decay: 0.1,
    release: 1,
  }
}).toMaster();

const normalize = (data, new_min, new_max) => {
  const values = Object.values(data);
  const min = Math.min.apply(Math, values);
  const max = Math.max.apply(Math, values);

  // TODO sort by date (key of data object)
  let newValues = [];
  for (let [date, value] of Object.entries(data)) {
    newValues.push({
      date,
      value: (new_max - new_min) * ((value - min) / (max - min)) + new_min});
  }

  return newValues;
};

const initialize_sequence_with_data = () => {
  fetch(fetch_url)
  .then(response => response.json())
  .then(data => {
    // TODO: display date along w/ tone.
    const normalized_values = normalize(data, 50, 1000);

    const seaice_seq = new Sequence((time, note) => {
      document.getElementById('date').innerHTML = note.date;
      synth.triggerAttackRelease(note.value, '16n', time);
    }, normalized_values, '16n');

    seaice_seq.loop = false;
    Transport.start();
    seaice_seq.start();
  });
};

initialize_sequence_with_data();
