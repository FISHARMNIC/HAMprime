
String format
{
    buffer <- p8;
    length <- method;
}

String initializer<p8 contents> -> String
{
    this.buffer <- contents;
}

String.length method<> -> u32
{
    return strlen(this);
}

entry function<> -> u32
{
    create myString <- String<"hello">;
}