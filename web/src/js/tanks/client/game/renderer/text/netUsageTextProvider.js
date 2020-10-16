import dotenv from '@Lib/tanks/lib/util/dotenv.js';

function format(value) {
  let power = 0;
  while (value > 1024) {
    value /= 1024;
    power += 1;
  }

  return `${Math.round(value * 100) / 100} ${LITERALS[power]}/s`;
}

const LITERALS = [
  'b',
  'Kb',
  'Mb'
]

export default function(client) {
  return () => {
    if (!dotenv.SETTINGS.DEBUG_INFO) {
      return null;
    }

    const usage = client.netClient.usage;
    return [
      'out: ' + format(usage.last.write),
      'in: ' + format(usage.last.read)
    ];

  };
}
