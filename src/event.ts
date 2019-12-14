/**
 *
 * Emitter
 *
 * Instances of this class emits events to be listerned to by registration of event listeners.
 *
 * @since Jan 1, 2019
 * @author Salathiel Genese <salathielgenese@gmail.com>
 *
 *
 */
export class Emitter<EL extends Emitter.EventParametersLike = Emitter.EventParametersLike>
{

    private readonly listeners = new Map<string, Map<ListenerLike<string, any[]>, number>>();

    /**
     *
     * Triggers an event by its name
     *
     * This method will call/execute all registered listeners for this event.
     * Well, all listeners except if some listeners call event.stopPropagation().
     *
     * @param name Event name
     * @param parameters Listeners' parameters
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public trigger<N extends Extract<keyof EL, string>, PP extends EL[N]>( name: N, ...parameters: PP ): Event<N, this>
    {
        const event = new Event( name, this );
        const container = this.listeners.get( name );

        for ( const listener of container?.keys() ?? [] )
        {
            listener( event, ...parameters );
            container?.set( listener, container?.get( listener )! - 1 );
            container?.get( listener ) || container?.delete( listener );

            if ( event.isPropagationStopped )
            {
                break;
            }
        }

        0 === container?.size && this.listeners.delete( name );

        return event;
    }

    /**
     *
     * Registers listeners under supplied event's name.
     *
     * No listener is registered twice under the same event's name.
     * Is an any time a listener is re-registered, its `times` countdown will
     * be overrode by the new value as if it was registered the for the first time.
     *
     * @param name Event name
     * @param times Number of callbacks notifications before removal
     * @param listeners Event listeners to register for the supplied event
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public on<N extends Extract<keyof EL, string>, PP extends EL[N], L extends ListenerLike<N, PP, this>>( name: N, ...listeners: L[] ): this;
    public on<N extends Extract<keyof EL, string>, PP extends EL[N], L extends ListenerLike<N, PP, this>>( name: N, times: number, ...listeners: L[] ): this;
    public on<N extends Extract<keyof EL, string>, PP extends EL[N], L extends ListenerLike<N, PP, this>>( name: N, times: number | L, ...listeners: L[] ): this
    {
        const IS_TIMES_A_FUNTION = 'function' === typeof times;

        IS_TIMES_A_FUNTION && listeners.unshift( times as L );

        if ( IS_TIMES_A_FUNTION || 0 > times )
        {
            times = Number.POSITIVE_INFINITY;
        }

        const container = this.listeners.get( name ) ?? this.listeners.set( name, new Map() ).get( name )!;

        for ( let listener of new Set( listeners ) )
        {
            container.set( <any>listener, <number>times );
        }

        return this;
    }

    /**
     *
     * Unregisters listeners for the given event.
     *
     * NOTE:
     *  - if a listener was not registered, nothing relevant happen of him
     *  - if no listener is supplied, nothing happens.
     *
     * @param name Event name
     * @param listeners Event listeners to unregister
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public off<N extends Extract<keyof EL, string>, PP extends EL[N], L extends ListenerLike<N, PP, this>>(name: N, ...listeners: L[]): this
    {
        const container = this.listeners.get( name );

        for ( let listener of new Set( listeners ) )
        {
            container?.delete( <any>listener );
        }

        0 === container?.size && this.listeners.delete( name );

        return this;
    }

    /**
     *
     * Returns boolean indicating weither listeners are registered under the given event's name.
     *
     * Returns :
     *  - true : if all listeners are registered under the event's name
     *           OR no listener is provided but the emitter still have some listeners registered under this event's name.
     *  - false : if any of the listeners is registered under the event's name
     *            OR no listener is provided and the emitter has no listener registered under this event's name.
     *
     * @param name Event name
     * @param listeners Event listeners to check for registered state
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public has<N extends Extract<keyof EL, string>, PP extends EL[N], L extends ListenerLike<N, PP, this>>(name: N, ...listeners: L[]): boolean
    {
        const container = this.listeners.get( name );

        if ( !listeners.length )
        {
            return !!container?.size;
        }

        for ( let listener of new Set( listeners ) )
        {
            if ( !container?.has( <any>listener ) )
            {
                return false;
            }
        }

        return true;
    }
}

export module Emitter
{
    export type EventParametersLike = { [name: string]: any[] };
}

/**
 *
 * Enent
 *
 * Instances of this class represent the occurrence of something.
 *
 * @since Jan 1, 2019
 * @author Salathiel Genese <salathielgenese@gmail.com>
 *
 */
export class Event<N extends string = string, E extends Emitter = Emitter>
{

    /**
     *
     * Holds the immutable name of the event as it was triggered.
     *
     */
    public readonly name: N;

    /**
     *
     * Holds the immutable emmitter which triggered the event.
     *
     */
    public readonly emitter: E;

    /**
     *
     * Holds the immutable timestamp at which the event was instantiated.
     *
     */
    public readonly timestamp = Date.now();
    /**
     *
     * Holds the default prevented state of the event.
     *
     */
    public readonly isDefaultPrevented = false;
    /**
     *
     * Holds the propagationStopped state of the event.
     *
     */
    public readonly isPropagationStopped = false;

    public constructor(name: N, emitter: E)
    {
        this.emitter = emitter;
        this.name = name;
    }

    /**
     *
     * Marks an event to prevent its default behaviour.
     *
     * NOTE: It is actually up to the developper to prevent
     *       default behaviour executions when the event is
     *       triggered by the emitter.
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public preventDefault(): this
    {
        (<any>this).isDefaultPrevented = true;

        return this;
    }

    /**
     *
     * Marks an event as to stop its propagation through registered listeners.
     *
     * This has the effect of not call/execute registered event that haven't been called already.
     *
     * @since Jan 1, 2019
     * @author Salathiel Genese <salathielgenese@gmail.com>
     *
     */
    public stopPropagation(): this
    {
        (<any>this).isPropagationStopped = true;

        return this;
    }
}

/**
 *
 * ListenerLike
 *
 * This interface describe the signature of a callback to be executed by event emitter when a event occur.
 *
 * @since Jan 1, 2019
 * @author Salathiel Genese <salathielgenese@gmail.com>
 *
 */
export interface ListenerLike<N extends string = string, PP extends any[] = any[], E extends Emitter = Emitter>
{
    (event: Event<N, E>, ...parameters: PP): any;
}
