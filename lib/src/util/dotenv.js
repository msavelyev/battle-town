import process from 'process';
import data from '../../env.js';

export default function () {

  for (let [key, value] of Object.entries(data)) {
    process.env[key] = value;
  }

};
