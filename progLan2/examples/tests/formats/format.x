car format 
{
    name <- p8;
    price <- u32;
}

entry function<> -> u32
{
    create myCar <- car<name:"kia",price:2000>;
    myCar.name <- "Honda";
    put_string(myCar.name, 5);
}