declare module 'eslint-plugin-import' {
  declare const flatConfigs: Record<string, TSESLint.FlatConfig.Config>;
  export = { flatConfigs };
}

declare module 'eslint-plugin-react-hooks' {
  declare const configs: Record<string, TSESLint.FlatConfig.Config>;
  export = { configs };
}
