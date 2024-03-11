// todo; 
Car format
{
    brand <- p8;
    year <- u32 <<singleset=true>>; // can only be set one time
    miles <- u32 <<public=r>>;      // from outside the class, no writing
}

