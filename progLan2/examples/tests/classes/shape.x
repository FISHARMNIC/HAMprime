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

Square area method<> -> u32
{
    return this.length * this.length;
}

entry function<> -> u32
{
    create myRoom <- Square<length:30,color:"blue">;
    create dadsRoom <- Square<50,"red">;
    printf_mini(myRoom.area(), "%i\n");
}