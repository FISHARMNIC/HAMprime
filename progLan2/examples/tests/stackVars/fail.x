lists required; 

entry function<> -> u32
{
    // also test formats
    _stack_ counter <- 123;
    counter <- 456;
    _stack_ myArr <- inf{1,2,3};
    myArr <[new]- 4;
    put_int(counter);
    printf_mini(myArr[2], "\n%i\n");
}