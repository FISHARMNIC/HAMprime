# Proglan aka Ham2
A 32bit compiled programming language that runs on Linux

# What makes it unique?
* "Simple but complex"
  * incorporating the use of low-level memory access: Pointers and manual allocation (WIP)
  * High-level operations like seamless string operations (WIP)
* Combining the function-based ideolgy of C, and objects from Java
  * See `formats`, and how they can act as both structures and classes
* Fully compiled for speed
* Integration with Linux functions, like printf and mmap

# Currently working
* Variables
* Implicit typing
* Formats as structs
* Formats as classes
* Functions
* Nested If/elif statements
* Math
* Printing
* While loops
* Arrays
* File access

# Examples
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
    return # a + b;
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
classes
```
Car format 
{
    brand <- p8;
    price <- u32;
}

Car initializer<u32 modelNumber>
{
    this.brand <- "Honda";
    return this;
}

entry function<> -> u32
{
    create myCar <- Car<1>;
    printf_mini(myCar.brand, "%s\n");
}
```

# Changelog
First uploaded on Nov 4 with working variables, functions, formats, printing
2023  
* Nov 4 - Added if/elif
* Nov 5 - Added else and while
* Nov 6 - Added class initializers
* Nov 23 - Finally fixed malloc issue, fixed "return" keyword
* Nov 24 - Added methods
* Nov 25 - Fixed methods and their locals, indefinitley changed math to be prefixed with "#"
2024
* Jan 15 - Added arrays
* Feb 9 - Added fopen, fread, fwrite, and fclose
