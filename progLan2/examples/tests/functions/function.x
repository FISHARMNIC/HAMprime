sum function<u8 a, u16 b> -> u32
{
    return a + b;
}

entry function<> -> u32
{
    put_int(sum(4,6));
}