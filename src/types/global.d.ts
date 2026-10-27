declare module '*.svg' {
  const content: string;
  export default content;
}

// webpack's require.context, which the dev log uses to find its posts
interface NodeRequire {
  context(directory: string, useSubdirectories?: boolean, regExp?: RegExp): {
    keys(): string[];
    (id: string): unknown;
  };
}
