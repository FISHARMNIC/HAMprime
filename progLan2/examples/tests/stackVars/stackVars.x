lists required; 

entry function<> -> u32
{
    _stack_ counter <- 123;
    counter <- 456;
    
    _stack_ myArr <- {1,1,3};
    myArr <[2]- 2;

    _stack_ myList <- inf{4,5,6};
    myList <[new]- 7;

    printf_mini(counter,"var: %i\n");
    printf_mini(myArr[2], "index: %i\n");
    printf_mini(myList_length, "length: %i\n");
    
}