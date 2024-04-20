create myArr <- 0;
create store <- 0;
create name <- "nico";

entry function<> -> u32
{
    // dynamically allocated
    myArr <- {123, name, 456, 7777}; 
    
    myArr <[2]- 789;
    store <- myArr[1];
    printf_mini(myArr[0], "%i\n");
    printf_mini(store, "%s\n");
    printf_mini(myArr[2], "%i\n");
    printf_mini(myArr[# 2 + 1], "%i\n");
}