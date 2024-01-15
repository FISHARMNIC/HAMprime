create sub <- 0;

factorial function<u32 number> -> u32
{
    if(number == 0)
    {
        return 1;
    }
    else
    {
        sub <- # number - 1;
        return # number * factorial(sub);
    }
}

entry function<> -> u32
{
    printf_mini(factorial(1),"%i\n");
}