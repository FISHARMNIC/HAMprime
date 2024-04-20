// defualtPersistance false;

// meant to test stack vars ("this") not being overriden;

Price format
{
    imported <- f32;
    domestic <- f32;
}

Car format
{
    price <- Price;
    company <- p8;
}

Price initializer<f32 domestic_price>
{
    this.imported <- #f domestic_price + 2000.0f;
    this.domestic <- domestic_price;
}

Car initializer<f32 domestic_price, p8 company>
{
    this.price <- Price<domestic_price>;
    this.company <- company;
}

entry function<> -> u32
{
    create myCar <- Car<1000.0f,"kia">;
    put_float(myCar.price.imported);
    printf_mini(myCar.company, "\n%s\n");
}