//create sa <- "hello";
//create sb <- "hello";

create aa <- {1,2,3};
create ab <- {1,2,3};

entry function<> -> u32
{
    //printf_mini(sa @== sb,"%i\n");
    printf_mini(aa @== ab,"%i\n");
}