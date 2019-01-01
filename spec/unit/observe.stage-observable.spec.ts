import { StageObservable } from '../../src/observe';
import { v4 as uuid } from 'uuid';



describe( 'StageObservable', () =>
{

    describe( '#reset()', () =>
    {

        it( 'clears registered observers', () =>
        {
            const observer_1 = () => {};
            const observer_2 = () => {};
            const observer_3 = () => {};
            const observable = new StageObservable();

            observable.register( observer_1, observer_2, observer_3 );
            observable.reset();

            expect( observable.has( observer_1 ) ).toBe( false );
            expect( observable.has( observer_2 ) ).toBe( false );
            expect( observable.has( observer_3 ) ).toBe( false );
        });

        it( 'clears staged value (if any)', () =>
        {
            const observer_1 = jasmine.createSpy();
            const observer_2 = jasmine.createSpy();
            const observable = new StageObservable();
            const parameters = [ uuid(), uuid(), uuid() ];

            observable.notify( ...<[]>parameters );
            observable.reset();
            observable.register( observer_1, observer_2 );

            expect( observer_1 ).not.toHaveBeenCalled();
            expect( observer_2 ).not.toHaveBeenCalled();
        });

        it( 'returns #reset() parent StageStageObservable object', () =>
        {
            const observable = new StageObservable();
            const returned = observable.reset();

            expect( returned ).toBe( observable );
        });

    });

    describe( '#notify()', () =>
    {

        it( 'calls all registered observers once', () =>
        {
            const observable = new StageObservable();
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

        it( 'returns #notify() parent StageStageObservable object', () =>
        {
            const observable = new StageObservable();
            const returned = observable.notify();

            expect( returned ).toBe( observable );
        });

        it( 'calls all registered observers with "values" as spread parameters', () =>
        {
            const observable = new StageObservable();
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
            const observable = new StageObservable();

            observable.register( observer_1, observer_2, observer_3 );

            expect( observable.has( observer_1 ) ).toBe( true );
            expect( observable.has( observer_1, observer_2, observer_3 ) ).toBe( true );
        });

        it( 'returns false if some provided "observers" are registered', () =>
        {
            const observer_1 = () => {};
            const observer_2 = () => {};
            const observer_3 = () => {};
            const observable = new StageObservable();

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
            const observable = new StageObservable();

            observable.register( observer_1, observer_2 );

            expect( observable.has( observer_1 ) ).toBe( true );
            expect( observable.has( observer_2 ) ).toBe( true );
        });

        it( 'returns #register() parent StageStageObservable object', () =>
        {
            const observable = new StageObservable();
            const returned = observable.register();

            expect( returned ).toBe( observable );
        });

        it( 'calls NOT freshly registered "observers" if no value is staged', () =>
        {
            const observer_1 = jasmine.createSpy();
            const observer_2 = jasmine.createSpy();
            const observable = new StageObservable();

            observable.register( observer_1, observer_2 );

            expect( observer_1 ).not.toHaveBeenCalled();
            expect( observer_2 ).not.toHaveBeenCalled();
        });

        it( 'calls freshly registered "observers" (once each)', () =>
        {
            const observer_1 = jasmine.createSpy();
            const observer_2 = jasmine.createSpy();
            const observable = new StageObservable();
            const parameters = [ uuid(), uuid(), uuid() ];

            observable.notify( ...<[]>parameters );
            observable.register( observer_1, observer_2 );

            expect( observer_1 ).toHaveBeenCalledTimes( 1 );
            expect( observer_2 ).toHaveBeenCalledTimes( 1 );
        });

        it( 'calls freshly registered "observers" (once each) with spread staged value', () =>
        {
            const observer_1 = jasmine.createSpy();
            const observer_2 = jasmine.createSpy();
            const observable = new StageObservable();
            const parameters = [ uuid(), uuid(), uuid() ];

            observable.notify( ...<[]>parameters );
            observable.register( observer_1, observer_2 );

            expect( observer_1 ).toHaveBeenCalledWith( ...parameters );
            expect( observer_2 ).toHaveBeenCalledWith( ...parameters );
        });

    });

    describe( '#unregister()', () =>
    {

        it( 'unregisters "observers" to this observable', () =>
        {
            const observer_1 = () => {};
            const observer_2 = () => {};
            const observable = new StageObservable();

            observable.register( observer_1, observer_2 );
            observable.unregister( observer_1, observer_2 );

            expect( observable.has( observer_1 ) ).toBe( false );
            expect( observable.has( observer_2 ) ).toBe( false );
        });

        it( 'returns #unregister() parent StageStageObservable object', () =>
        {
            const observable = new StageObservable();
            const returned = observable.unregister();

            expect( returned ).toBe( observable );
        });

    });

});
