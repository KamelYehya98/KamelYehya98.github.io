function addError(str)
{
    let parent = document.getElementById("errors_div");
    let element = document.createElement("p");
    element.style = "border-radius: 0em; color: black; background-color:rgb(255, 103, 103); border:2px solid rgb(71, 0, 0);";
    element.innerHTML = str;
    parent.appendChild(element);
}

function checkError(str)
{
    if(str == "emptyfields")
        addError("PLEASE FILL ALL THE FIELDS");
    if(str == "invalidemailandusername"){
        addError("INVALID USERNAME");
        addError("INVALID EMAIL ADDRESS");
    }
    if(str == "invalidemail")
        addError("INVALID EMAIL ADDRESS");
    if(str == "invalidusername")
        addError("INVALID USERNAME");
    if(str == "passwordnotmatch")
        addError("THE TWO PASSWORDS DON'T MATCH");
    if(str == "usernametaken")
        addError("USERNAME EXISTS");
    if(str == "sqlerror")
        addError("ERROR CONNECTING TO DATABASE....PLEASE TRY AGAIN");
    if(str == "wrongpassword")
        addError("INCORRECT PASSWORD");
    if(str == "wrongusername")
        addError("INCORRECT USERNAME");
    return;
}