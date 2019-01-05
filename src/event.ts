/**
 *
 * Emitter class is at the root of the Event API.
 *
 * As it is, it stands as the corridor between the
 * source of an event (the code that create and/or
 * access an Emitter) and its events' targets (the
 * ListenerLike callback).
 *
 */
export class Emitter<NN extends string>
{
    public constructor()
    {
        emitters.set( this, new Map() );
    }

    /**
     *
     * Triggers an event.
     *
     * > This method will call/execute all registered listeners for this event.
     *
     * @param event Event name
     * @param parameters Listeners' parameters
     *
     */
    public trigger<N extends NN>(event: N, ...parameters: any[]): Event<N, this>
    {
        let listener;
        const EVENT = new Event( event, this );
        const _listeners: IterableIterator<ListenerLike<string, [], Emitter<string>>>
            = ( emitters.get( this )!.get( event ) || <Set<ListenerLike<string, [], Emitter<string>>>>voidSet).values();

        while( !EVENT.isPropagationStopped && ( listener = _listeners.next().value ) )
        {
            listener( EVENT, ...<[]>parameters );
        }

        return EVENT;
    }

    /**
     *
     * Registers listeners under supplied event.
     *
     * @param event Event name
     * @param listeners Event listeners to register for the supplied event
     *
     */
    public on<N extends NN>(event: N, ...listeners: ListenerLike<N, any[], this>[]): this
    {
        const map = emitters.get( this )!;
        const _listeners = ( map.has( event ) ? map : map.set( event, new Set() ) ).get( event )!;

        for ( let listener of listeners )
        {
            _listeners.add( <ListenerLike<string, [], Emitter<string>>> ( <any> listener ) );
        }

        _listeners.size && !map.has( event ) && map.set( event, _listeners );

        return this;
    }

    /**
     *
     * Unregisters listeners for the given event.
     *
     * > - if a listener was not registered, nothing relevant happen of him;
     * > - if no listener is supplied, nothing happen.
     *
     * @param event Event name
     * @param listeners Event listeners to unregister
     *
     */
    public off<N extends NN>(event: N, ...listeners: ListenerLike<N, any[], this>[]): this
    {
        const map = emitters.get( this )!;
        const _listeners = map.get( event );

        if ( _listeners )
        {
            for ( let listener of listeners )
            {
                _listeners.delete( <ListenerLike<string, [], Emitter<string>>> ( <any> listener ) );
            }
        }

        return this;
    }

    /**
     *
     * Returns a boolean indicating if all given listeners
     * are registered on this emitter for the provided event.
     *
     * > If no listener is provided, the returned boolean indicates
     *   that at least one listener is registered for the given event.
     *
     * @param event Event name
     * @param listeners Event listeners to check for registered state
     *
     */
    public has<N extends NN>(event: N, ...listeners: ListenerLike<N, any[], this>[]): boolean
    {
        const _listeners = emitters.get( this )!.get( event );

        return !!_listeners && !!_listeners.size && listeners.every( listener =>
            _listeners.has( <ListenerLike<string, [], Emitter<string>>> ( <any> listener ) ) );
    }
}

/**
 *
 * Event class is a shell-like used to drive event communication model.
 *
 */
export class Event<N extends string, E extends Emitter<N> = Emitter<N>>
{
    public constructor(name: N, emitter: E)
    {
        events.set( this, {
            name,
            emitter,
            timestamp: Date.now(),
            isDefaultPrevented: false,
            isPropagationStopped: false,
        });
    }

    /**
     *
     * Holds the immutable name of the event as it was triggered.
     *
     */
    public get name(): N
    {
        return <N>events.get( this )!.name;
    }

    /**
     *
     * Holds the immutable emmitter which triggered the event.
     *
     */
    public get emitter(): E
    {
        return <E>events.get( this )!.emitter;
    }

    /**
     *
     * Holds the immutable timestamp at which the event was instantiated.
     *
     */
    public get timestamp(): number
    {
        return events.get( this )!.timestamp;
    }

    /**
     *
     * Holds the default prevented state of the event.
     *
     */
    public get isDefaultPrevented(): boolean
    {
        return events.get( this )!.isDefaultPrevented;
    }

    /**
     *
     * Holds the propagationStopped state of the event.
     *
     */
    public get isPropagationStopped(): boolean
    {
        return events.get( this )!.isPropagationStopped;
    }

    /**
     *
     * Marks an event as to prevent default behaviour.
     *
     * > It is up to the developer to actually
     *   check and prevent the "default" behaviour.
     *
     */
    public preventDefault(): this
    {
        events.get( this )!.isDefaultPrevented = true;

        return this;
    }

    /**
     *
     * Marks an event as to stop its propagation through registered listeners.
     *
     */
    public stopPropagation(): this
    {
        events.get( this )!.isPropagationStopped = true;

        return this;
    }
}

/**
 *
 * Event listener interface.
 *
 * Callbacks with this signature are used to
 * listen events triggered by an event Emitter.
 *
 */
export interface ListenerLike<N extends string, PP extends any[] = [], E extends Emitter<N> = Emitter<N>>
{
    (event: Event<N, E>, ...parameters: PP): any;
}

const voidSet = new Set();
const emitters = new WeakMap<Emitter<string>, Map<string, Set<ListenerLike<string>>>>();

type EventAttribute = Exclude<keyof Event<string>, 'preventDefault' | 'stopPropagation'>;
const events = new WeakMap<Event<string>, { [ key in EventAttribute ]: Event<string>[key] }>();
