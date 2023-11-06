car format 
{
    name <- p8;
    price <- u32;
}

// create something
create honda <- car<name:"honda",price:2000>;

// "free" the block, aka allow it to be reused
delete(honda)
