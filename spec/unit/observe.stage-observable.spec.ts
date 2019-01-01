describe( 'Observable', () =>
{

    describe( '#reset()', () =>
    {

        it( 'clears registered observers', () =>
        {
            //
        });

        it( 'clears staged value (if any)', () =>
        {
            //
        });

        it( 'returns #reset() parent StageObservable object', () =>
        {
            //
        });

    });

    describe( '#notify()', () =>
    {

        it( 'calls all registered observers', () =>
        {
            //
        });

        it( 'calls all registered observers once', () =>
        {
            //
        });

        it( 'returns #notify() parent StageObservable object', () =>
        {
            //
        });

        it( 'calls all registered observers with "values" as spread parameters', () =>
        {
            //
        });

    });

    describe( '#has()', () =>
    {

        it( 'returns true if every provided "observers" are registered', () =>
        {
            //
        });

        it( 'returns false if some provided "observers" are registered', () =>
        {
            //
        });

    });

    describe( '#register()', () =>
    {

        it( 'registers "observers" to this observable', () =>
        {
            //
        });

        it( 'returns #register() parent StageObservable object', () =>
        {
            //
        });

        it( 'calls freshly registered "observers" with spread staged value', () =>
        {
            //
        });

        it( 'calls NOT freshly registered "observers" if no value is staged', () =>
        {
            //
        });

    });

    describe( '#unregister()', () =>
    {

        it( 'unregisters "observers" to this observable', () =>
        {
            //
        });

        it( 'returns #unregister() parent StageObservable object', () =>
        {
            //
        });

    });

});
