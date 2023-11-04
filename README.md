# proglan2
WIP new programming language that runs on Linux

## Idea
* Supports implicit typing
* Mixture of low level and high leve
  * Pointers, classes, untyped arrays etc
* Fully compiled into 32bit assembly

## Currently working
* Variables
* Dynamic typing
* Formats (similar to C structs)
* Functions
* Nested If/elif statements
* Math
* Printing

## Examples
### All of the following code compiles and runs
variables
```
create firstString <- p8<"word a">;
create secondString <- p8 "word b";
create thirdString <- "word c";

create numberOne <- u8<123>;
create numberTwo <- u16 123;
create numberThree <- 123;
```
formats
```
car format 
{
    name <- p8;
    price <- u32;
}

convertToHonda function<car a> -> u32
{
    a.name <- "honda";
    printf_mini(a.name, "%s\n");
    printf_mini(a.price, "%i\n");
}

entry function<> -> u32
{
    create myCar <- car<name:"kia",price:2000>;
    convertToHonda(myCar);
}
```
math
```
sum function<u8 a, u16 b> -> u32
{
    return a + b;
}

entry function<> -> u32
{
    put_int(sum(4,6));
}
```
if statements
```
entry function<> -> u32
{
    if(111 :> 222)
    {
        put_int(333);
    }
    elif(444 <: 555)
    {
        put_int(777);
        if(222 :> 444)
        {
            put_int(789);
        }
        elif(123 <: 456)
        {
            put_int(432);
        }
        put_int(987);
    }
    elif(333 == 888)
    {
        put_int(321);
    }
}
```
