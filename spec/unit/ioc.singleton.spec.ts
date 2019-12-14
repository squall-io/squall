import { Singleton } from '../../src/ioc';



describe( '@Singleton( true )', () =>
{

    it( 'does not throw on first class instantiation', () =>
    {
        @Singleton( true ) class StandardInput {}

        expect( () => new StandardInput() ).not.toThrow();
    });

    it( 'does not throw on subclass instantiation', () =>
    {
        @Singleton( true ) class StandardInput {}
        class stdin extends StandardInput {}


        expect( () => new stdin() ).not.toThrow();
    });

    it( 'does not throw on subclass subsequent instantiations', () =>
    {
        @Singleton( true ) class StandardInput {}
        class stdin extends StandardInput {}

        new stdin();

        expect( () => new stdin() ).not.toThrow();
        expect( () => new stdin() ).not.toThrow();
    });

    it( 'does not throw on subclass instantiations, after decorated class instantiation', () =>
    {
        @Singleton( true ) class StandardInput {}
        class stdin extends StandardInput {}

        new StandardInput();

        expect( () => new stdin() ).not.toThrow();
        expect( () => new stdin() ).not.toThrow();
    });

    it( 'throws on subsequent class instantiations', () =>
    {
        @Singleton( true ) class StandardInput {}

        new StandardInput();

        expect( () => new StandardInput() ).toThrow();
        expect( () => new StandardInput() ).toThrow();
    });

    describe( 'extends @Singleton( false )', () =>
    {

        it( 'ressort to the nearest @Singleton(...) decorated class', () =>
        {
            @Singleton( true ) class A0 {}
            class A1 extends A0 {}

            @Singleton( false ) class A2 extends A1 {}
            class A3 extends A2 {}

            expect( () => new A0() ).not.toThrow();
            expect( () => new A0() ).toThrow();
            expect( () => new A1() ).not.toThrow();
            expect( () => new A1() ).not.toThrow();

            expect( () => new A2() ).not.toThrow();
            expect( () => new A2() ).toThrow();
            expect( () => new A3() ).toThrow();
            expect( () => new A3() ).toThrow();
        });

    });

    describe( 'extends @Singleton( true )', () =>
    {

        it( 'ressort to the nearest @Singleton(...) decorated class', () =>
        {
            @Singleton( true ) class A0 {}
            class A1 extends A0 {}

            @Singleton( true ) class A2 extends A1 {}
            class A3 extends A2 {}

            expect( () => new A0() ).not.toThrow();
            expect( () => new A0() ).toThrow();
            expect( () => new A1() ).not.toThrow();
            expect( () => new A1() ).not.toThrow();

            expect( () => new A2() ).not.toThrow();
            expect( () => new A2() ).toThrow();
            expect( () => new A3() ).not.toThrow();
            expect( () => new A3() ).not.toThrow();
        });

    });

});



describe( '@Singleton( false )', () =>
{

    it( 'does not throw on first class instantiation', () =>
    {
        @Singleton( false ) class StandardOutput {}

        expect( () => new StandardOutput() ).not.toThrow();
    });

    it( 'does not throw on first subclass instantiation', () =>
    {
        @Singleton( false ) class StandardOutput {}
        class Display extends StandardOutput {}

        expect( () => new Display() ).not.toThrow();
    });

    it( 'throws on subsequent class instantiations', () =>
    {
        @Singleton( false ) class StandardOutput {}

        new StandardOutput();

        expect( () => new StandardOutput() ).toThrow();
        expect( () => new StandardOutput() ).toThrow();
    });

    it( 'throws on subclass subsequent instantiations', () =>
    {
        @Singleton( false ) class StandardOutput {}
        class Display extends StandardOutput {}


        new Display();

        expect( () => new Display() ).toThrow();
        expect( () => new Display() ).toThrow();
    });

    it( 'throws on subclass instantiations, after decorated class instantiation', () =>
    {
        @Singleton( false ) class StandardOutput {}
        class Display extends StandardOutput {}


        new StandardOutput();

        expect( () => new Display() ).toThrow();
        expect( () => new Display() ).toThrow();
    });

    it( 'throws on decorated class instantiations, after subclass instantiation', () =>
    {
        @Singleton( false ) class StandardOutput {}
        class Display extends StandardOutput {}


        new Display();

        expect( () => new StandardOutput() ).toThrow();
        expect( () => new StandardOutput() ).toThrow();
    });

    describe( 'extends @Singleton( false )', () =>
    {

        it( 'ressort to the nearest @Singleton(...) decorated class', () =>
        {
            @Singleton( false ) class A0 {}
            class A1 extends A0 {}

            @Singleton( false ) class A2 extends A1 {}
            class A3 extends A2 {}

            expect( () => new A0() ).not.toThrow();
            expect( () => new A0() ).toThrow();
            expect( () => new A1() ).toThrow();
            expect( () => new A1() ).toThrow();

            expect( () => new A2() ).not.toThrow();
            expect( () => new A2() ).toThrow();
            expect( () => new A3() ).toThrow();
            expect( () => new A3() ).toThrow();
        });

    });

    describe( 'extends @Singleton( true )', () =>
    {

        it( 'ressort to the nearest @Singleton(...) decorated class', () =>
        {
            @Singleton( false ) class A0 {}
            class A1 extends A0 {}

            @Singleton( true ) class A2 extends A1 {}
            class A3 extends A2 {}

            expect( () => new A0() ).not.toThrow();
            expect( () => new A0() ).toThrow();
            expect( () => new A1() ).toThrow();
            expect( () => new A1() ).toThrow();

            expect( () => new A2() ).not.toThrow();
            expect( () => new A2() ).toThrow();
            expect( () => new A3() ).not.toThrow();
            expect( () => new A3() ).not.toThrow();
        });

    });

});
