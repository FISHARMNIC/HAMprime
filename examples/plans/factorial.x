factorial function<u32 number> -> u32
{
    if(number == 0)
    {
        return 1;
    }
    else
    {
        return # number * factorial(# number + -1);
    }
}

entry function<> -> u32
{
    printf_mini(factorial(5),"%i\n");
}