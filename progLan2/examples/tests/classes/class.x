Car format 
{
    brand <- p8;
    price <- u32;
}

Car initializer<u32 modelNumber>
{
    if(modelNumber == 0)
    {
        this.brand <- "Honda";
        this.price <- 50000;
    } 
    elif (modelNumber == 1)
    {
        this.brand <- "Kia";
        this.price <- 20000;
    }
    else 
    {
        this.brand <- "Unknown";
        this.price <- 0;
    }
}

entry function<> -> u32
{
    create myCar <- Car<0>;

    printf_mini(myCar.brand, "%s\n");
    printf_mini(myCar.price, "%i\n");
}