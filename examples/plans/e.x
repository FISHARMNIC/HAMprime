// BROKEN, COMPARISON NOT USING COMISS FOR FLOATS

/Users/squijano/Documents/progLan2/compiler/libs/math/math.s INCLUDED_ASM;

create total_fact <- 0.0f;
create counter_fact <- 0;

factorial function<f32 number> -> f32
{
    total_fact <- 1.0f;
    counter_fact <- 1;
    while(counter_fact <= number)
    {
        total_fact <- #f total_fact * counter_fact;
        counter_fact <- # counter_fact + 1;
    }
    return total_fact;
}

entry function<> -> u32
{
    put_float(mpow(5.0f, 2.0f));
}