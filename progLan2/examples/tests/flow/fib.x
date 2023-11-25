entry function<> -> u32
{
    create a <- 1;
    create b <- 1;
    create i <- 0;

    printf_mini(a, "%i\n");
    printf_mini(b, "%i\n");

    while(i <: 20)
    {

        a <- # a + b;
        printf_mini(a, "%i\n");

        b <- # a + b;
        printf_mini(b, "%i\n");
        
        i <- # i + 1;
    }
}