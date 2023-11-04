create shoppingList <- linked<p8>;

entry function<> -> u32
{
    shoppingList[0] <- "apple";
    shoppingList[1] <- "beans";
    shoppingList[2] <- "strawberry";
    shoppingList.rewire(0,2);

    // is now strawberry
    printf_mini(shoppingList[1], "%s\n");
}