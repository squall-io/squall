/**
 *
 * Observable
 *
 * Instance of this class are meant to report changes of value/s.
 *
 * @since Jan 1, 2019
 * @author Salathiel Genese <salathielgenese@gmail.com>
 *
 */
export class Observable<VV extends any[] = []>
{
    protected readonly observers = new Set<ObserverLike<VV>>();

    /**
     *
     * Unregisters all observers.
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public reset(): this
    {
        this.observers.clear();

        return this;
    }

    /**
     *
     * Notify observers of value/s change.
     *
     * This executes the registered observers with ...values.
     *
     * @param values Values to notify observers with.
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public notify( ...values: VV ): this
    {
        for ( let observer of this.observers )
        {
            observer( ...values );
        }

        return this;
    }

    /**
     *
     * Returns a boolean indicating weither given observers are registered.
     *
     * true if all observers are registered OR no observer is given but still, some observers are registered - false otherwise.
     *
     * @param observers Observers to check if they are registered.
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public has( ...observers: ObserverLike<VV>[] ): boolean
    {
        const _observers = this.observers;

        if ( 0 === observers.length )
        {
            return !!_observers.size;
        }

        for ( let observer of new Set( observers ) )
        {
            if ( !_observers.has( observer ) )
            {
                return false;
            }
        }

        return true;
    }

    /**
     *
     * Registers given observers to notify them on value/s change.
     *
     * NOTE: Values are deduped so that no observer can be registered more than once.
     *
     * @param observers Observers to register.
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public register( ...observers: ObserverLike<VV>[] ): this
    {
        const _observers = this.observers;

        for ( let observer of new Set( observers ) )
        {
            _observers.add( observer );
        }

        return this;
    }

    /**
     *
     * Unregisters given obervers.
     *
     * This prevents the removed observers from being notified of subsequent value change/s.
     *
     * @param observers Observers to unregister.
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public unregister( ...observers: ObserverLike<VV>[] ): this
    {
        const _observers = this.observers;

        for ( let observer of observers )
        {
            _observers.delete( observer );
        }

        return this;
    }
}

/**
 *
 * StageObservable
 *
 * Instances of this class are like those of Observable except that
 * latest reported change are cached so that listeners are updated
 * as soon as they are newly registered.
 *
 * @example
 * ```ts
 * const observable = new StageObservable<string>();
 *
 * observable.notify( '50+ qbits is not enough yet !' ).register( console.log );
 *
 * // "50+ qbits is not enough yet !" will logged to the console
 * ```
 *
 * @since Jan 1, 2019
 * @author Salathiel Genese <salathielgenese@gmail.com>
 *
 */
export class StageObservable<VV extends any[] = any[]> extends Observable<VV>
{

    private static readonly UNSET = <any[]>[];

    protected values = <VV>StageObservable.UNSET;

    /**
     *
     * Unregisters all observers and clear cached value/s.
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public reset(): this
    {
        const { UNSET } = StageObservable;

        this.values = <VV>UNSET;
        super.reset();

        return this;
    }

    /**
     *
     * Notify observers of value/s change.
     *
     * This executes the registered observers with ...values.
     *
     * @param values Values to notify observers with.
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public notify( ...values: VV ): this
    {
        this.values = values;
        super.notify( ...values );

        return this;
    }

    /**
     *
     * Registers given observers to notify them on value/s change.
     *
     * NOTE: Values are deduped so that no observer can be registered more than once.
     *
     * NOTE: If any value/s are cached, notify new (yet unregistered) observers with.
     *
     * @param observers Observers to register.
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public register( ...observers: ObserverLike<VV>[] ): this
    {
        const { values, observers: _observers } = this;

        observers = [ ...new Set( observers ) ];

        if ( StageObservable.UNSET === values )
        {
            super.register( ...observers );
        }
        else
        {
            const newObservers = observers.filter( observer => !_observers.has( observer ) );

            for ( let observer of newObservers )
            {
                observer( ...values );
            }
        }

        return this;
    }
}

/**
 *
 * ObserverLike
 *
 * This interface describe the signature of a callback to be executed by an observable when notified of value change.
 *
 * @since Jan 1, 2019
 * @author Salathiel Genese <salathielgenese@gmail.com>
 *
 */
export interface ObserverLike<VV extends any[] = any[]>
{
    ( ...values: VV ): any;
}