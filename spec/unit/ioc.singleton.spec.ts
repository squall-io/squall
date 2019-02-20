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

        it( 'restrict a single instance of the class it is applied on accounting descendent instances', () =>
        {
            @Singleton()
            class Stdin {}
            class SshStdin extends Stdin {};

            expect( () => new Stdin() ).not.toThrow();
            expect( () => new SshStdin() ).toThrow();
        });

    });

    describe( '( true )', () =>
    {

        it( 'restrict a single instance of the class it is applied on', () =>
        {
            @Singleton( false )
            class Stdin {}

            expect( () => new Stdin() ).not.toThrow();
            expect( () => new Stdin() ).toThrow();
        });

        it( 'restrict a single instance of the class it is applied on accounting descendent instances', () =>
        {
            @Singleton( false )
            class Stdin {}
            class SshStdin extends Stdin {};

            expect( () => new Stdin() ).not.toThrow();
            expect( () => new SshStdin() ).toThrow();
        });

    });

    describe( '( false )', () =>
    {

        it( 'restrict a single instance of the class it is applied on', () =>
        {
            @Singleton( false )
            class Stdin {}

            expect( () => new Stdin() ).not.toThrow();
            expect( () => new Stdin() ).toThrow();
        });

        it( 'restrict a single instance of the class it is applied on accounting descendent instances', () =>
        {
            @Singleton( false )
            class Stdin {}
            class SshStdin extends Stdin {};

            expect( () => new Stdin() ).not.toThrow();
            expect( () => new SshStdin() ).toThrow();
        });

    });

    describe( 'multi-level singleton', () =>
    {

        describe( '()', () =>
        {

            describe( '> ()', () =>
            {

                it( 'does not throw an error', () =>
                {
                    @Singleton() class A {}

                    expect( () =>
                    {
                        @Singleton()
                        class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

            });

            describe( '> ( false )', () =>
            {

                it( 'does not throw an error', () =>
                {
                    @Singleton() class A {}

                    expect( () =>
                    {
                        @Singleton( false ) class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

            });

            describe( '> ( true )', () =>
            {

                it( 'does not throw an error', () =>
                {
                    @Singleton() class A {}

                    expect( () =>
                    {
                        @Singleton( true ) class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

            });

        });

        describe( '( true )', () =>
        {

            describe( '> ()', () =>
            {

                it( 'does not throw an error', () =>
                {
                    @Singleton( true ) class A {}

                    expect( () =>
                    {
                        @Singleton()
                        class A1 extends A {}

                        A1;
                    }).toThrow();
                });

            });

            describe( '> ( false )', () =>
            {

                it( 'does not throw an error', () =>
                {
                    @Singleton( true ) class A {}

                    expect( () =>
                    {
                        @Singleton( false ) class A1 extends A {}

                        A1;
                    }).toThrow();
                });

            });

        });

        describe( '( false )', () =>
        {

            describe( '> ()', () =>
            {

                it( 'does not throw an error', () =>
                {
                    @Singleton( false ) class A {}

                    expect( () =>
                    {
                        @Singleton()
                        class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

            });

            describe( '> ( false )', () =>
            {

                it( 'does not throw an error', () =>
                {
                    @Singleton( false ) class A {}

                    expect( () =>
                    {
                        @Singleton( false ) class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

            });

            describe( '> ( true )', () =>
            {

                it( 'does not throw an error', () =>
                {
                    @Singleton( false ) class A {}

                    expect( () =>
                    {
                        @Singleton( true ) class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

            });

        });

    });

});
