export type FirstLetter<T extends string> = T extends `${infer F}${string}` ? F : never;
