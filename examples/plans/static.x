DriversLicense format 
{
    static minimumAge <- 16;
    static id_counter <- 0;
    name <- p8;
    idNumber <- u32;
}

entry function<> -> u32
{
    printf_mini(DriversLicense.minimumAge, "%i\n");
}