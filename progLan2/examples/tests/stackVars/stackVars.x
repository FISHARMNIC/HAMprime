lists required; 

entry function<> -> u32
{
    _stack_ counter <- 123;
    counter <- 456;
    _stack_ myArr <- {1,2,3};
    myArr <[2]- 4;
    put_int(counter);
    printf_mini(myArr[2], "\n%i\n");
}