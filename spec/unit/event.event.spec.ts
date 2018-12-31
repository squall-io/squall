import { Event } from '../../src/event';
import { v4 as uuid } from 'uuid';



describe( 'Event', () =>
{

    describe( '#name', () =>
    {
        it( 'is as given to constructor', () =>
        {
            const name = uuid();
            const event = new Event( name, <any>void 0 );

            expect( event.name ).toBe( name );
        });

    });

    describe( '#emitter', () =>
    {
        it( 'is as given to constructor', () =>
        {
            const emitter: any = uuid();
            const event = new Event( <any>void 0, emitter );

            expect( event.emitter ).toBe( emitter );
        });

    });

    describe( '#timestamp', () =>
    {
        it( 'equals the timestamp at which constructor was called', () =>
        {
            const before = Date.now();
            const event = new Event( <any>void 0, <any>void 0 );
            const after = Date.now();

            expect( event.timestamp ).toBeLessThanOrEqual( after );
            expect( event.timestamp ).toBeGreaterThanOrEqual( before );
        });

    });

    describe( '#isDefaultPrevented', () =>
    {
        it( 'is boolean', () =>
        {
            const event = new Event( <any>void 0, <any>void 0 );

            expect( typeof event.isDefaultPrevented ).toBe( 'boolean' );
        });

        it( 'defaults to false', () =>
        {
            const event = new Event( <any>void 0, <any>void 0 );

            expect( event.isDefaultPrevented ).toBe( false );
        });

    });

    describe( '#isPropagationStopped', () =>
    {

        it( 'is boolean', () =>
        {
            const event = new Event( <any>void 0, <any>void 0 );

            expect( typeof event.isPropagationStopped ).toBe( 'boolean' );
        });

        it( 'defaults to false', () =>
        {
            const event = new Event( <any>void 0, <any>void 0 );

            expect( event.isPropagationStopped ).toBe( false );
        });

    });

    describe( '#preventDefault()', () =>
    {

        it( 'returns parent event object', () =>
        {
            const event = new Event( <any>void 0, <any>void 0 );

            expect( event.preventDefault() ).toBe( event );
        });

        it( 'multiple calls are idempotent', () =>
        {
            const event = new Event( <any>void 0, <any>void 0 );

            event.preventDefault();
            event.preventDefault();

            expect( event.isDefaultPrevented ).toBe( true );
        });

        it( 'changes #isDefaultPrevented to true', () =>
        {
            const event = new Event( <any>void 0, <any>void 0 );

            event.preventDefault();

            expect( event.isDefaultPrevented ).toBe( true );
        });

    });

    describe( '#stopPropagation()', () =>
    {

        it( 'returns parent event object', () =>
        {
            const event = new Event( <any>void 0, <any>void 0 );

            expect( event.stopPropagation() ).toBe( event );
        });

        it( 'multiple calls are idempotent', () =>
        {
            const event = new Event( <any>void 0, <any>void 0 );

            event.stopPropagation();
            event.stopPropagation();

            expect( event.isPropagationStopped ).toBe( true );
        });

        it( 'changes #isDefaultPrevented to true', () =>
        {
            const event = new Event( <any>void 0, <any>void 0 );

            event.stopPropagation();

            expect( event.isPropagationStopped ).toBe( true );
        });

    });

});
