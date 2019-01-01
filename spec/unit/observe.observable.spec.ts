import { Observable } from '../../src/observe';
import { v4 as uuid } from 'uuid';



describe( 'Observable', () =>
{

    describe( '#reset()', () =>
    {

        it( 'clears registered observers', () =>
        {
            const observer_1 = () => {};
            const observer_2 = () => {};
            const observer_3 = () => {};
            const observable = new Observable();

            observable.register( observer_1, observer_2, observer_3 );
            observable.reset();

            expect( observable.has( observer_1 ) ).toBe( false );
            expect( observable.has( observer_2 ) ).toBe( false );
            expect( observable.has( observer_3 ) ).toBe( false );
        });

        it( 'returns #reset() parent Observable object', () =>
        {
            const observable = new Observable();
            const returned = observable.reset();

            expect( returned ).toBe( observable );
        });

    });

    describe( '#notify()', () =>
    {

        it( 'calls all registered observers once', () =>
        {
            const observable = new Observable();
            const observer_1 = jasmine.createSpy();
            const observer_2 = jasmine.createSpy();
            const observer_3 = jasmine.createSpy();
            const parameters = [ uuid(), uuid(), uuid() ];

            observable.register( observer_1, observer_2, observer_3 );
            observable.notify( ...<[]>parameters );

            expect( observer_1 ).toHaveBeenCalledTimes( 1 );
            expect( observer_2 ).toHaveBeenCalledTimes( 1 );
            expect( observer_3 ).toHaveBeenCalledTimes( 1 );
        });

        it( 'returns #notify() parent Observable object', () =>
        {
            const observable = new Observable();
            const returned = observable.notify();

            expect( returned ).toBe( observable );
        });

        it( 'calls all registered observers with "values" as spread parameters', () =>
        {
            const observable = new Observable();
            const observer_1 = jasmine.createSpy();
            const observer_2 = jasmine.createSpy();
            const observer_3 = jasmine.createSpy();
            const parameters = [ uuid(), uuid(), uuid() ];

            observable.register( observer_1, observer_2, observer_3 );
            observable.notify( ...<[]>parameters );

            expect( observer_1 ).toHaveBeenCalledWith( ...parameters );
            expect( observer_2 ).toHaveBeenCalledWith( ...parameters );
            expect( observer_3 ).toHaveBeenCalledWith( ...parameters );
        });

    });

    describe( '#has()', () =>
    {

        it( 'returns true if every provided "observers" are registered', () =>
        {
            const observer_1 = () => {};
            const observer_2 = () => {};
            const observer_3 = () => {};
            const observable = new Observable();

            observable.register( observer_1, observer_2, observer_3 );

            expect( observable.has( observer_1 ) ).toBe( true );
            expect( observable.has( observer_1, observer_2, observer_3 ) ).toBe( true );
        });

        it( 'returns false if some provided "observers" are registered', () =>
        {
            const observer_1 = () => {};
            const observer_2 = () => {};
            const observer_3 = () => {};
            const observable = new Observable();

            observable.register( observer_1, observer_2 );

            expect( observable.has( observer_3 ) ).toBe( false );
            expect( observable.has( observer_1, observer_2, observer_3 ) ).toBe( false );
        });

    });

    describe( '#register()', () =>
    {

        it( 'registers "observers" to this observable', () =>
        {
            const observer_1 = () => {};
            const observer_2 = () => {};
            const observable = new Observable();

            observable.register( observer_1, observer_2 );

            expect( observable.has( observer_1 ) ).toBe( true );
            expect( observable.has( observer_2 ) ).toBe( true );
        });

        it( 'returns #register() parent Observable object', () =>
        {
            const observable = new Observable();
            const returned = observable.register();

            expect( returned ).toBe( observable );
        });

    });

    describe( '#unregister()', () =>
    {

        it( 'returns #unregister() parent Observable object', () =>
        {
            const observable = new Observable();
            const returned = observable.unregister();

            expect( returned ).toBe( observable );
        });

        it( 'unregisters "observers" to this observable', () =>
        {
            const observer_1 = () => {};
            const observer_2 = () => {};
            const observable = new Observable();

            observable.register( observer_1, observer_2 );
            observable.unregister( observer_1, observer_2 );

            expect( observable.has( observer_1 ) ).toBe( false );
            expect( observable.has( observer_2 ) ).toBe( false );
        });

    });

});
