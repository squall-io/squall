type KeysNotMappedTo<T extends {}, E> = { [ key in keyof T ]: T[key] extends E ? never : key; }[keyof T];
type ConstructorLike<T extends {} = {}, P extends any[] = any[]> = new( ...parameters: P ) => T;
type KeysMappedTo<T extends {}, E> = Exclude<keyof T, KeysNotMappedTo<T, E>>;
