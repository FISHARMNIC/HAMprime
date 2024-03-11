lists required;

create myArr <- {8,9,10};

entry function<> -> u32
{
    create myList <- inf{1,2,3,4,5,6};
    
    myList <[new]- 7;
    myList <[new]- 8;

    printf_mini(myList[6], "%i\n");
    printf_mini(myList[7], "%i\n");
}