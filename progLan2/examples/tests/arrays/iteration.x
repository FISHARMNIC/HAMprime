create numbers <- {0,0,0,0,0,0,0,0,0,0,0};
create i <- 0;

fillWithSquares function<p32 arr> -> u32
{
    i <- 0;
    while(i <: 11)
    {
        arr <[i]- # i * i;
        i <- # i + 1;
    }
}

entry function<> -> u32
{
    fillWithSquares(numbers);
    i <- 0;
    while(i <: 11)
    {
        printf_mini(numbers[i], "%i\n");
        i <- # i + 1;
    }
}