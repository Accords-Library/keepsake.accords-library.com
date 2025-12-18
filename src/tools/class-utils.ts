type InputValue = string | Record<string, boolean> | undefined | null;

export const c = (input: InputValue | InputValue[]): string | undefined => {
  if (typeof input === "string" && input !== "") {
    return input;
  }

  if (typeof input === "object" && input) {
    if (input instanceof Array) {
      return c(input.map(c).join(" "));
    }

    return c(
      Object.entries(input)
        .filter(([_, value]) => value)
        .map(([key]) => key),
    );
  }

  return undefined;
};
