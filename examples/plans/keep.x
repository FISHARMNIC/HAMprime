genArr function<> -> p32
{
    newArr <- persistent {1, 2, 3, 4};
    return newArr;
}

entry function<> -> u32
{
    create myArr <- genArr();
    printf_mini(myArr[2], "reading %i (should be 3)");
}