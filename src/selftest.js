import { mapTextToCommand } from './nlu.js';
const samples = [
  'Prendé la linterna',
  'Apagá el flash',
  'Hacé parpadear la linterna 5 veces cada 200 ms',
  'no entiendo'
];
for (const s of samples) console.log(s, '->', mapTextToCommand(s));
