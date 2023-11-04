===all caps means change this to what you want===

## Casting
#####Type declaration
* Not to be confused with casting, this simply tells the compiler that what follows is a certain type. This can be done for quick and dirty casting, but for certain things it will not work 
* ex. `bob <- i8 100`
#####Casting:
* Converts a type (simple casting)
* can work with formats/structures (special casting)
* ex. `name <- p8<"bob">`
* ex. `car <- car_t<"Honda",15000>`
* Can be empty to create a new uninitiated type
ex. `create car <- car_t<>`

## variable declaration:
unspecified declaration:`create NAME <- VALUE`
specific declaration   :`create NAME <- TYPE VALUE`
complext declaration   :`create NAME <- TYPE<STUFF,STUFF,...>`

## function declaration:
initiate a function:`RETURN:function<TYPE PARAM, ...>`
- declares a function at that address
- This is then reformatted into a function type `funcT`
- Function types can be assigned to a variable to it becomes a function: `create bob <- funcT<RETURN TYPE, TYPE PARAM, TYPE PARAM, ...>`



OLD
`function<TYPE PARAM, ...> NAME -> RETURN TYPE`
ex.
`function<i32 n1, i32 n2> sum -> i32`
or 
`function<p8 name, i32 price> create_car -> car_t<>`

