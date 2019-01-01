export class Observable<VV extends any[] = []>
{
    public reset(): this
    {
        throw new Error( 'method not yet implemented' );
    }

    public notify( ...values: VV ): this
    {
        throw new Error( 'method not yet implemented' );
    }

    public has( ...observers: ObserverLike<VV>[] ): boolean
    {
        throw new Error( 'method not yet implemented' );
    }

    public register( ...observers: ObserverLike<VV>[] ): this
    {
        throw new Error( 'method not yet implemented' );
    }

    public unregister( ...observers: ObserverLike<VV>[] ): this
    {
        throw new Error( 'method not yet implemented' );
    }
}

export class StageObservable<VV extends any[] = []> extends Observable<VV>
{
}

export interface ObserverLike<VV extends any[]>
{
    ( ...values: VV ): any;
}
