Car format 
{
    name <- p8;
    model <- u32;
}

create arr <- {0,0,0};

entry function<> -> u32
{
    create i <- 0;
    while(i <: 3)
    {
        arr <[i]- Car<name:"kia",model:i>;
        i <- # i + 1;
    }

    create item <- @Car # arr + 4;
    printf_mini(item.model, "%i\n");
}