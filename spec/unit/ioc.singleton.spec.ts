import { Singleton } from '../../src/ioc';



describe( '@Singleton', () =>
{

    describe( '()', () =>
    {

        it( 'restrict a single instance of the class it is applied on', () =>
        {
            @Singleton()
            class Stdin {}

            expect( () => new Stdin() ).not.toThrow();
            expect( () => new Stdin() ).toThrow();
        });

    });

});
