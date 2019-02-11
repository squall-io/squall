import { Singleton } from '../../src/ioc';



describe( '@Singleton', () =>
{

    it( 'restrict a single instance of the class it is applied on', () =>
    {
        @Singleton()
        class Stdin {}

        new Stdin();

        expect( () => new Stdin() ).toThrow();
    });

});
