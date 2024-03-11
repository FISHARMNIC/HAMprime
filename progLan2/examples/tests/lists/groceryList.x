entry function<> -> u32
{
    create gList <- inf{};
    create input <- {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
    create continue <- 1;

    while(continue == 1)
    {
        puts("--- Enter a grocery list item, or type 0 to finish ---\n");
        scanf_mini(input,"%16s");
        if(0 == @8 input)
        {
            create i <- 0;
            while(i <: gList_length)
            {
                printf_mini(gList[i], "%s\n");
                i <- # i + 1;
            }
            continue <- 0;
        }
        else
        {
            gList <[new]- strdup(input);
        }
    }
}