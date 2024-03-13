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

inflation function<Price original, f32 percent> -> u32
{
    original.domestic <- #f original.domestic * percent + original.domestic;
    original.imported <- #f original.domestic * percent + original.domestic;

    return 0;
}

entry function<> -> u32
{
    create myCar <- Car<price:Price<imported:5000,domestic:3000.0f>,company:"kia">;
    myCar.price.domestic <- 1000.0f;
    inflation(myCar.price, 0.1f);
    put_float(myCar.price.domestic);
}