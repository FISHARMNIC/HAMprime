create sub <- 0;

factorial function<u32 number> -> u32
{
    if(number == 0)
    {
        return 1;
    }
    else
    {
        return # number * factorial(# number - 1);
    }
}

entry function<> -> u32
{
    factorial(1);
    //printf_mini(,"%i\n");
}