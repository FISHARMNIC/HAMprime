car format 
{
    name <- p8;
    price <- u32;
}

convertToHonda function<car a> -> u32
{
    a.name <- "honda";
    printf_mini(a.name, "%s\n");
    printf_mini(a.price, "%i\n");
}

entry function<> -> u32
{
    create myCar <- car<name:"kia",price:2000>;
    convertToHonda(myCar);
}