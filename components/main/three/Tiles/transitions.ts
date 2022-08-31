const transitionTypes = {
  0: [
    [0, 0, 1, 1, 0, 0], //Forest A
    [1, 1, 0, 0, 0, 1], //Forest C
    [1, 1, 0, 0, 1, 1], //Forest D

    [0, 0, 2, 2, 0, 0], //Rock A
    [2, 2, 0, 0, 0, 2], //Rock C
    [2, 2, 0, 0, 2, 2], //Rock D

    [0, 0, 3, 3, 0, 0], //Sand A
    [3, 3, 0, 0, 0, 3], //Sand C
    [3, 3, 0, 0, 3, 3], //Sand D
  ],
}

export function getTransition(biome: number, biomeBorders: number[]): {type: number, orientation: number} {
  // Keep track of connections to avoid additional calculations on every board change
  // If there are no connections, return null
  if (!biomeBorders || !biomeBorders.length || !(biome in transitionTypes)) return null;
  
  // Try each rotation of tile to see if any road type fits at any orientation
  for (let orientation = 0; orientation < 6; orientation++) {
    // Check if any of the road types fit
    biomeLoop: for (let type = transitionTypes[biome].length - 1; type >= 0; type--) {
      for (let i = 0; i < 6; i++) {
        // Check if any point in connections (offset by orientation does not fit)
        if (!!transitionTypes[biome][type][(i + orientation) % 6] !== !!(biomeBorders[i] ?? 0)
          || transitionTypes[biome][type][(i + orientation) % 6] > (biomeBorders[i] ?? 0)) {
          // If any point is not included, give up on this type at this orientation
          continue biomeLoop;
        }
      }
      // If here, all connections points passed at this orientation
      return { type, orientation }
    }
  }

  return null;
}