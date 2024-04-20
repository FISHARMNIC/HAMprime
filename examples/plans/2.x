car format 
{
    name <- p8;
    price <- u32;
}
printable car 

entry function<> -> u32
{
    create myCar <- car<name:"kia",price:2000>;
    print(myCar) // automatically prints knowing all structure properties
}