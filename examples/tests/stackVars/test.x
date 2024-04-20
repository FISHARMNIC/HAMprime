recursive function<u32 val> -> u32
{
    // need to make params stack vars;
}


entry function<> -> u32
{
    _stack_ counter <- 123;
    counter <- 456;
    put_int(counter);
}
