
export default function increaseTick(oldValue, setter) {
  let newValue = oldValue + 1;
  if (oldValue === 4294967296) {
    newValue = 0;
  }
  setter(newValue);
  return newValue;
};
