entry function<> -> u32
{
    create i <- 0;
    create b <- 0;
    while(i <: 100)
    {
        b <- 0;
        while(b <: 20)
        {
            put_int(b);
            b <- b + 1;
        }
        puts("\n");
        i <- i + 1;
    }
}