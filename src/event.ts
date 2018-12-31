export class Emitter<NN extends string>
{
    public constructor()
    {
        emitters.set( this, new Map() );
    }

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

    public off<N extends NN>(event: N, ...listeners: Listener<N, any[], this>[]): this
    {
        const steners = emitters.get( this )!.get( event );

        !!steners && steners.splice(
            0, steners.length, ...steners.filter(
                stener => !listeners.includes( <any>stener ) ) );

        return this;
    }

    public has<N extends NN>(event: N, ...listeners: Listener<N, any[], this>[]): boolean
    {
        const steners = emitters.get( this )!.get( event );

        return !!steners && ( !listeners.length || listeners.every( listener => steners.includes( <any>listener ) ) );
    }
}

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

    public get name(): N
    {
        return <N>events.get( this )!.name;
    }

    public get emitter(): E
    {
        return <E>events.get( this )!.emitter;
    }

    public get timestamp(): number
    {
        return events.get( this )!.timestamp;
    }

    public get isDefaultPrevented(): boolean
    {
        return events.get( this )!.isDefaultPrevented;
    }

    public get isPropagationStopped(): boolean
    {
        return events.get( this )!.isPropagationStopped;
    }

    public preventDefault(): this
    {
        events.get( this )!.isDefaultPrevented = true;

        return this;
    }

    public stopPropagation(): this
    {
        events.get( this )!.isPropagationStopped = true;

        return this;
    }
}

export interface Listener<N extends string, PP extends any[] = [], E extends Emitter<N> = Emitter<N>>
{
    (event: Event<N, E>, ...parameters: PP): any;
}

const emitters = new WeakMap<Emitter<string>, Map<string, Listener<string>[]>>();

type EventAttribute = Exclude<keyof Event<string>, 'preventDefault' | 'stopPropagation'>;
const events = new WeakMap<Event<string>, { [ key in EventAttribute ]: Event<string>[key] }>();
