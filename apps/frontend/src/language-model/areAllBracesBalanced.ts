export const areAllBracesBalanced = (content: string) => {
  const stack: string[] = [];
  for (const char of content) {
    if (char === '"') {
      if (stack.length > 0 && stack[stack.length - 1] === '"') {
        stack.pop();
      } else {
        stack.push(char);
      }
    } else {
      if (stack.length > 0 && stack[stack.length - 1] === '"') {
        // inside a string, ignore braces
        continue;
      }
      if (char === "{") {
        stack.push(char);
      } else if (char === "}") {
        if (stack.length === 0) {
          return false;
        }
        stack.pop();
      }
    }
  }
  return stack.length === 0;
};
