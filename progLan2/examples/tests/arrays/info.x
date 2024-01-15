/*
three types of arrays: arrays, lists, and blocks
array:
    - ex. myArr
    - no specification needed
    - must have defined size
    - accept any type
list:
    - ex. myList
    - specified by adding "inf"
    - infinite size, and buffer is recomputed when expanding size
    - accept any type
    - slowest
block:
    - ex. myBlock
    - specified by adding type
    - defined size 
    - only one type
    - fastest, and most memory efficient


*/
create myArr <- {123, "hi", 456};
create myList <- inf{321, "bob", "chicken};
create myBlock <- u8{1, 2, 3};

entry function<> -> u32
{
    myArr <[0]- 1;
    myArr <[1]- 2;
    myArr <[2]- 3;
    myArr <[3]- 4;
}