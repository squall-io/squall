/**
 *
 * Emitter class is at the root of the Event API.
 *
 * As it is, it stands as the corridor between the
 * source of an event (the code that create and/or
 * access an Emitter) and its events' targets (the
 * Listener).
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
        let index = 0;
        const EVENT = new Event( event, this );
        const steners: Listener<N, any[], this>[] = <any>emitters.get( this )!.get( event ) || [];

        while ( index < steners.length && !EVENT.isPropagationStopped )
        {
            steners[ index++ ]( EVENT, ...parameters );
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
    public on<N extends NN>(event: N, ...listeners: Listener<N, any[], this>[]): this
    {
        const map = emitters.get( this )!;
        const steners = ( map.has( event ) ? map
            : map.set( event, [] ) ).get( event )!;

        steners.push( ...(<any[]>listeners ).filter(
            listener => !steners!.includes( listener ) ) );
        steners.length || map.delete( event );

        return this;
    }

    /**
     *
     * Unregisters listeners for the given event.
     *
     * > - if a listener was not registered, nothing relevant happen of him.
     * > - if no listener is supplied, nothing happen
     *
     * @param event Event name
     * @param listeners Event listeners to unregister
     *
     */
    public off<N extends NN>(event: N, ...listeners: Listener<N, any[], this>[]): this
    {
        const steners = emitters.get( this )!.get( event );

        !!steners && steners.splice(
            0, steners.length, ...steners.filter(
                stener => !listeners.includes( <any>stener ) ) );

        return this;
    }

    /**
     *
     * Returns a boolean indicating if all given listeners
     * are registered on this emitter for the provided event.
     *
     * > If no listener is provided, the returned boolean indicates
     *   that at least one listener is registered under for the given event.
     *
     * @param event Event name
     * @param listeners Event listeners to check for registered state
     *
     */
    public has<N extends NN>(event: N, ...listeners: Listener<N, any[], this>[]): boolean
    {
        const steners = emitters.get( this )!.get( event );

        return !!steners && ( !listeners.length || listeners.every( listener => steners.includes( <any>listener ) ) );
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
export interface Listener<N extends string, PP extends any[] = [], E extends Emitter<N> = Emitter<N>>
{
    (event: Event<N, E>, ...parameters: PP): any;
}

const emitters = new WeakMap<Emitter<string>, Map<string, Listener<string>[]>>();

type EventAttribute = Exclude<keyof Event<string>, 'preventDefault' | 'stopPropagation'>;
const events = new WeakMap<Event<string>, { [ key in EventAttribute ]: Event<string>[key] }>();
