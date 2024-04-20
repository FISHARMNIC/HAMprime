Car format 
{
    name <- p8;
    price <- u32;
}

newHonda function<u32 price> -> Car
{
    create ret <- Car<name:"Honda",price:price>;
    ret.name <- "honda";
    return ret;
}
entry function<> -> u32
{
    create myCar <- newHonda(12000);
    put_string(myCar.name, 5);
}