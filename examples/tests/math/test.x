create arr <- {2.3f, 3.6f, 1.1f};

entry function<> -> u32
{
    create i <- 0;
    while(i <: 4)
    {
        sum <- #f sum + arr[i];
        i <- # i + 1;
    }
    print_float(array);
}