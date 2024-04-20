Car format 
{
    brand <- p8;
    price <- u32;
}

Car initializer<u32 modelNumber>
{
    this.brand <- "Honda";
}

entry function<> -> u32
{
    create myCar <- Car<1>;
    printf_mini(myCar.brand, "%s\n");
}