# <img width="50" alt="Screen Shot 2024-02-10 at 9 33 08 AM" src="https://github.com/FISHARMNIC/proglan2/assets/73864341/9a5327b9-ffcc-425a-b927-ad829415715b"> Proglan aka Ham` 

A 32bit compiled programming language that runs on Linux

# What makes it unique?
* "Simple but complex"
  * incorporating the use of low-level memory access: Pointers and manual allocation
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
* Lists (not the same as arrays)
* File access
* Floating point
* Pointers
* Stdio
* Stack variables

# Todo
* Fix command line args
* HAM` include (currently only assembly)
* Multi-dimensional arrays
* Parameter in register or return in register
* Forward declaration
* Static properties
* Much more... (see in `main.js`)

# Docs [link](https://docs.google.com/document/d/1dvrnv1i9j71S5V8oIfRu-QUAKFk0uw6s5r6wOy7J6vY/edit?usp=sharing)

# Examples
### All of the following code compiles and runs
formats
```
Price format
{
    imported <- f32;
    domestic <- f32;
}

Car format
{
    price <- Price;
    company <- p8;
}

inflation function<Price original, f32 percent> -> u32
{
    original.domestic <- #f original.domestic * percent + original.domestic;
    original.imported <- #f original.domestic * percent + original.domestic;

    return 0;
}

entry function<> -> u32
{
    create myCar <- Car<price:Price<imported:5000,domestic:3000.0f>,company:"kia">;
    myCar.price.domestic <- 1000.0f;
    inflation(myCar.price, 0.1f);
    put_float(myCar.price.domestic);
}
```
math
```
sum function<f32 a, f32 b> -> f32
{
    return #f a + b;
}

entry function<> -> u32
{
    put_float(sum(3.5f,6.5f));
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
Square format
{
    length <- u32;
    color <- p8;
}

Square initializer<u32 len, p8 col>
{
    this.length <- len;
    this.color <- col;
}

Square volume method<u32 height> -> u32
{
    return # this.length * this.length * height;
}

Square area method<> -> u32
{
    return # this.length * this.length;
}

entry function<> -> u32
{
    create myRoom <- Square<length:10,color:"blue">;
    create dadsRoom <- Square<20, "red">;
    printf_mini(myRoom.volume(10), "My room cubic feet: %i\n");
    printf_mini(dadsRoom.length, "Dads room square feet: %i\n");
}
```
lists
```
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
```
pointers
```
create myArr <- {1,2,3,4};

entry function<> -> u32
{
    put_int(@u32 # myArr + 4);
}
```
stdio
```
entry function<> -> u32
{
    create bob <- 0;
    puts("Write in any number: ");
    scanf_mini($bob, "%i");
    printf_mini(bob, "You typed: %i\n");
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
* Feb 10 - Added floats and fixed functions taking parameters in wrong order
* March 8? - Added pointers and dereferencing
* March 9 - Added lists
* March 10 - Fixed nested formats
* March 13 - Fixed format nesting, added stack vars
