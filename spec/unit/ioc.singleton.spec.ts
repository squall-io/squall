import { Singleton, singletonObservable } from '../../src/ioc';



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

                it( 'throws no error', () =>
                {
                    @Singleton() class A {}

                    expect( () =>
                    {
                        @Singleton()
                        class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

                it( 'relates child instance to child constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton() class A1 extends A {};

                    const instance = new A1();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A1, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A1 );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates child instance not to parent constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton() class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A1();
                    singletonObservable.register( A, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

                it( 'relates parent instance to parent constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton() class A1 extends A {};

                    A1;
                    const instance = new A();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates parent instance not to child constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton() class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A();
                    singletonObservable.register( A1, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

            });

            describe( '> ( false )', () =>
            {

                it( 'throw no error', () =>
                {
                    @Singleton() class A {}

                    expect( () =>
                    {
                        @Singleton( false ) class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

                it( 'relates child instance to child constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton( false ) class A1 extends A {};

                    const instance = new A1();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A1, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A1 );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates child instance not to parent constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton( false ) class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A1();
                    singletonObservable.register( A, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

                it( 'relates parent instance to parent constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton( false ) class A1 extends A {};

                    A1;
                    const instance = new A();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates parent instance not to child constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton( false ) class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A();
                    singletonObservable.register( A1, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

            });

            describe( '> ( true )', () =>
            {

                it( 'throws no error', () =>
                {
                    @Singleton() class A {}

                    expect( () =>
                    {
                        @Singleton( true ) class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

                it( 'relates child instance to child constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton( true ) class A1 extends A {};

                    const instance = new A1();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A1, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A1 );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates child instance not to parent constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton( true ) class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A1();
                    singletonObservable.register( A, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

                it( 'relates parent instance to parent constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton( true ) class A1 extends A {};

                    A1;
                    const instance = new A();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates parent instance not to child constructor', () =>
                {
                    @Singleton() class A {}
                    @Singleton( true ) class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A();
                    singletonObservable.register( A1, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

            });

        });

        describe( '( true )', () =>
        {

            describe( '> ()', () =>
            {

                it( 'throws an error', () =>
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

                it( 'throws an error', () =>
                {
                    @Singleton( true ) class A {}

                    expect( () =>
                    {
                        @Singleton( false ) class A1 extends A {}

                        A1;
                    }).toThrow();
                });

            });

            describe( '> ( true )', () =>
            {

                it( 'throws an error', () =>
                {
                    @Singleton( true ) class A {}

                    expect( () =>
                    {
                        @Singleton( true ) class A1 extends A {}

                        A1;
                    }).toThrow();
                });

            });

        });

        describe( '( false )', () =>
        {

            describe( '> ()', () =>
            {

                it( 'throws no error', () =>
                {
                    @Singleton( false ) class A {}

                    expect( () =>
                    {
                        @Singleton()
                        class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

                it( 'relates child instance to child constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton() class A1 extends A {};

                    const instance = new A1();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A1, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A1 );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates child instance not to parent constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton() class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A1();
                    singletonObservable.register( A, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

                it( 'relates parent instance to parent constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton() class A1 extends A {};

                    A1;
                    const instance = new A();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates parent instance not to child constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton() class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A();
                    singletonObservable.register( A1, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

            });

            describe( '> ( false )', () =>
            {

                it( 'throws no error', () =>
                {
                    @Singleton( false ) class A {}

                    expect( () =>
                    {
                        @Singleton( false ) class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

                it( 'relates child instance to child constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton( false ) class A1 extends A {};

                    const instance = new A1();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A1, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A1 );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates child instance not to parent constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton( false ) class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A1();
                    singletonObservable.register( A, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

                it( 'relates parent instance to parent constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton( false ) class A1 extends A {};

                    A1;
                    const instance = new A();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates parent instance not to child constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton( false ) class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A();
                    singletonObservable.register( A1, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

            });

            describe( '> ( true )', () =>
            {

                it( 'throws no error', () =>
                {
                    @Singleton( false ) class A {}

                    expect( () =>
                    {
                        @Singleton( true ) class A1 extends A {}

                        A1;
                    }).not.toThrow();
                });

                it( 'relates child instance to child constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton( true ) class A1 extends A {};

                    const instance = new A1();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A1, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A1 );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates child instance not to parent constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton( true ) class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A1();
                    singletonObservable.register( A, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

                it( 'relates parent instance to parent constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton( true ) class A1 extends A {};

                    A1;
                    const instance = new A();
                    const spy = jasmine.createSpy();

                    singletonObservable.register( A, spy );

                    const arg0 = spy.calls.first().args[0];

                    expect( arg0.constructor ).toBe( A );
                    expect( arg0.instance ).toBe( instance );
                });

                it( 'relates parent instance not to child constructor', () =>
                {
                    @Singleton( false ) class A {}
                    @Singleton( true ) class A1 extends A {};

                    const spy = jasmine.createSpy();

                    new A();
                    singletonObservable.register( A1, spy );

                    expect( spy ).not.toHaveBeenCalled();
                });

            });

        });

    });

});
