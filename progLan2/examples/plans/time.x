entry function<> -> u32
{
    create i <- 0;
    while(i <= 1000)
    {
        put_floatln(#f i * 12.34f);
        i <- # i + 1;
    }
}