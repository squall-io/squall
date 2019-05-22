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
}
