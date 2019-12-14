import { StageObservable } from "./observe";



/**
 *
 *
 *
 * @param self Should singleton-instance check be restricted to instances of this class - true - or be widened to this class descendents - false.
 *             Defaults to true.
 */
export const Singleton = ( self = true ) =>
{
    return <T extends { new( ..._: any[] ): any }>( target: T ): T =>
    {
        Reflect.defineProperty( target, singleton, { value: target });

        const clazz =  {
            [ target.name ]: class extends target
            {
                constructor( ...parameters: any[] )
                {
                    const SHOULD_HANDLE = ( !self || clazz === new.target ) && (<any>new.target)[ singleton ] === target;

                    if ( SHOULD_HANDLE && instances.has( target ) )
                    {
                        throw new Error( `Instance singleton of class '${ target.name }' already exists.` );
                    }

                    super( ...parameters );

                    if ( SHOULD_HANDLE )
                    {
                        instances.set( target, this );
                        Singleton.observables.get( target )?.notify( this );
                    }
                }
            },
        }[ target.name ];

        return clazz;
    };
};

Singleton.observables =new class extends WeakMap<{ new( ..._: any[] ): any }, StageObservable<[ {} ]>>
{
    get( key: { new( ..._: any[] ): any } ): StageObservable<[ {} ]> | undefined
    {
        return super.get( key ) ?? this.set( key, new StageObservable<[ {} ]>() ).get( key );
    }
};

const instances = new WeakMap<{ new( ..._: any[] ): any }, {}>();

const singleton = Symbol();