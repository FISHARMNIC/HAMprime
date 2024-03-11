create scores <- {-2.3f, -3.6f, 3.33f, 2.57f}; 

average function<p32 arr, u32 size> -> f32
{
    create sum <- 0.0f;
    create i <- 0;
    while(i <: size)
    {
        sum <- #f sum + arr[i];
        i <- # i + 1;
    }
    return #f sum / size;
}

entry function<> -> u32
{
    put_float(average(scores, 4));
}