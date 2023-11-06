Car format 
{
    brand <- p8;
    price <- u32;
}

Car initializer<u32 modelNumber>
{
    this.brand <- "Honda";
    return this;
}

entry function<> -> u32
{
    create myCar <- Car<1>;
}