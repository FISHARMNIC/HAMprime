entry function<> -> u32
{
    create a <- 1;
    create b <- 1;
    create i <- 0;

    put_int(a);
    put_int(b);

    while(i <: 20)
    {

        a <- a + b;
        put_int(a);

        b <- a + b;
        put_int(b)

        i <- i + 1;
    }
}