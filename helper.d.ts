/**
 *
 * Split object per key-map, even unions
 *
 */
type Split<T> = ReturnType<T extends any ?
    <K extends keyof T>() => K extends any ?
        { [ _ in K ]: T[ _ ] } : never : never>;

/**
 *
 * Distributive valueof
 *
 * Unlike `T[ keyof T ]`, T union is first distributed
 *
 */
type ValueOf<T> = T extends any ? T[ keyof T ] : never;

/**
 *
 * Distributive keyof
 *
 * Unlike core keyof, distributive version don't resolves union key to never
 *
 */
type KeyOf<T> = T extends any ? keyof T : never;

type KeysNotMappedTo<T extends {}, E> = { [ key in keyof T ]: T[key] extends E ? never : key; }[keyof T];
type ConstructorLike<T extends {} = {}, P extends any[] = any[]> = new( ...parameters: P ) => T;
type KeysMappedTo<T extends {}, E> = Exclude<keyof T, KeysNotMappedTo<T, E>>;
