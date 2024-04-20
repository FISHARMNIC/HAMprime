/*
Upon creating a new format, you can specify an extra property that is called "methods".
- that property is a pointer to an array that holds all methods.
- From there on, every new method is added to that array

*/

Square format
{
    length <- u32;
    color <- p8;
    methods;
}

Square volume method<u32 height> -> u32
{
    return # height * this.area();
}

entry function<> -> u32
{
    create myRoom <- Square<length:10,color:"blue">;
    create dadsRoom <- Square<20, "red">;
    printf_mini(myRoom.volume(5), "My room cubic feet: %i (should be 500)\n");
    printf_mini(dadsRoom.length, "Dads room square feet: %i (should be 20)\n");
}