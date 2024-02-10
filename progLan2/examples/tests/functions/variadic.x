variadicFunc function<p8 ptype> -> u32
{
    create i <- 0;
    while(i <: va_argn)
    {
        printf_mini(va_args[0], ptype);
        i <- # i + 1;
    }
}

entry function<> -> u32
{
    variadicFunc("%i", 1,2,3);
}