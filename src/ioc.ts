import { ObserverLike, StageObservable } from './observe';



/**
 *
 * @Singleton
 * A decorator that is applied on constructors and enforces
 * singleton instance of the class it is applied on.
 *
 * @param overridable A boolean determining if `@Singleton` on descendant
 *  is allowed (`true`) or not (`false`)
 *
 * @example
 * ```
 * @Singleton() class A1 { }
 * class A1_a1 extends A1 { };
 *
 * new A1_a1(); // OK
 * new A1(); // Error: instance of A1 exists
 * new A1_a1(); // Error: instance of A1 exists
 * ```
 *
 * @example
 * ```
 * @Singleton( true ) class A1 { }
 *      class A1_b1 extends A1 { }
 * @Singleton( true ) class A1_b2 extends A1 { }
 * @Singleton( false ) class A1_b3 extends A1 { }
 *
 * new A1(); // OK
 * new A1_b1(); // Error: instance of A1 exists
 * new A1_b2(); // OK
 * new A1_b2(); // Error: instance of A1_b2 exists
 * new A1_b3(); // OK
 * new A1_b3(); // Error: instance of A1_b3 exists
 *
 * // OK
 * @Singleton() class A1_b2_c1 extends A1_b2 { }
 *
 * // Error: @Singleton is not allowed on A1_b3 subclasses
 * @Singleton() class A1_b3_c1 extends A1_b3 { }
 * ```
 *
 */
export const Singleton = ( overridable = false ) =>
    <C extends ConstructorLike, S extends SingletonConstructorLike>( target: C ): S =>
    {
        if ( (<S><unknown> target).overridable )
        {
            throw new Error( `Singleton is not applicable to class ${ target.name }` );
        }

        const clazz: S = <S><unknown> {
            [ target.name ]: class extends target
            {
                public constructor( ...parameters: any[] )
                {
                    super( ...parameters );
                    let constructor = singletonObservable.getConstructor( this )!;

                    if ( singletonObservable.getInstance( constructor ) )
                    {
                        throw new Error( `${ target.name } already instantiated.` );
                    }
                    else if ( constructor === clazz )
                    {
                        singletonObservable.notify({ constructor, instance: this });
                    }
                }
            }
        }[ target.name ];

        singletonConstructorToStageObservableMap.set( clazz, new StageObservable() );
        Reflect.defineProperty( clazz, 'overridable', {
            value: overridable,
            enumerable: false,
            writable: false,
        });
        Reflect.defineProperty( clazz, singletonSymbol, {
            enumerable: false,
            writable: false,
            value: true,
        });

        return clazz;
    }

const singletonSymbol = Symbol();
let instance: {} | void = void 0;
const baseConstructorPrototype = Reflect.getPrototypeOf( Function );
const observer = ({ instance: object }: { instance: {} }) =>
{
    instance = object;
};
const singletonConstructorToStageObservableMap = new WeakMap<SingletonConstructorLike, StageObservable<[ {} ]>>();

export interface SingletonConstructorLike<T extends {} = {}, P extends any[] = any[]> extends ConstructorLike<T, P>
{
    readonly overridable: boolean;
    readonly [ singletonSymbol ]: true;
}

/**
 *
 * A stage observable that report singleton instanciations.
 *
 * > **NOTE :** This instance constructor don't extends StageObservable, though it internally rely on it.
 *
 * Additionally, this instance provide a method to determine which singleton constructor a given instance belongs to.
 *
 */
export const singletonObservable = new class SingletonStageObservable
{
    /**
     *
     * Get the constructor of the given potentially singleton instance.
     *
     * @param instance instance to determine singleton constructor
     *
     */
    public getConstructor<S extends SingletonConstructorLike>( instance: InstanceType<S> ): S | undefined
    {
        let constructor = <S><unknown>instance.constructor;

        while ( constructor[ singletonSymbol ] &&
            constructor !== baseConstructorPrototype &&
            !Reflect.getOwnPropertyDescriptor(constructor, singletonSymbol) )
        {
            constructor = <S> Reflect.getPrototypeOf( constructor );
        }

        return constructor === baseConstructorPrototype ? void 0 : constructor;
    }

    /**
     *
     * Get unique instance of the given constructor, if available.
     * Return `void` otherwise.
     *
     * @param constructor singleton constructor to get unique instance of
     *
     */
    public getInstance<C extends ConstructorLike>( constructor: C ): InstanceType<C> | void
    {
        instance = void 0;
        singletonConstructorToStageObservableMap.has( <SingletonConstructorLike><unknown> constructor ) &&
            this.register( constructor, observer ).unregister( constructor, observer );

        return instance;
    }

    /**
     *
     * Calls/Executes the registered observers with a constructor and its singleton
     * as soon as possible
     *
     * > **NOTE :** This method, though public is intented to be called EXCLUSIVELY
     * > by internal API logic and not tier code.
     *
     * @param param0 an object map of a singleton contructor and its instance.
     *
     */
    public notify<S extends SingletonConstructorLike>({ constructor, instance }: { constructor: S, instance: InstanceType<S> }): this
    {
        const observable = singletonConstructorToStageObservableMap.get( constructor );

        observable && observable.notify({ constructor, instance });

        return this;
    }

    /**
     *
     * Registers observers to watch for singleton constructor instantiation.
     *
     * @param constructor singleton constructor to watch instantiation
     * @param observers obervers to be called at instantiation OR right away if an instance exists already
     *
     */
    public register<C extends ConstructorLike>( constructor: C, ...observers: ObserverLike<[{ constructor: C, instance: InstanceType<C> }]>[] ): this
    {
        const observable = singletonConstructorToStageObservableMap.get( <SingletonConstructorLike><unknown> constructor );

        observable && observable.register( ...<ObserverLike<[{}]>[]>observers );

        return this;
    }

    /**
     *
     * Unregisters observers for a given singleton constructor
     *
     * @param constructor singleton constructor to unregister obervers
     * @param observers obervers to be unregistered
     *
     */
    public unregister<C extends ConstructorLike>( constructor: C, ...observers: ObserverLike<[{ constructor: C, instance: InstanceType<C> }]>[] ): this
    {
        const observable = singletonConstructorToStageObservableMap.get( <SingletonConstructorLike><unknown> constructor );

        observable && observable.unregister( ...<ObserverLike<[{}]>[]>observers );

        return this;
    }
}();
