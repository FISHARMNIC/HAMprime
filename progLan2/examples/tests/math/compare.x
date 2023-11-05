entry function<> -> u32
{
    if(111 :> 222)
    {
        put_int(333);
    }
    elif(444 == 555)
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
    else
    {
        printf_mini("none", "%s\n");
    }
}