export const Singleton = ( overridable = false ) =>
    <C extends ConstructorLike>( target: C ): C =>
        class extends target
        {
            public constructor( ...parameters: any[] )
            {
                super( ...parameters );
                throw new Error( 'Not yet implemented' );
            }
        };
