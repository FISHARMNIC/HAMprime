create string <- "word";
create pointer <- p32 0;

entry function<> -> u32
{
    pointer = string;
    create chars = u32:@pointer;
}