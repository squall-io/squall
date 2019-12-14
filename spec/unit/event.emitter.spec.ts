import { Emitter, Event } from "../../src/event";
import { v4 as uuid } from 'uuid';



describe( 'Emitter', () =>
{

    describe( '#on(...)', () =>
    {

        it( 'register event listeners under event\'s name', () =>
        {
            const name = uuid();
            const listener_0 = jasmine.createSpy();
            const listener_1 = jasmine.createSpy();
            const emitter = new Emitter().on( name, listener_0, listener_1 );

            expect( emitter.has( name, listener_0, listener_1 ) ).toBe( true );
        });

        it( 'register event listeners under event\'s name with trigger countdow - `times`', () =>
        {
            const name = uuid();
            const listener_0 = jasmine.createSpy();
            const listener_1 = jasmine.createSpy();
            const emitter = new Emitter().on( name, listener_0 ).on( name, 1, listener_1 );

            expect( listener_0 ).toHaveBeenCalledTimes( 0 );
            expect( listener_1 ).toHaveBeenCalledTimes( 0 );
            expect( emitter.has( name, listener_0, listener_1 ) ).toBe( true );

            emitter.trigger( name );

            expect( listener_0 ).toHaveBeenCalledTimes( 1 );
            expect( listener_1 ).toHaveBeenCalledTimes( 1 );
            expect( emitter.has( name, listener_0 ) ).toBe( true );
            expect( emitter.has( name, listener_1 ) ).toBe( false );

            emitter.trigger( name );

            expect( listener_0 ).toHaveBeenCalledTimes( 2 );
            expect( listener_1 ).toHaveBeenCalledTimes( 1 );
            expect( emitter.has( name, listener_0 ) ).toBe( true );
            expect( emitter.has( name, listener_1 ) ).toBe( false );
        });

        it( 'register not event listener more than once under the same event\'s name', () =>
        {
            const name = uuid();
            const listener = jasmine.createSpy();

            new Emitter().on( name, listener, listener ).on( name, listener ).trigger( name );

            expect( listener ).toHaveBeenCalledTimes( 1 );
        });

        it( 'register event listener multiple times unders same event\'s name but different `times` countdown will override previous definition', () =>
        {
            const name = uuid();
            const listener = jasmine.createSpy();
            const emitter = new Emitter().on( name, 2, listener );

            emitter.trigger( name );
            emitter.on( name, 3, listener );
            emitter.trigger( name );
            emitter.trigger( name );
            emitter.trigger( name );
            emitter.trigger( name );

            expect( listener ).toHaveBeenCalledTimes( 4 );
        });

    });

    describe( '#has(...)', () =>
    {

        it( 'returns true if listener is regitered for event\'s name', () =>
        {
            const name = uuid();
            const listener = jasmine.createSpy();
            const emitter = new Emitter().on( name, listener );

            expect( emitter.has( name, listener ) ).toBe( true );
        });

        it( 'returns true if all listeners are regitered for event\'s name', () =>
        {
            const name = uuid();
            const listener_0 = jasmine.createSpy();
            const listener_1 = jasmine.createSpy();
            const emitter = new Emitter().on( name, listener_0, listener_1 );

            expect( emitter.has( name, listener_0, listener_1 ) ).toBe( true );
        });

        it( 'returns true if no listener is given but some listeners are registered for event\'s name', () =>
        {
            const name = uuid();
            const listener = jasmine.createSpy();
            const emitter = new Emitter().on( name, listener );

            expect( emitter.has( name ) ).toBe( true );
        });

        it( 'returns false if listener is not regitered for event\'s name', () =>
        {
            const name = uuid();
            const emitter = new Emitter();
            const listener = jasmine.createSpy();

            expect( emitter.has( name, listener ) ).toBe( false );
        });

        it( 'returns false if any of the listeners is not regitered for event\'s name', () =>
        {
            const name = uuid();
            const listener_0 = jasmine.createSpy();
            const listener_1 = jasmine.createSpy();
            const emitter = new Emitter().on( name, listener_0 );

            expect( emitter.has( name, listener_0, listener_1 ) ).toBe( false );
        });

        it( 'returns false if no listener is given and no listener is registered for event\'s name', () =>
        {
            const name = uuid();
            const emitter = new Emitter();

            expect( emitter.has( name ) ).toBe( false );
        });

    });

    describe( '#off(...)', () =>
    {

        it( 'removes event listeners, for those registered', () =>
        {
            const name = uuid();
            const listener = jasmine.createSpy();
            const emitter = new Emitter().on( name, listener );

            expect( emitter.has( name, listener ) ).toBe( true );

            emitter.off( name, listener );

            expect( emitter.has( name, listener ) ).toBe( false );
        });

        it( 'removes event listeners, for those registered but is silent otherwise', () =>
        {
            const name = uuid();
            const listener_0 = jasmine.createSpy();
            const listener_1 = jasmine.createSpy();
            const emitter = new Emitter().on( name, listener_0 );

            expect( emitter.has( name, listener_0 ) ).toBe( true );
            expect( emitter.has( name, listener_1 ) ).toBe( false );

            emitter.off( name, listener_0, listener_1 );

            expect( emitter.has( name, listener_0 ) ).toBe( false );
            expect( emitter.has( name, listener_1 ) ).toBe( false );
        });

    });

    describe( '#trigger(...)', () =>
    {

        it( 'returns an Event', () =>
        {
            const name = uuid();
            const event = new Emitter().trigger( name );

            expect( event instanceof Event ).toBe( true );
        });

        it( 'returns an Event with matching event\'s name', () =>
        {
            const name = uuid();
            const event = new Emitter().trigger( name );

            expect( event.name ).toBe( name );
        });

        it( 'returns an Event with matching event\'s Emitter', () =>
        {
            const name = uuid();
            const emitter = new Emitter();
            const event = emitter.trigger( name );

            expect( event.emitter ).toBe( emitter );
        });

        it( 'returns an Event with isDefaultPrevented false', () =>
        {
            const name = uuid();
            const event = new Emitter().trigger( name );

            expect( event.isDefaultPrevented ).toBe( false );
        });

        it( 'returns an Event with isPropagationStopped false', () =>
        {
            const name = uuid();
            const event = new Emitter().trigger( name );

            expect( event.isPropagationStopped ).toBe( false );
        });

        it( 'returns an Event with timestamp of event\'s triggered time', () =>
        {
            const name = uuid();
            const now = Date.now();
            const event = new Emitter().trigger( name );

            expect( event.timestamp ).toBeGreaterThanOrEqual( now );
            expect( event.timestamp ).toBeLessThanOrEqual( now + 10 );
        });

        it( 'calls registered event listeners', () =>
        {
            const name = uuid();
            const listener_0 = jasmine.createSpy();
            const listener_1 = jasmine.createSpy();

            new Emitter().on( name, listener_0, listener_1 ).trigger( name );

            expect( listener_0 ).toHaveBeenCalled();
            expect( listener_1 ).toHaveBeenCalled();
        });

        it( 'calls registered event listeners with event and ...parameters', () =>
        {
            const name = uuid();
            const listener_0 = jasmine.createSpy();
            const listener_1 = jasmine.createSpy();
            const parameters = [ { name }, [ name ] ];
            const event = new Emitter().on( name, listener_0, listener_1 ).trigger( name, ...parameters );


            expect( listener_0 ).toHaveBeenCalledWith( event, ...parameters );
            expect( listener_1 ).toHaveBeenCalledWith( event, ...parameters );
        });

        it( 'calls registered event listeners until some listener calls event.stopPropagation()', () =>
        {
            const name = uuid();
            const listener_0 = jasmine.createSpy();
            const listener_1 = jasmine.createSpy().and.callFake( ( event: Event ) => event.stopPropagation() );
            const listener_2 = jasmine.createSpy();
            const listener_3 = jasmine.createSpy();

            new Emitter().on( name, listener_0, listener_1, listener_2, listener_3 ).trigger( name );

            expect( listener_0 ).toHaveBeenCalled();
            expect( listener_1 ).toHaveBeenCalled();
            expect( listener_2 ).not.toHaveBeenCalled();
            expect( listener_3 ).not.toHaveBeenCalled();
        });

        it( 'unregister event listener/s after `times` calls, if times was specified', () =>
        {
            const name = uuid();
            const listener_0 = jasmine.createSpy();
            const listener_1 = jasmine.createSpy();
            const listener_2 = jasmine.createSpy();
            const emitter = new Emitter().on( name, listener_0 ).on( name, 1, listener_1 ).on( name, 2, listener_2 );

            expect( emitter.has( name, listener_0 ) ).toBe( true );
            expect( emitter.has( name, listener_1 ) ).toBe( true );
            expect( emitter.has( name, listener_2 ) ).toBe( true );

            emitter.trigger( name );

            expect( emitter.has( name, listener_0 ) ).toBe( true );
            expect( emitter.has( name, listener_1 ) ).toBe( false );
            expect( emitter.has( name, listener_2 ) ).toBe( true );

            emitter.trigger( name );

            expect( emitter.has( name, listener_0 ) ).toBe( true );
            expect( emitter.has( name, listener_1 ) ).toBe( false );
            expect( emitter.has( name, listener_2 ) ).toBe( false );

            emitter.trigger( name );

            expect( emitter.has( name, listener_0 ) ).toBe( true );
            expect( emitter.has( name, listener_1 ) ).toBe( false );
            expect( emitter.has( name, listener_2 ) ).toBe( false );

            expect( listener_0 ).toHaveBeenCalledTimes( 3 );
            expect( listener_2 ).toHaveBeenCalledTimes( 2 );
            expect( listener_1 ).toHaveBeenCalledTimes( 1 );
        });

        it( 'returns an Event with isDefaultPrevented true if some listener called event.preventDefault()', () =>
        {
            const name = uuid();
            const event = new Emitter().on( name, event => event.preventDefault() ).trigger( name );

            expect( event.isDefaultPrevented ).toBe( true );
        });

        it( 'returns an Event with isPropagationStopped true if some listener called event.stopPropagation()', () =>
        {
            const name = uuid();
            const event = new Emitter().on( name, event => event.stopPropagation() ).trigger( name );

            expect( event.isPropagationStopped ).toBe( true );
        });

    });

});
