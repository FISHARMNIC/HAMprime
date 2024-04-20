DriversLicense format 
{
    static minimumAge <- 16;
    static idIndex    <- 0;
    name <- p8;
    idNumber <- u32;
}

DriversLicense initializer<u32 age, p8 name>
{
    if(age < DriversLicense.minimumAge)
    {
        this.idNumber = -1;
    }
    else
    {

}

entry function<> -> u32
{
    create myCar <- Car<1>;
    printf_mini(myCar.brand, "%s\n");
}