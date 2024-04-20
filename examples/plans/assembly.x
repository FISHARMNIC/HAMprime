entry function<> -> u32
{
    create myNum <- 122;
    
    asm
    {
        addl $\0, \1;
        push \0;
        swap_stack;
        call put_int;
        swap_stack;
    }


}