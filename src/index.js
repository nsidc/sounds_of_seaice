// https://github.com/Tonejs/Tone.js/#hello-tone
import { Synth } from "tone";

// create a synth and connect it to the master output (your speakers)
const synth = new Synth().toMaster();

//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease('C4', '8n');
