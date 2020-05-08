const world = "Hello World !";

export function hello(word: string = world): string {
  return `Hello ${world}! `;
}
