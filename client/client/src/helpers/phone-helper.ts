export function phoneHelper(str: string): string {
  if (str.length !== 0 && str.length % 3 === 0) {
    if (!str.endsWith("-")) {
      return str.slice(0, str.length - 1) + "-" + str.charAt(str.length - 1);
    }

    return str.slice(0, str.length - 1);
  } else {
    return str;
  }
}
