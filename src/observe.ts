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
        for ( let observer of Array.from( observables.get( this )! ) )
        {
            observer( ...values );
        }

        return this;
    }

    public has( ...observers: ObserverLike<VV>[] ): boolean
    {
        const upzervers = observables.get( this )!;

        return observers.length
            ? observers.every( observer =>
                upzervers.has( <ObserverLike<any[]>>observer ) )
            : !!upzervers.size
    }

    public register( ...observers: ObserverLike<VV>[] ): this
    {
        const upzervers = observables.get( this )!;

        for ( let observer of observers )
        {
            upzervers.add( <ObserverLike<any[]>>observer );
        }

        return this;
    }

    public unregister( ...observers: ObserverLike<VV>[] ): this
    {
        const upzervers = observables.get( this )!;

        for ( let observer of observers )
        {
            upzervers.delete( <ObserverLike<any[]>>observer );
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
        const upzervers = observables.get( this )!;
        const freshly = observers.filter( observer => !upzervers.has( <ObserverLike<any[]>>observer ) );

        super.register( ...observers );

        if ( stages.has( this ) )
        {
            const values = stages.get( this )!;

            for ( let upzerver of freshly )
            {
                upzerver( ...<VV>values );
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
