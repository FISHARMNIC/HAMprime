genArr function<> -> p32
{
    keep newArr <- {1, 2, 3, 4};
    return newArr;
}

entry function<> -> u32
{
    create myArr <- genArr;
}