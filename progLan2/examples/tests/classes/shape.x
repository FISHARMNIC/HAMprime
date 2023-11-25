Square format
{
    length <- u32;
    color <- p8;
}

Square initializer<u32 len, p8 col>
{
    this.length = len;
    this.color = col;
}

Square volume method<u32 height> -> u32
{
    return # this.length * this.length * height;
}

Square area method<> -> u32
{
    return # this.length * this.length;
}

entry function<> -> u32
{
    create myRoom <- Square<length:10,color:"blue">;
    create dadsRoom <- Square<20, "red">;
    printf_mini(myRoom.volume(10), "My room cubic feet: %i\n");
    printf_mini(dadsRoom.length, "Dads room square feet: %i\n");
}