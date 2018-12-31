export class Emitter<NN extends string>
{
    public trigger<N extends NN>(event: N, ...parameters: any[]): Event<N, this>
    {
        throw new Error('method not yet implemented');
    }

    public on<N extends NN>(event: N, ...listeners: Listener<N, any[], this>[]): this
    {
        throw new Error('method not yet implemented');
    }

    public off<N extends NN>(event: N, ...listeners: Listener<N, any[], this>[]): this
    {
        throw new Error('method not yet implemented');
    }

    public has<N extends NN>(event: N, ...listeners: Listener<N, any[], this>[]): boolean
    {
        throw new Error('method not yet implemented');
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
    (this: Event<N, E>, event: Event<N, E>, ...parameters: PP): any;
}

type EventAttribute = Exclude<keyof Event<string>, 'preventDefault' | 'stopPropagation'>;
const events = new WeakMap< Event<string>, { [ key in EventAttribute ]: Event<string>[key] }>();
