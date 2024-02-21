# <img width="50" alt="Screen Shot 2024-02-10 at 9 33 08 AM" src="https://github.com/FISHARMNIC/proglan2/assets/73864341/9a5327b9-ffcc-425a-b927-ad829415715b"> Proglan aka Ham` 

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
* Floating point

# Docs [link](https://docs.google.com/document/d/1dvrnv1i9j71S5V8oIfRu-QUAKFk0uw6s5r6wOy7J6vY/edit?usp=sharing)


# Examples
### All of the following code compiles and runs
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
* Feb 10 - Added floats and fixed functions taking parameters in wrong order
