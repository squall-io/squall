/**
 *
 * This class stands as the corridor between they that want to report
 * changes of their internal value and the observers that want to be informed of changes.
 *
 */
export class Observable<VV extends any[] = []>
{
    public constructor()
    {
        observables.set( this, new Set() );
    }

    /**
     *
     * Removes all registered observers.
     *
     */
    public reset(): this
    {
        observables.get( this )!.clear();

        return this;
    }

    /**
     *
     * Calls/Executes the registered observers with spread values.
     *
     * @param values
     *
     */
    public notify( ...values: VV ): this
    {
        for ( let observer of observables.get( this )! )
        {
            observer( ...values );
        }

        return this;
    }

    /**
     *
     * Returns a boolean (true) if ALL given observers are registered, false otherwise.
     *
     * > If no observer if given, returned value as
     * >
     * > - false, means that no observer is registered
     * > - true, means that at least one observer is registered
     *
     * @param observers
     *
     */
    public has( ...observers: ObserverLike<VV>[] ): boolean
    {
        const upzervers = observables.get( this )!;

        return observers.length
            ? observers.every( observer =>
                upzervers.has( <ObserverLike<any[]>>observer ) )
            : !!upzervers.size
    }

    /**
     *
     * Registers given observers to be called/executed over changes on this observable.
     *
     * @param observers
     *
     */
    public register( ...observers: ObserverLike<VV>[] ): this
    {
        const upzervers = observables.get( this )!;

        for ( let observer of observers )
        {
            upzervers.add( <ObserverLike<any[]>>observer );
        }

        return this;
    }

    /**
     *
     * Stop calling/executing given observers over changes on this observable.
     *
     * @param observers
     *
     */
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
/**
 *
 * This class stands as the corridor between they that want to report
 * changes of their internal value and the observers that want to be informed of changes.
 *
 * > Unlike Observable base class, this instance cache #notify() values
 * > and notifies new registering observers as soon as they are registered.
 *
 */
export class StageObservable<VV extends any[] = []> extends Observable<VV>
{

    /**
     *
     * Removes all registered observers and clear any cached values.
     *
     */
    public reset(): this
    {
        stages.delete( this );
        super.reset();

        return this;
    }

    /**
     *
     * Calls/Executes the registered observers with spread values.
     *
     * > It also caches the parameters for later #register() notification.
     *
     * @param values
     *
     */
    public notify( ...values: VV ): this
    {
        stages.set( this, values );
        super.notify( ...values );

        return this;
    }

    /**
     *
     * Registers given observers to be called/executed over changes on this observable.
     *
     * > If this observable had some values cached, freshly
     * > registered observers are called/executed immediately.
     *
     * @param observers
     *
     */
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

/**
 *
 * Signature of functions that observes changes over an Observable
 *
 */
export interface ObserverLike<VV extends any[]>
{
    ( ...values: VV ): any;
}

const stages = new WeakMap<StageObservable<any[]>, any[]>();
const observables = new WeakMap<Observable<any[]>, Set<ObserverLike<any[]>>>();
