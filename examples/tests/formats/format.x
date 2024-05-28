Car format 
{
    name <- p8;
    price <- u32;
}

entry function<> -> u32
{
    create myCar <- Car<name:"kia",price:2000>;
    myCar.name <- "Honda";
    put_int(myCar.price);
}