import * as Highcharts from "highcharts";
import { Oscillator, Sequence, Transport } from "tone";

import { fetch_url } from './constants';

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

  if (note.hasOwnProperty('callback')) {
    note.callback();
  };

};

const initialize_sequence_with_data = () => {
  fetch(fetch_url)
  .then(response => response.json())
  .then(data => {
    let normalized_values = normalize(data, 20, 800);

    const dates = normalized_values.map((note) => {
      return note.date;
    });
    const original_values = normalized_values.map((note) => {
      return note.original_value;
    });

    const chart = Highcharts.chart('chart', {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Sea Ice Extent',
      },
      xAxis: {
        categories: dates
      },
      series: [{
        name: 'Sea Ice Extent',
        data: [],
      }],
      chart: {
        animation: false,
      },
      plotOptions: {
        series: {
          animation: false
        }
      },
    });

    // Add a 'final note' with a callback that will stop the sequence and the
    // synth. Prevents the last note from playing out indefinitely.
    let final_note = Object.assign({}, normalized_values[normalized_values.length - 1]);
    final_note.callback = () => {
        seaice_seq.stop();
        synth.stop();
    };
    normalized_values.push(final_note);

    const seaice_seq = new Sequence((time, note) => {
      updateNote(note);
      chart.series[0].addPoint([note.date, note.original_value]);
    }, normalized_values, '16n');

    seaice_seq.loop = false;
    Transport.start();
    // Update the synth with the first note, so that when the audio starts
    // playing, it is from the first value of data that we have.
    updateNote(normalized_values[0]);
    synth.start();
    seaice_seq.start();
  });
};

initialize_sequence_with_data();
