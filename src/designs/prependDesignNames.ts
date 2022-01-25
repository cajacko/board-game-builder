import { Designs } from "./types";

function prependDesignNames(prepend: string, designs: Designs): Designs {
  const transformedDesigns: Designs = {};

  return Object.entries(designs).reduce(
    (accumulator, [key, value]): Designs => {
      return {
        ...accumulator,
        [`${prepend}${key}`]: value,
      };
    },
    transformedDesigns
  );
}

export default prependDesignNames;
