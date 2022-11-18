function trimStringFromMiddle(
  str: string | undefined | null,
  maxLength: number
) {
  if (!str) return "";

  if (str.length <= maxLength) {
    return str;
  }

  const halfLength = Math.floor(maxLength / 2);
  return str.slice(0, halfLength) + "..." + str.slice(-halfLength);
}

export { trimStringFromMiddle };
