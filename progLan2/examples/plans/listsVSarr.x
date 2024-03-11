// following is a list NOT an array

create myList <- inf{1,2,3};

entry function<> -> u32
{
    // adds new item
    // list keeps track of size (compile time) and automatically reallocs when requesting to add a new item
    myList <[new]- 4;

}