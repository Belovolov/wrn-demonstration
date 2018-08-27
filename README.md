# wrn-demonstration
Node.js app which is tightly linked to [wrn-server](https://github.com/Belovolov/wrn-server) app. It gets uploaded image from a user, 
crops it to 32x32 pixels size, filling the empty space with the black color, then requests WRN predictions from the wrn-server to 
finally return the visualisation of results.
