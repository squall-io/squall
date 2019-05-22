export class Injector
{
    /**
     *
     * Get dependency from injector
     *
     * @param param0 dependency setup
     *
     */
    public get<T>({ id }: { id: string }): T;
    public get<T>({ type }: { type: ConstructorLike<T> }): T;
    public get<T>({ id, type }: { id: string, type: ConstructorLike<T> }): T;
    public get<T>({ id, type }: { id?: string, type?: ConstructorLike<T> }): T
    {
        throw new Error( 'Not yet implemented' );
    }

    /**
     *
     * Get dependency from injector
     *
     * @param param0 dependency setup
     *
     */
    public set<T>({ id, value }: { id: string, value: T }): T;
    public set<T>({ type, value }: { type: ConstructorLike<T>, value: T }): T;
    public set<T>({ id, type, value }: { id: string, type: ConstructorLike<T>, value: T }): T;
    public set<T>({ id, type, value }: { id?: string, type?: ConstructorLike<T>, value: T }): T
    {
        throw new Error( 'Not yet implemented' );
    }
}
