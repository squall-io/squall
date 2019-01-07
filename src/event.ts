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
        listenersCountDown.set( this, new Map() );
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
        let countDown: number | void;
        const EVENT = new Event( event, this );
        const _eventsCountDownMap = listenersCountDown.get( this )!;
        const _listeners = emitters.get( this )!.get( event ) || <Set<ListenerLike<string>>>voidSet;
        const _listenersIterator: IterableIterator<ListenerLike<string, [], Emitter<string>>> = _listeners.values();
        const _listenersCountDown = _eventsCountDownMap.has( event ) ? _eventsCountDownMap.get( event )! : <WeakMap<ListenerLike<string>, number>>voidWeakMap;

        while( !EVENT.isPropagationStopped && ( listener = _listenersIterator.next().value ) )
        {
            listener( EVENT, ...<[]>parameters );
            countDown = _listenersCountDown.get( listener );

            if ( void 0 !== countDown )
            {
                _listenersCountDown.set( listener, --countDown );

                if ( !countDown )
                {
                    _listeners.delete( listener );
                    _listenersCountDown.delete( listener );
                }
            }
        }

        return EVENT;
    }

    /**
     *
     * Registers listeners under supplied event.
     *
     * @param event Event name
     * @param times Number of callbacks notifications before removal
     * @param listeners Event listeners to register for the supplied event
     *
     */
    public on<N extends NN>(event: N, ...listeners: ListenerLike<N, any[], this>[]): this;
    public on<N extends NN>(event: N, times: number, ...listeners: ListenerLike<N, any[], this>[]): this;
    public on<N extends NN>(event: N, times: number | ListenerLike<N, any[], this>, ...listeners: ListenerLike<N, any[], this>[]): this
    {
        const _listenersMap = emitters.get( this )!;
        times instanceof Function
            ? listeners.unshift( times ) && ( times = -1 )
            : isNaN( +times ) ? ( times = -1 ) : ( times = +times - +times % 1);
        const _listeners = ( _listenersMap.has( event ) ? _listenersMap : _listenersMap.set( event, new Set() ) ).get( event )!;

        if ( times <= 0 )
        {
            for ( let listener of listeners )
            {
                _listeners.add( <ListenerLike<string>> ( <unknown> listener ) );
            }
        }
        else
        {
            let countDownCounter = 0;
            const _listenersCountDownMap = listenersCountDown.get( this )!;
            const _listenersCountDown = _listenersCountDownMap.has( event ) ? _listenersCountDownMap.get( event )! : new WeakMap();

            for ( let listener of listeners )
            {
                _listeners.has( <ListenerLike<string>>( <unknown>listener ) )
                    || ++countDownCounter && _listenersCountDown.set( <ListenerLike<string>>( <unknown>listener ), +times );
                _listeners.add( <ListenerLike<string>> ( <unknown> listener ) );
            }

            countDownCounter && !_listenersCountDownMap.has( event ) && _listenersCountDownMap.set( event, _listenersCountDown );
        }

        _listeners.size && !_listenersMap.has( event ) && _listenersMap.set( event, _listeners );

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
                _listeners.delete( <ListenerLike<string>> ( <unknown> listener ) );
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
            _listeners.has( <ListenerLike<string>> ( <unknown> listener ) ) );
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
const voidWeakMap = new WeakMap();
const emitters = new WeakMap<Emitter<string>, Map<string, Set<ListenerLike<string>>>>();
const listenersCountDown = new WeakMap<Emitter<string>, Map<string, WeakMap<ListenerLike<string>, number>>>();

type EventAttribute = Exclude<keyof Event<string>, 'preventDefault' | 'stopPropagation'>;
const events = new WeakMap<Event<string>, { [ key in EventAttribute ]: Event<string>[key] }>();
