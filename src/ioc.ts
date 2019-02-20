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
    overridable: boolean;
    [ singletonSymbol ]: true;
}

export const singletonObservable = new class SingletonStageObservable
{
    public getSingletonConstructor<S extends SingletonConstructorLike>( instance: InstanceType<S> ): S | void
    {
        throw new Error( 'Not yet implemented' );
    }

    public notify<T>({ constructor, singleton }: { constructor: ConstructorLike<T>, singleton: T }): this
    {
        throw new Error( 'Not yet implemented' );
    }

    public register<C extends ConstructorLike>( constructor: C, ...observers: ObserverLike<[ InstanceType<C> ]>[] ): this
    {
        throw new Error( 'Not yet implemented' );
    }

    public unregister<C extends ConstructorLike>( constructor: C, ...observers: ObserverLike<[ InstanceType<C> ]>[] ): this
    {
        throw new Error( 'Not yet implemented' );
    }
};
