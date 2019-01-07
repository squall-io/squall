import { Emitter, Event, ListenerLike } from "../../src/event";
import { v4 as uuid } from 'uuid';



describe( 'Emitter', () =>
{

    describe(' #trigger()', () =>
    {

        describe( 'returns an Event', () =>
        {

            it( 'instance', () =>
            {
                const event = new Emitter().trigger( uuid() );

                expect( event instanceof Event ).toBe( true );
            });

            it( 'in which .name matches #trigger() "event" parameter', () =>
            {
                const name: string = uuid();
                const emitter = new Emitter();
                const event = emitter.trigger( name );

                expect( event.name ).toBe( name );
            });

            it( 'in which .emitter matches the #trigger() parent emitter object', () =>
            {
                const emitter = new Emitter();
                const event = emitter.trigger( uuid() );

                expect( event.emitter ).toBe( emitter );
            });

            it( 'in which .timestamp matches the timestamp at which #trigger() was called', () =>
            {
                const emitter = new Emitter();
                const before = Date.now();
                const event = emitter.trigger( uuid() );
                const after = Date.now();

                expect( event.timestamp ).toBeLessThanOrEqual( after );
                expect( event.timestamp ).toBeGreaterThanOrEqual( before );
            });

        });

        it( 'calls distinct set of listeners per "event"', () =>
        {
            const emitter = new Emitter();
            const name_01: string = uuid();
            const name_02: string = uuid();
            const listener_01_01 = jasmine.createSpy();
            const listener_01_02 = jasmine.createSpy();
            const listener_02_01 = jasmine.createSpy();
            const listener_02_02 = jasmine.createSpy();

            emitter.on( name_01, listener_01_01, listener_01_02 );
            emitter.on( name_02, listener_02_01, listener_02_02 );

            emitter.trigger( name_01 );

            expect( listener_01_01 ).toHaveBeenCalled();
            expect( listener_01_02 ).toHaveBeenCalled();
            expect( listener_02_01 ).not.toHaveBeenCalled();
            expect( listener_02_02 ).not.toHaveBeenCalled();

            for( let spy of [listener_01_01, listener_01_02, listener_02_01, listener_02_02] )
            {
                spy.calls.reset();
            }

            emitter.trigger( name_02 );

            expect( listener_01_01 ).not.toHaveBeenCalled();
            expect( listener_01_02 ).not.toHaveBeenCalled();
            expect( listener_02_01 ).toHaveBeenCalled();
            expect( listener_02_02 ).toHaveBeenCalled();
        });

        it( 'calls all the registered "event" listeners once each', () =>
        {
            const name: string = uuid();
            const emitter = new Emitter();
            const listener_01 = jasmine.createSpy();
            const listener_02 = jasmine.createSpy();

            emitter.on( name, listener_01, listener_02 );
            emitter.trigger( name );

            expect( listener_01 ).toHaveBeenCalledTimes( 1 );
            expect( listener_02 ).toHaveBeenCalledTimes( 1 );
        });

        it( 'calls all the "event" registered listeners with the same "event" object', () =>
        {
            const name: string = uuid();
            const emitter = new Emitter();
            const listener_01 = jasmine.createSpy();
            const listener_02 = jasmine.createSpy();

            emitter.on( name, listener_01, listener_02 );

            const event = emitter.trigger( name );

            expect( listener_01 ).toHaveBeenCalledWith( event );
            expect( listener_02 ).toHaveBeenCalledWith( event );
        });

        it( 'calls all the "event" registered listeners with the provided "parameters"', () =>
        {
            const name: string = uuid();
            const emitter = new Emitter();
            const listener_01 = jasmine.createSpy();
            const listener_02 = jasmine.createSpy();
            const parameters = [ uuid(), uuid(), uuid(), uuid() ];

            emitter.on( name, listener_01, listener_02 );

            const event = emitter.trigger( name, ...parameters );

            expect( listener_01 ).toHaveBeenCalledWith( ...[ event, ...parameters ] );
            expect( listener_02 ).toHaveBeenCalledWith( ...[ event, ...parameters ] );
        });

        it( 'calls all the "event" registered listeners in the order they were registered', () =>
        {
            const name: string = uuid();
            const emitter = new Emitter();
            const listener_01 = jasmine.createSpy();
            const listener_02 = jasmine.createSpy();
            const listener_03 = jasmine.createSpy();

            emitter.on( name, listener_01, listener_02, listener_03 );
            emitter.trigger( name );

            expect( listener_01 ).toHaveBeenCalledBefore( listener_02);
            expect( listener_02 ).toHaveBeenCalledBefore( listener_03);
            expect( listener_03 ).toHaveBeenCalled();
        });

        it( 'calls the "event" registered listeners until "event.stopPropagation() is called"', () =>
        {
            const name: string = uuid();
            const emitter = new Emitter();
            const listener_01 = jasmine.createSpy();
            const listener_02 = jasmine.createSpy();
            const listener_03 = jasmine.createSpy( void 0, ( event: Event<string> ) => {
                event.stopPropagation();
            }).and.callThrough();
            const listener_04 = jasmine.createSpy();
            const listener_05 = jasmine.createSpy();

            emitter.on( name, listener_01, listener_02, listener_03, listener_04, listener_05 );
            emitter.trigger( name );

            expect( listener_01 ).toHaveBeenCalled();
            expect( listener_02 ).toHaveBeenCalled();
            expect( listener_03 ).toHaveBeenCalled();
            expect( listener_04 ).not.toHaveBeenCalled();
            expect( listener_05 ).not.toHaveBeenCalled();
        });

        it( 'unregisters registered listeners when after they have been called "times" (as given at Emitter#on() )', () =>
        {
            const name = uuid();
            const emitter = new Emitter();
            const times = 2 + Date.now() % 8;
            const listener_01 = jasmine.createSpy();
            const listener_02 = jasmine.createSpy();

            emitter.on( name, times, listener_01, listener_02 );

            for ( let i = 0; i < times; i++ )
            {
                emitter.trigger( name );
            }

            expect( emitter.has( name, <ListenerLike<string, any[]>>listener_01 ) ).toBe( false );
            expect( emitter.has( name, <ListenerLike<string, any[]>>listener_02 ) ).toBe( false );
        });

        it( 'unregisters NOT registered listeners before they have been called "times" (as given at Emitter#on() )', () =>
        {
            const name = uuid();
            const emitter = new Emitter();
            const times = 2 + Date.now() % 8;
            const listener_01 = jasmine.createSpy();
            const listener_02 = jasmine.createSpy();

            emitter.on( name, times, listener_01, listener_02 );

            for ( let i = 0; i < times-1; i++ )
            {
                emitter.trigger( name );
            }

            expect( emitter.has( name, <ListenerLike<string, any[]>>listener_01 ) ).toBe( true );
            expect( emitter.has( name, <ListenerLike<string, any[]>>listener_02 ) ).toBe( true );
        });

    });

    describe(' #on()', () =>
    {

        it( 'returns parent emitter object', () =>
        {
            const name: string = uuid();
            const listener_01 = () => {};
            const emitter = new Emitter();
            const returned = emitter.on( name, listener_01 );

            expect( returned ).toBe( emitter );
        });

        it( 'registers, for the given "event", all the provided "listeners" that are yet unregistered', () =>
        {
            const name: string = uuid();
            const listener_01 = () => {};
            const listener_02 = () => {};
            const emitter = new Emitter();

            emitter.on( name, listener_01, listener_02 );

            const returned = emitter.has( name, listener_01, listener_02 );

            expect( returned ).toBe( true );
        });

        it( 'registers, for the given "event", all the provided "listeners" that are yet unregistered, even when trigger limit is given ("times")', () =>
        {
            const name: string = uuid();
            const listener_01 = () => {};
            const listener_02 = () => {};
            const emitter = new Emitter();
            const times = Date.now() % 10;

            emitter.on( name, times, listener_01, listener_02 );

            const returned = emitter.has( name, listener_01, listener_02 );

            expect( returned ).toBe( true );
            expect( emitter.has( name, <ListenerLike<string, any[]>>( <unknown>times ) ) ).toBe( false );
        });

    });

    describe(' #off()', () =>
    {

        it( 'returns parent emitter object', () =>
        {
            const name: string = uuid();
            const listener_01 = () => {};
            const emitter = new Emitter();

            emitter.on( name, listener_01 );
            const returned = emitter.off( name, listener_01 );

            expect( returned ).toBe( emitter );
        });

        it( 'removes, for the given "event", those of the provided "listeners" that were registered', () =>
        {
            const name: string = uuid();
            const listener_01 = () => {};
            const emitter = new Emitter();

            emitter.on( name, listener_01 );
            emitter.off( name, listener_01 );

            const returned = emitter.has( name, listener_01 );

            expect( returned ).toBe( false );
        });

    });

    describe( '#has()', () =>
    {

        it( 'returns true if all "listeners" are registered for the given "event"', () =>
        {
            const name: string = uuid();
            const listener_01 = () => {};
            const listener_02 = () => {};
            const emitter = new Emitter();

            emitter.on( name, listener_01, listener_02 );

            const returned = emitter.has( name, listener_01, listener_02 );

            expect( returned ).toBe( true );
        });

        it( 'returns false if any of the "listeners" is not registered for the given "event"', () =>
        {
            const name: string = uuid();
            const listener_01 = () => {};
            const listener_02 = () => {};
            const listener_03 = () => {};
            const emitter = new Emitter();

            emitter.on( name, listener_01, listener_02 );

            const returned = emitter.has( name, listener_01, listener_02, listener_03 );

            expect( returned ).toBe( false );
        });

        it( 'returns false if no "listeners" is provided and none is registered for the given "event"', () =>
        {
            const name: string = uuid();
            const returned = new Emitter().has( name );

            expect( returned ).toBe( false );
        });

        it( 'returns true if no "listeners" is provided but at least one is registered for the given "event"', () =>
        {
            const name: string = uuid();
            const returned = new Emitter().on( name, () => {}).has( name );

            expect( returned ).toBe( true );
        });

    });

});
