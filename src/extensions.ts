declare global {
  interface String {
    /**
     * Converts the first character of the string to upper-case
     * and the rest to lower-case.
     *
     * @example
     * "hELLO wORLD".toProperCase(); // "Hello World"
     */
    toProperCase(): string;
  }
}

String.prototype.toProperCase = function (this: string): string {
  return this.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};

export {};