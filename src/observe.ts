export class Observable<VV extends any[] = []>
{
    public constructor()
    {
        observables.set( this, new Set() );
    }

    public reset(): this
    {
        observables.get( this )!.clear();

        return this;
    }

    public notify( ...values: VV ): this
    {
        for ( let observer of Array.from( observables.get( this )!.values() ) )
        {
            observer( ...values );
        }

        return this;
    }

    public has( ...observers: ObserverLike<VV>[] ): boolean
    {
        const zervers = observables.get( this )!;

        return observers.length
            ? observers.every( observer =>
                zervers.has( <ObserverLike<any[]>>observer ) )
            : !!zervers.size
    }

    public register( ...observers: ObserverLike<VV>[] ): this
    {
        for ( let observer of observers )
        {
            observables.get( this )!.add( <ObserverLike<any[]>>observer );
        }

        return this;
    }

    public unregister( ...observers: ObserverLike<VV>[] ): this
    {
        for ( let observer of observers )
        {
            observables.get( this )!.delete( <ObserverLike<any[]>>observer );
        }

        return this;
    }
}

export class StageObservable<VV extends any[] = []> extends Observable<VV>
{

    public reset(): this
    {
        stages.delete( this );
        super.reset();

        return this;
    }

    public notify( ...values: VV ): this
    {
        stages.set( this, values );
        super.notify( ...values );

        return this;
    }

    public register( ...observers: ObserverLike<VV>[] ): this
    {
        const zervers = observables.get( this )!;
        const priorObservers = new Set( zervers );

        super.register( ...observers );

        if ( stages.has( this ) )
        {
            const values = stages.get( this )!;

            for ( let zerver of Array.from( zervers ) )
            {
                if ( !priorObservers.has( zerver ) )
                {
                    zerver( ...values );
                }
            }
        }

        return this;
    }
}

export interface ObserverLike<VV extends any[]>
{
    ( ...values: VV ): any;
}

const stages = new WeakMap<StageObservable<any[]>, any[]>();
const observables = new WeakMap<Observable<any[]>, Set<ObserverLike<any[]>>>();
