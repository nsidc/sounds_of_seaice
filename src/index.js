// https://github.com/Tonejs/Tone.js/#hello-tone
import { Sequence, Oscillator, Transport } from "tone";

import { fetch_url} from './constants';

const synth = new Oscillator().toMaster();

const normalize = (data, new_min, new_max) => {
  const values = Object.values(data);
  // Filter out null values
  // TODO: reconsider. THis operation happens again in the loop below.
  const filtered_values = values.filter(x => x);

  // Get the min & max values
  const min = Math.min.apply(Math, filtered_values);
  const max = Math.max.apply(Math, filtered_values);

  // TODO sort by date (key of data object)
  let newValues = [];
  for (let [date, value] of Object.entries(data)) {
    // Filter out null values
    if (value) {
      newValues.push({
        date,
        // calculate the new value.
        value: (new_max - new_min) * ((value - min) / (max - min)) + new_min,
        original_value: value,
      });
    };
  }

  return newValues;
};

const updateNote = (note) => {
  document.getElementById('infoDiv').innerHTML = `${note.date}: ${note.original_value.toFixed(3)} mkm2`;

  synth.frequency.value = note.value;
};

const initialize_sequence_with_data = () => {
  fetch(fetch_url)
  .then(response => response.json())
  .then(data => {
    const normalized_values = normalize(data, 50, 1000);

    const seaice_seq = new Sequence((time, note) => {
      updateNote(note);
    }, normalized_values, '16n');

    seaice_seq.loop = false;
    Transport.start();
    updateNote(normalized_values[0]);
    synth.start();
    seaice_seq.start();
  });
};

initialize_sequence_with_data();
