// Return a random int less than max (may be 0)
export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// Return random item from array
export function randomChoice(arr: any[]) {
  return arr[randomInt(arr.length)];
}

// Take array list of relative chances, return index of choice
export function weightedChoice(weights: number[]) {
  // Get total weight of all options
  const total = weights.reduce((a, b) => a + b, 0);
  let targetVal = randomInt(total);
  for (let i = 0; i < weights.length; i++) {
    targetVal -= weights[i];
    if (targetVal < 0) {
      return i;
    }
  }
}
