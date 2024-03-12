Price format
{
    imported <- u32;
    domestic <- u32;
}

Car format
{
    price <- Price;
    company <- p8;
}

entry function<> -> u32
{
    create myCar <- Car<price:Price<imported:5000,domestic:3000>,company:"kia">;
    create myVar <- myCar.price;
    put_int(myVar.imported);
}