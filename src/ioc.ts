import { ObserverLike } from './observe';



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
    <C extends ConstructorLike, S extends SingletonConstructorLike<InstanceType<C>>>( target: C ): S =>
    {
        let constructor: SingletonConstructorLike = <S><unknown> target;

        do {
            constructor = <SingletonConstructorLike> Reflect.getPrototypeOf( constructor );

            if ( singletonOverridableTrue.has( constructor ) )
            {
                throw new Error( `abc...` );
            }
        } while ( constructor !== baseConstructorPrototype || constructor[ singletonSymbol ] );

        const clazz: S = <S><unknown> {
            [ target.name ]: class extends target
            {
                public constructor( ...parameters: any[] )
                {
                    super( ...parameters );

                    if ( singletonConstructorToInstanceMap.has( target ) )
                    {
                        throw new Error( `${ target.name } already instantiated.` );
                    }

                    singletonInstanceToConstructorMap.set( this, target );
                    singletonConstructorToInstanceMap.set( target, this );
                }
            }
        }[ target.name ];

        overridable && singletonOverridableTrue.add( clazz );
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
const baseConstructorPrototype = Reflect.getPrototypeOf( Function );

const singletonOverridableTrue = new Set<SingletonConstructorLike>();
const singletonInstanceToConstructorMap = new WeakMap<{}, ConstructorLike>();
const singletonConstructorToInstanceMap = new WeakMap<ConstructorLike, {}>();

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
    public getSingletonConstructor<S extends SingletonConstructorLike>( instance: InstanceType<S> ): S | void
    {
        throw new Error( 'Not yet implemented' );
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
    public notify<T>({ constructor, singleton }: { constructor: ConstructorLike<T>, singleton: T }): this
    {
        throw new Error( 'Not yet implemented' );
    }

    /**
     *
     * Registers observers to watch for singleton constructor instantiation.
     *
     * @param constructor singleton constructor to watch instantiation
     * @param observers obervers to be called at instantiation OR right away if an instance exists already
     *
     */
    public register<C extends ConstructorLike>( constructor: C, ...observers: ObserverLike<[ InstanceType<C> ]>[] ): this
    {
        throw new Error( 'Not yet implemented' );
    }

    /**
     *
     * Unregisters observers for a given singleton constructor
     *
     * @param constructor singleton constructor to unregister obervers
     * @param observers obervers to be unregistered
     *
     */
    public unregister<C extends ConstructorLike>( constructor: C, ...observers: ObserverLike<[ InstanceType<C> ]>[] ): this
    {
        throw new Error( 'Not yet implemented' );
    }
};
