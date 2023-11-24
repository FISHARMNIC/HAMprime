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
unspecified declaration: `create NAME <- VALUE`
specific declaration: `create NAME <- TYPE VALUE`
complex declaration: `create NAME <- TYPE<VALUE>`
format declaration: `create NAME <- TYPE<PROPERTY:VALUE,PROPERTY:VALUE>`
class initialization: `create NAME <- TYPE<VALUE>`

