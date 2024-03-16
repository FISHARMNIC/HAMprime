sum function<u32 i> -> u32
{
    printf_mini(i,"i: %i\n");
    if (i :> 0) 
    {
        _stack_ outV <- # i + sum(# i + -1);
        printf_mini(outV,"o: %i\n");
        return outV;
    } 
    else 
    {
        return 1;
    }
}

entry function<> -> u32
{
    printf_mini(sum(6),"final: %i\n");
}