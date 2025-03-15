const getRandInt = (max: number) => {
  return Math.max(1, Math.floor(Math.random() * max));
};

export const getCluesFunFactAndTriviaIndices = (destination: {
  trivia: string[];
  funFacts: string[];
  clues: string[];
}) => {
  const { clues, funFacts, trivia } = destination;

  const clueIndex = getRandInt(clues.length - 1) - 1;
  const funFactIndex = getRandInt(funFacts.length - 1) - 1;
  const triviaIndex = getRandInt(trivia.length - 1) - 1;

  return {
    clueIndex,
    funFactIndex,
    triviaIndex,
  };
};
