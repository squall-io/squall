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
    {}

    public get name(): N
    {
        throw new Error('method not yet implemented');
    }

    public get emitter(): E
    {
        throw new Error('method not yet implemented');
    }

    public get timestamp(): number
    {
        throw new Error('method not yet implemented');
    }

    public get isDefaultPrevented(): boolean
    {
        throw new Error('method not yet implemented');
    }

    public get isPropagationStopped(): boolean
    {
        throw new Error('method not yet implemented');
    }

    public preventDefault(): this
    {
        throw new Error('method not yet implemented');
    }

    public stopPropagation(): this
    {
        throw new Error('method not yet implemented');
    }
}

export interface Listener<N extends string = '', PP extends any[] = [], E extends Emitter<N> = Emitter<N>>
{
    (this: Event<N, E>, event: Event<N, E>, ...parameters: PP): any;
}
