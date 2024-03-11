create myArr <- {1,2,3,4};

entry function<> -> u32
{
    put_int(@u32 # myArr + 4);
}