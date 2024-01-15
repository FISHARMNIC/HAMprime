myArr <- {123, "hi", 456, 7777}; 
create store <- 0;

entry function<> -> u32
{
    // dynamically allocated
    myArr <[# 1 + 1]- 789;
    store <- myArr[1];
    printf_mini(myArr[0], "%i\n");
    printf_mini(store, "%s\n");
    printf_mini(myArr[2], "%i\n");
    printf_mini(myArr[# 2 + 1], "%i\n");

}